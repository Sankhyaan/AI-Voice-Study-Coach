import os
import uuid

from gtts import gTTS


def text_to_speech(text):

    os.makedirs(
        "audio",
        exist_ok=True
    )

    filename = f"{uuid.uuid4()}.mp3"

    filepath = os.path.join(
        "audio",
        filename
    )

    tts = gTTS(
        text=text,
        lang="en"
    )

    tts.save(filepath)

    return filename