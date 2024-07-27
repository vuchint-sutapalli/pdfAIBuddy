import Documents from "@/components/Documents";
import React from "react";

export const dynamic = "force-dynamic";
export default function Dashboard() {
  return (
    <div className="max-w-7xl h-full mx-auto">
      <h1 className="text-3xl p-5 bg-gray-100 font-extralight text-indigo-600">
        My Documents
      </h1>
      <Documents />
      {/* Documents */}
    </div>
  );
}
