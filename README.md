Chat with PDF — RAG-based Document Question Answering (FastAPI + React + LLaMA)

A full-stack Retrieval-Augmented Generation (RAG) application that allows users to upload a PDF and ask questions about its content. The system retrieves relevant text chunks using embeddings and generates accurate answers using a local LLaMA model (via Ollama) — ensuring zero API cost and full offline capability.

**Features**
-- Backend (FastAPI)

Parses PDF documents using PyPDFLoader

Splits text intelligently with RecursiveCharacterTextSplitter

Generates embeddings using HuggingFace BGE MiniLM Embeddings

Stores & retrieves vectors using ChromaDB

Uses LLaMA (Ollama) to generate context-aware responses

Fully CORS-enabled API endpoint for client communication

-- Frontend (React + Tailwind CSS)

Clean, modern chat UI built with Vite + Tailwind v4

Upload PDF button with hover effects

Displays current active PDF name

Chat bubbles for user + bot messages

Loading “typing” indicator during answer generation

Smooth FormData-based POST request to FastAPI

 **How It Works (Architecture)**

1️⃣ User uploads a PDF + asks a question
2️⃣ Backend extracts PDF text and splits it into chunks
3️⃣ Chunks → Embeddings → Stored in ChromaDB
4️⃣ Vector search retrieves top-k relevant chunks
5️⃣ Retrieved context + question → LLaMA (Ollama)
6️⃣ LLaMA generates the final answer
7️⃣ UI displays the result in chat format

This architecture enables fast, accurate document question answering with full local processing.

**Tech Stack**
Backend

FastAPI

PyPDFLoader

LangChain

HuggingFace Embeddings

ChromaDB

Ollama (LLaMA)

Frontend

React

Vite

Tailwind CSS

Fetch API (FormData Uploads)

**API Endpoint**
POST /chat_with_pdf/

FormData fields:

file: PDF file

question: string

Response:

{
  "answer": "Generated answer from the PDF"
}

**UI Preview**
<img width="1920" height="917" alt="Screenshot (161)" src="https://github.com/user-attachments/assets/030af618-2369-42de-a4ca-df387aa479dd" />


**Run Locally**
Backend
cd backend
uvicorn app:app --reload

Frontend
cd frontend
npm install
npm run dev
