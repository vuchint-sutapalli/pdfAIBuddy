import { Button } from "@/components/ui/button";
import {
  BrainCogIcon,
  EyeIcon,
  GlobeIcon,
  MonitorSmartphoneIcon,
  ServerCogIcon,
  ZapIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
0;

const features = [
  {
    name: "Store Your PDF Documents",
    desc: "Keep all your important PDF files securely stored and easily accessible anytime, anywhere.",
    icon: GlobeIcon,
  },
  {
    name: "Blazing Fast Responses",
    desc: "Experience lightning-fast answers to your queries, ensuring you get the information you need instantly.",
    icon: BrainCogIcon,
  },
  {
    name: "Chat Memorisation",
    desc: "Our intelligent chatbot remembers previous interactions, providing a seamless and personalized experience.",
    icon: EyeIcon,
  },
  {
    name: "Interactive PDF Viewer",
    desc: "Engage with your PDFs like never before using our intuitive and interactive viewer.",
    icon: MonitorSmartphoneIcon,
  },
  {
    name: "Cloud Backup",
    desc: "Rest assured knowing your documents are safely backed up on the cloud, protected from loss or damage.",
    icon: MonitorSmartphoneIcon,
  },
  {
    name: "Responsive Across Devices",
    desc: "Access and chat with your PDFs seamlessly on any device, whether it's your desktop, tablet, or smartphone.",
    icon: ZapIcon,
  },
];

export default function Home() {
  return (
    <main className=" overflow-scroll p-2 lg:p-5 bg-gradient-to-bl from-white to-indigo-600 flex-1">
      <div className="bg-white py-24 sm:py-32 rounded-md drop-shadow-xl">
        <div className="flex flex-col justify-center items-center mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-indigo-700 font-semibold text-base leading-7">
              Your Interactive Document companion
            </h2>
            <p className="mt-2 text-3xl tracking-tight font-bold text-gray-900 sm:text-6xl">
              Transform Your PDFs into Interactive Conversations
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Introducing
              <span className="font-bold text-indigo-600">Chat with PDF.</span>
              <br />
              <br />
              Upload your document, and our chatbot will answer questions,
              summarize content, and answer all your Qs. Ideal for everyone,
              <span className="text-indigo-600">Chat with PDF</span>
              turns static documents into
              <span className="font-bold">dynamic conversations,</span>
              enhancing productivity 10x fold effortlessly.
            </p>
          </div>
          <Button asChild className="mt-10">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
        <div className="relative overflow-hidden pt-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Image
              className=" mb-[0%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
              src="https://i.imgur.com/VciRSTI.jpeg"
              alt="App Screenshot"
              width={2432}
              height={1442}
            ></Image>
            <div aria-hidden="true" className="relative">
              <div className="absolute bottom-0 -inset-x-32 bg-gradient-to-t from-white/95 pt-[5%]"></div>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
          <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
            {features.map((feature) => (
              <div className="relative pl-9" key={feature.name}>
                <dt className="inline font-semibold text-gray-900">
                  <feature.icon
                    aria-hidden="true"
                    className="absolute left-1 top-1 h-5 w-5 text-indigo-600"
                  ></feature.icon>
                </dt>
                <dd className="inline">{feature.desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </main>
  );
}
