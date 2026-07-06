import os

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0,
    google_api_key=os.getenv("GEMINI_API_KEY")
)


def generate_answer(question, context, history=""):

    context_text = "\n\n".join(context["documents"])

    prompt = f"""
You are an AI Study Coach.

You MUST answer ONLY from the study material below.

Previous Conversation:
{history}

==================================================

Study Material:

{context_text}

==================================================

Question:
{question}

Instructions:

- Read EVERY retrieved chunk before answering.
- Combine information from ALL relevant chunks.
- Do NOT stop after the first matching chunk.
- If the answer continues in another chunk, continue reading and include it.
- Use Markdown.
- Use headings.
- Use bullet points where appropriate.
- If the answer is not present, reply exactly:

I couldn't find the answer in the uploaded study material.
"""

    response = llm.invoke(prompt)

    return response.content