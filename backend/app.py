from fastapi import FastAPI, File, UploadFile, Form
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.llms import Ollama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough, RunnableLambda
from langchain_core.output_parsers import StrOutputParser
import tempfile, os

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

@app.post("/chat_with_pdf/")
async def chat_with_pdf(
    file: UploadFile = File(...),
    question: str = Form(...)
):
    # Save uploaded PDF temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        temp_file.write(await file.read())
        temp_path = temp_file.name

    # Load and split PDF
    loader = PyPDFLoader(temp_path)
    documents = loader.load()

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_documents(documents)

    # Use free local embeddings
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vectorstore = Chroma.from_documents(chunks, embedding=embeddings)
    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

    # ✅ Local LLM (no API key, no quota)
    llm = Ollama(model="phi3:mini")


    # Prompt for question answering
    prompt = ChatPromptTemplate.from_template(
        """You are a helpful assistant answering questions about a document.
        Use the provided context to answer accurately.
        If you cannot find the answer, say you don't know.

        Context:
        {context}

        Question:
        {input}"""
    )

    # Build the retrieval + QA chain
    retrieval_chain = (
        {"context": retriever | RunnableLambda(format_docs),
         "input": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

    # Generate answer
    response = retrieval_chain.invoke(question)
    os.unlink(temp_path)
    return {"answer": response}
