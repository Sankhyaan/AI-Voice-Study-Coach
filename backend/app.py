from typing import Annotated

import os
import uuid
 
from services.whisper_service import speech_to_text

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware 
from fastapi.staticfiles import StaticFiles

from pydantic import BaseModel

import shutil

from services.pdf_loader import load_pdf
from services.vector_store import store_chunks, retrieve_context
from services.rag_service import generate_answer
from services.tts_service import text_to_speech

app = FastAPI()

app.mount(
    "/audio",
    StaticFiles(directory="audio"),
    name="audio"
)

chat_history = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.post("/upload")
async def upload_pdf(
    files: Annotated[list[UploadFile], File()]
):

    uploaded_files = []

    for file in files:

        file_path = f"uploads/{file.filename}"

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(
                file.file,
                buffer
            )

        chunks = load_pdf(file_path)

        store_chunks(chunks)

        uploaded_files.append(
            file.filename
        )

    return {
        "message": "PDF(s) uploaded successfully",
        "files": uploaded_files
    }


class QuestionRequest(BaseModel):
    question: str

@app.post("/speech")

async def speech(file: UploadFile = File(...)):

    audio_path = f"audio/{file.filename}"

    with open(audio_path, "wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    text = speech_to_text(audio_path)

    return {

        "text": text

    }

@app.post("/transcribe")
async def transcribe_audio(

    audio: UploadFile = File(...)

):

    os.makedirs(

        "recordings",

        exist_ok=True

    )

    filename = f"{uuid.uuid4()}.webm"

    filepath = os.path.join(

        "recordings",

        filename

    )

    with open(

        filepath,

        "wb"

    ) as buffer:

        shutil.copyfileobj(

            audio.file,

            buffer

        )

    question = speech_to_text(

        filepath

    )

    context = retrieve_context(

        question

    )

    history_text = ""

    for item in chat_history:

        history_text += f"""

User:

{item['question']}

Assistant:

{item['answer']}

"""

    answer = generate_answer(

        question,

        context,

        history_text

    )

    chat_history.append(

        {

            "question": question,

            "answer": answer

        }

    )

    audio_file = text_to_speech(

        answer

    )

    return {

        "question": question,

        "answer": answer,

        "sources": context["sources"],

        "audio": f"http://localhost:8000/audio/{audio_file}"

    }


@app.post("/ask")
def ask_question(
    request: QuestionRequest
):

    context = retrieve_context(
        request.question
    )

    # Debugging
    print("=" * 50)
    print("Retrieved Documents")
    print(context["documents"])
    print("=" * 50)

    history_text = ""

    for item in chat_history:

        history_text += f"""
User:
{item['question']}

Assistant:
{item['answer']}
"""

    answer = generate_answer(
        request.question,
        context,
        history_text
    )

    chat_history.append(
        {
            "question": request.question,
            "answer": answer
        }
    )

    audio_file = text_to_speech(
        answer
    )

    return {

        "answer": answer,

        "sources": context["sources"],

        "audio": f"http://localhost:8000/audio/{audio_file}"

    }
