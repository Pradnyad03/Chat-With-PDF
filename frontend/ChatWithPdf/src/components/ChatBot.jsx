import { useState } from "react";
import TypingLoader from "./TypeLoarder";

export default function Chatbot() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [spinner, setSpinner] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please upload a PDF first");
      return;
    }

    setSpinner(true);

    // Add USER message
    const userMessage = { sender: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("question", question);

    try {
      const res = await fetch("http://localhost:8000/chat_with_pdf/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      // Add BOT message
      const botMessage = { sender: "bot", text: data.answer };
      setMessages((prev) => [...prev, botMessage]);

      setQuestion("");
      setSpinner(false);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error contacting backend." },
      ]);
      setSpinner(false);
    }
  };

  return (
    <div className="p-2 max-w-2xl mx-auto space-y-4">

      {/* CHAT WINDOW */}
      <div className="border rounded p-4 h-150 space-y-2 bg-black-100 text-black flex flex-col">
        {file && (
          <div className="bg-gray-800 text-white p-2 rounded text-sm mb-2">
            📄 PDF Loaded: <b>{file.name}</b>
          </div>
        )}
        <div className="overflow-y-auto space-y-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-2 rounded max-w-[80%] ${msg.sender === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-white"
                }`}
            >
              {msg.text}
            </div>
          ))}

          {/* 🔵 TYPING LOADER */}
          {spinner && <TypingLoader />}
        </div>
        {/* FORM */}
        <form onSubmit={handleSubmit} className="fixed-bottom text-white flex flex-row border rounded p-2 w-full h-15">
          <div className="flex items-center group">
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-white rounded-full w-10 h-10 flex items-center justify-center text-xl hover:bg-gray-900 hover:text-blue-500"
            >
              +
            </label>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm ml-3 text-white bg-black px-2 py-1 rounded">
              Upload PDF
            </span>
            <input
              id="file-upload"
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />
          </div>

          <input
            type="text"
            placeholder="Ask something about your PDF…"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="p-2 text-left w-full"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 rounded ml-2 h-10"
          >
            ask
          </button>
        </form>
      </div>
    </div>
  );
}