"use client";


import { useGlobalContext } from "@/context/Session";
import { useEffect, useRef } from "react";

export function useWebSocket({
  url,
  onMessage,
}: {
  url: string;
  onMessage: (event: MessageEvent) => void;
}) {
  const socketRef = useRef<WebSocket | null>(null);

  const { dataSession } = useGlobalContext();

  useEffect(() => {
    const connect = () => {
      socketRef.current = new WebSocket(url);

      socketRef.current.addEventListener("open", (event) => {
        console.log("Conexion abierta", event);

        const data = {
          type: "userConnected",
          data: dataSession?.id,
        };

        console.log(data)

        socketRef.current?.send(JSON.stringify(data));
      });

      socketRef.current.addEventListener("message", onMessage);

      socketRef.current.addEventListener("error", (event) => {
        console.log("Error: ", event);
        // setTimeout(connect, 5000);
      });
    };

    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [url, onMessage]);

  const send = (type: string, data: any) => {
    if (socketRef.current) {
      const message = { type, data };
      socketRef.current.send(JSON.stringify(message));
    }
  };

  return { send };
}
