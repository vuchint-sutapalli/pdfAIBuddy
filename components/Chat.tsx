"use client";

import { useCollection } from "react-firebase-hooks/firestore";
import React, {
  useEffect,
  useRef,
  useState,
  FormEvent,
  useTransition,
} from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2Icon } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { orderBy, collection, query } from "firebase/firestore";
import { db } from "@/firebase";
import { askQuestion } from "@/actions/askQuestion";
import ChatMessage from "./ChatMessage";

export type Message = {
  id?: string;
  role: "human" | "ai" | "placeholder";
  message: string;
  createdAt: Date;
};
function Chat({ id }: { id: string }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const bottomOfChatRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();

  const { user } = useUser();
  //snapshot realtime listener to chat
  const [snapshot, loading, error] = useCollection(
    user &&
      query(
        collection(db, "users", user?.id, "files", id, "chat"),
        orderBy("createdAt", "asc")
      )
  );

  useEffect(() => {
    bottomOfChatRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);
  useEffect(() => {
    if (!snapshot) return;
    console.log("updated snapshot");
    const lastMessage = messages.pop();

    if (lastMessage?.role == "ai" && lastMessage.message == "Thinking...") {
      return;
    }
    const newMessages = snapshot.docs.map((doc) => {
      const { role, message, createdAt } = doc.data();
      return {
        id: doc.id,
        role,
        message,
        createdAt: createdAt.toDate(),
      };
    });
    setMessages(newMessages);
  }, [snapshot]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const q = input;
    setInput("");

    setMessages((prev) => [
      ...prev,
      {
        role: "human",
        message: q,
        createdAt: new Date(),
      },
      {
        role: "ai",
        message: "Thinking...",
        createdAt: new Date(),
      },
    ]);
    startTransition(async () => {
      const { success, message } = await askQuestion(id, q);
      if (!success) {
        setMessages((prev) =>
          prev.slice(0, prev.length - 1).concat([
            {
              role: "ai",
              createdAt: new Date(),
              message: `whoops.. ${message}`,
            },
          ])
        );
      }
    });
  };
  return (
    <div className="flex flex-col h-full overflow-scroll">
      <div className="w-full flex-1">
        {loading ? (
          <div className=" flex items-center justify-center">
            <Loader2Icon className="animate-spin h-20 w-20  text-indigo-600 mt-20" />
          </div>
        ) : (
          <div>
            {messages.length === 0 && (
              <ChatMessage
                key="placeholder"
                message={{
                  role: "ai",
                  message: "Ask me anything  about  the document!",
                  createdAt: new Date(),
                }}
              />
            )}

            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} />
              //   <div key={m.id}>
              //     <p>{m.message}</p>
              //   </div>
            ))}

            <div ref={bottomOfChatRef}></div>
          </div>
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className=" flex static bottom-0 p-5  space-x-1  bg-indigo-600/75"
      >
        <Input
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button type="submit" disabled={!input || isPending}>
          Ask
        </Button>
      </form>
    </div>
  );
}

export default Chat;
