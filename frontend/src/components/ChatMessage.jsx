import ReactMarkdown from "react-markdown"; 

function ChatMessage({ role, text }) {

    const isUser = role === "user";

    return (

        <div

            style={{

                display: "flex",

                justifyContent: isUser
                    ? "flex-end"
                    : "flex-start",

                marginBottom: "15px"

            }}

        >

            <div

                style={{

                    background: isUser
                        ? "#0b93f6"
                        : "#ececec",

                    color: isUser
                        ? "white"
                        : "black",

                    padding: "12px",

                    borderRadius: "12px",

                    maxWidth: "70%"

                }}

            >

                <ReactMarkdown>

                    {text}

                </ReactMarkdown>

            </div>

        </div>

    );

}

export default ChatMessage;
