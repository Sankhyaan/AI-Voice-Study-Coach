import { useRef, useState } from "react";

function MicButton({ onRecordingComplete }) {

    const [recording, setRecording] = useState(false);

    const mediaRecorder = useRef(null);

    const audioChunks = useRef([]);

    async function startRecording() {

        const stream = await navigator.mediaDevices.getUserMedia({

            audio: true

        });

        mediaRecorder.current = new MediaRecorder(stream);

        audioChunks.current = [];

        mediaRecorder.current.ondataavailable = (event) => {

            audioChunks.current.push(event.data);

        };

        mediaRecorder.current.onstop = () => {

            const blob = new Blob(

                audioChunks.current,

                {

                    type: "audio/webm"

                }

            );

            onRecordingComplete(blob);

        };

        mediaRecorder.current.start();

        setRecording(true);

    }

    function stopRecording() {

        mediaRecorder.current.stop();

        setRecording(false);

    }

    return (

        <button

            onClick={

                recording

                    ?

                    stopRecording

                    :

                    startRecording

            }

        >

            {

                recording

                    ?

                    "🛑 Stop"

                    :

                    "🎤 Speak"

            }

        </button>

    );

}

export default MicButton;