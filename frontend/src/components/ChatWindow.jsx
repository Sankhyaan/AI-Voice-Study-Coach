import { useEffect, useRef } from "react";

import ChatMessage from "./ChatMessage";

function ChatWindow({ messages }) {

    const bottomRef = useRef();

    useEffect(()=>{

        bottomRef.current?.scrollIntoView({

            behavior:"smooth"

        });

    },[messages]);

    return(

        <div

            style={{

                flex:1,

                overflowY:"auto",

                padding:"20px"

            }}

        >

            {

                messages.map(message=>(

                    <ChatMessage

                        key={message.id}

                        role={message.role}

                        text={message.text}

                    />

                ))

            }

            <div ref={bottomRef}></div>

        </div>

    );

}

export default ChatWindow;