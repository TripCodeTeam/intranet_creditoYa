"use client";

import { useWebSocket } from "next-ws/client";
import React, { useState } from "react";

function ChatTest() {
  const ws = useWebSocket();

  const [author, setAuthor] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const handleSendMessage = () => {
    if (!author) throw new Error("author is required!");
    if (!content) throw new Error("message is required!");
    if (!ws) throw new Error("ws not exist");

    const data = {
      author,
      content,
      owner: "eggq45g5h54h´q3m4p4it5jfq",
      emailOwner: "davidvasquezmahecha@gmail.com"
    };

    ws.send(JSON.stringify({ type: "new_message", data }));
  };

  if (ws) {
    return (
      <div>
        <input
          type="text"
          placeholder="author"
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          type="text"
          placeholder="Content"
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={handleSendMessage}>Enviar</button>
      </div>
    );
  } else if (!ws) {
    <p>Sin WebSocket</p>;
  }
}

export default ChatTest;
