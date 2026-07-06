import { useState } from "react";
import API from "../services/api";
import MicButton from "./MicButton";

function AskQuestion({ messages, setMessages }) {

    const [question, setQuestion] = useState("");

    const [loading, setLoading] = useState(false);

    async function askQuestion() {

        if (!question.trim()) return;

        const currentQuestion = question;

        const userMessage = {

            id: Date.now(),

            role: "user",

            text: currentQuestion

        };

        setMessages(prev => [

            ...prev,

            userMessage

        ]);

        setQuestion("");

        setLoading(true);

        try {

            const response = await API.post(

                "/ask",

                {

                    question: currentQuestion

                }

            );

            const aiMessage = {

                id: Date.now() + 1,

                role: "assistant",

                text: response.data.answer

            };

            setMessages(prev => [

                ...prev,

                aiMessage

            ]);

            if (response.data.audio) {

                const audio = new Audio(

                    response.data.audio

                );

                audio.play();

            }

        }

        catch {

            setMessages(prev => [

                ...prev,

                {

                    id: Date.now(),

                    role: "assistant",

                    text: "❌ Something went wrong."

                }

            ]);

        }

        setLoading(false);

    }

    async function uploadVoice(audioBlob) {

        const formData = new FormData();

        formData.append(

            "audio",

            audioBlob,

            "voice.webm"

        );

        try {

            const response = await API.post(

                "/transcribe",

                formData,

                {

                    headers: {

                        "Content-Type": "multipart/form-data"

                    }

                }

            );

            const userMessage = {

                id: Date.now(),

                role: "user",

                text: response.data.question

            };

            const aiMessage = {

                id: Date.now() + 1,

                role: "assistant",

                text: response.data.answer

            };

            setMessages(prev => [

                ...prev,

                userMessage,

                aiMessage

            ]);

            if (response.data.audio) {

                const audio = new Audio(

                    response.data.audio

                );

                audio.play();

            }

        }

        catch {

            alert("Voice upload failed.");

        }

    }

    return (

        <div

            style={{

                display: "flex",

                gap: "10px"

            }}

        >

            <input

                value={question}

                onChange={(e) =>

                    setQuestion(e.target.value)

                }

                onKeyDown={(e) => {

                    if (e.key === "Enter") {

                        askQuestion();

                    }

                }}

                placeholder="Ask anything..."

                style={{

                    flex: 1,

                    padding: "12px"

                }}

            />

            <button

                disabled={loading}

                onClick={askQuestion}

            >

                {

                    loading

                        ?

                        "Thinking..."

                        :

                        "Send"

                }

            </button>

            <MicButton

                onRecordingComplete={

                    uploadVoice

                }

            />

        </div>

    );

}

export default AskQuestion;