"use client";

import styles from "./page.module.css";
import { FormEvent, useEffect, useState } from "react";
import socket from "@/Socket";

export default function Home() {
  const [preText, setPreText] = useState<string>();
  const [text, setText] = useState<string>();

  const handleSendText = (e: FormEvent) => {
    e.preventDefault();

    console.log("Enviando test")

    const data = {
      text: preText,
    };

    socket.emit("send_text_test", data);
  };

  useEffect(() => {
    socket.emit("connected", "Hello from client");

    socket.on("textUpdate", (data) => {
      const { text } = data;
      setText(text);
    });

  }, []);

  return (
    <main>
      <h1>Intranet</h1>

      <p>Ingresa un texto</p>
      <form onSubmit={handleSendText}>
        <input type="text" onChange={(e) => setPreText(e.target.value)} />
        <button>Enviar</button>
      </form>

      <h4>Texto Atravez del websocket</h4>
      <p>{text ? text : "Vacio"}</p>

      <button>Crea una nueva solicitud</button> 
    </main>
  );
}
