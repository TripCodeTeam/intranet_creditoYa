import socket from "@/lib/socket/socket";
import React, { FormEvent, useEffect, useState } from "react";

function SendMessagePriv({ userId }: { userId: string }) {
  const [inputText, setInputText] = useState<string | null>(null);
  const [messageSend, setMessageSend] = useState<string | null>(null);

  useEffect(() => {
    socket.on("textUpdate", (data) => {
      const { text } = data
      setMessageSend(text)
    })
  }, [])

  const handleSendMessage = () => {
    const data = {
      text: inputText,
    };

    socket.emit("send_text_test", data);
  };

  return (
    <>
      <p>Private Message</p>
      <input type="text" onChange={(e) => setInputText(e.target.value)} />
      <button onClick={handleSendMessage}>Enviar</button>

      <p>mensaje Enviado</p>
      {messageSend == null ? "Sin mensajes enviados" : messageSend}
    </>
  );
}

export default SendMessagePriv;
