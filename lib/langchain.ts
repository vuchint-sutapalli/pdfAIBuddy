import { ChatOpenAI } from "@langchain/openai";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";

import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import pineconeClient from "./pinecone";

import { PineconeStore } from "@langchain/pinecone";
import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";

const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4o",
});

export const indexName = "vuchintpersonal";

async function fetchMessagesFromDB(docId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("user not found");
  }

  const chats = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .collection("chats")
    .orderBy("createdAt", "desc")
    .get();

  const chatHistory = chats.docs.map((doc) =>
    doc.data().role === "human"
      ? new HumanMessage(doc.data().message)
      : new AIMessage(doc.data().message)
  );

  console.log(` fetched last ${chatHistory.length} messages successfully`);

  console.log(chatHistory.map((msg) => msg.content.toString()));

  return chatHistory;
}

export async function generateDocs(docId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("user not found");
  }
  console.log("fetching download url from firebase admin");

  const firebaseRef = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .get();

  const downloadUrl = firebaseRef.data()?.downloadUrl;
  if (!downloadUrl) {
    throw new Error("downloadurl not found");
  }

  console.log(`download url fetched successfully:  ${downloadUrl}`);

  const response = await fetch(downloadUrl);
  const data = await response.blob();
  //load pdf doc from specified path
  const loader = new PDFLoader(data);
  const docs = await loader.load();

  //split document in to  smaller parts for easier processing

  console.log("splitting doc");
  const splitter = new RecursiveCharacterTextSplitter();

  const splitDocs = await splitter.splitDocuments(docs);
  console.log(`split in to ${splitDocs.length} parts`);

  return splitDocs;
}

async function namespaceExists(
  index: Index<RecordMetadata>,
  nameSpace: string
) {
  if (nameSpace === null) {
    throw new Error("no namespace");
  }

  const { namespaces } = await index.describeIndexStats();
  return namespaces?.[nameSpace] !== undefined;
}

export async function generateEmbeddingsInPineconeVectorStore(docId: string) {
  console.log("called generate embedddd", docId);
  const { userId } = await auth();
  if (!userId) {
    throw new Error("user not found");
  }

  let pineconeVectorStore;

  console.log("Generating embeddings ...");

  const embeddings = new OpenAIEmbeddings();

  const index = await pineconeClient.index(indexName);

  const nameSpaceAlreadyExists = await namespaceExists(index, docId);
  if (nameSpaceAlreadyExists) {
    console.log(`namespace ${docId} already exists, reusing`);

    pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: docId,
    });

    return pineconeVectorStore;
  } else {
    //If namespace doesnt exist, download pdf from  firestore  via stored download url & generate embeddings  and store in pinecone vector store
    const splitDocs = await generateDocs(docId);

    console.log(
      `storing the embeddings in namespace ${docId} in ${indexName} pinecone vector store`
    );
    pineconeVectorStore = await PineconeStore.fromDocuments(
      splitDocs,
      embeddings,
      {
        pineconeIndex: index,
        namespace: docId,
      }
    );
    return pineconeVectorStore;
  }
}

const generateLangchainCompletion = async (docId: string, question: string) => {
  let pineconeVectorStore;
  pineconeVectorStore = await generateEmbeddingsInPineconeVectorStore(docId);

  if (!pineconeVectorStore) {
    throw new Error("Pinecone Vector store not forund");
  }
  console.log("creating a retriever..");
  const retriever = pineconeVectorStore.asRetriever();

  const chatHistory = await fetchMessagesFromDB(docId);

  //define prompy template

  console.log("defining template");

  const historyAwarePrompt = ChatPromptTemplate.fromMessages([
    ...chatHistory,
    ["user", "{input}"],
    [
      "user",
      "Given the above  conversation, generate a  search query  to look up in  order to get  information relevant to the  conversation",
    ],
  ]);

  console.log("crating a history aware retriever chain");

  const historyAwareRetrieverChain = await createHistoryAwareRetriever({
    llm: model,
    retriever,
    rephrasePrompt: historyAwarePrompt,
  });

  console.log("Define a prompt template for answering questions");

  //may or may not need
  const historyAwareRetrievalPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Answer the users  question  based on  the below  context:\n\n{context}",
    ],
    ...chatHistory,
    ["user", "{input}"],
  ]);

  //create a  chain to combine the retrieved  documents in to  coherent response

  console.log("creating a  document combining chain");

  const historyAwareCombineDocsChain = await createStuffDocumentsChain({
    llm: model,
    prompt: historyAwareRetrievalPrompt,
  });

  //create the main retrieval chain that combines the  history aware retriever and  document combining chains
  console.log("creating a  main retrieval chain");

  const conversationalRetrieverchain = await createRetrievalChain({
    retriever: historyAwareRetrieverChain,
    combineDocsChain: historyAwareCombineDocsChain,
  });

  console.log("running the  chain with a sample conversation");

  const reply = await conversationalRetrieverchain.invoke({
    chat_history: chatHistory,
    input: question,
  });

  console.log(reply.answer);
  return reply.answer;
};

export { model, generateLangchainCompletion };
