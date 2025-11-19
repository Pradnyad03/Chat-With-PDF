import React, { useState } from "react";
import ChatBox from "./components/ChatBot";

export default function App(){
  const [pdfFile, setPdfFile] = useState(null);
  const [sessionId, setSessionId] = useState(null); // optional if you want sessions later

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-black text-white">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-4 ">Chat with PDF</h1>

        <ChatBox pdfFile={pdfFile} sessionId={sessionId} />
      </div>
    </div>
  );
}
