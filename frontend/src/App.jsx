import { useState } from "react";

import UploadPDF from "./components/UploadPDF";
import AskQuestion from "./components/AskQuestion";
import ChatWindow from "./components/ChatWindow";
import Sidebar from "./components/Sidebar";

function App() {

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: "👋 Welcome! Upload one or more PDFs and ask me anything."
    }
  ]);

  return (

    <div
      style={{
        display: "flex",
        height: "100vh"
      }}
    >

      <Sidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "20px"
        }}
      >

        <UploadPDF />

        <hr />

        <ChatWindow
          messages={messages}
        />

        <AskQuestion
          messages={messages}
          setMessages={setMessages}
        />

      </div>

    </div>

  );

}

export default App;