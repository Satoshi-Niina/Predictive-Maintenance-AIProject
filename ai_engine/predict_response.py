import os
import pinecone
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Pinecone
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.schema import Document
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()

openai_api_key = os.getenv("OPENAI_API_KEY")
pinecone_api_key = os.getenv("PINECONE_API_KEY")
pinecone_env = os.getenv("PINECONE_ENV") or "us-west1-gcp"
index_name = os.getenv("PINECONE_INDEX") or "emergency-knowledge"

pinecone.init(api_key=pinecone_api_key, environment=pinecone_env)
llm = ChatOpenAI(openai_api_key=openai_api_key, temperature=0)

def generate_response(query: str) -> str:
    embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
    vectorstore = Pinecone.from_existing_index(index_name=index_name, embedding=embeddings)
    qa = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vectorstore.as_retriever(search_kwargs={"k": 3}),
        return_source_documents=False
    )
    result = qa.run(query)
    return result
