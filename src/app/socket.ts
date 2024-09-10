"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | undefined;

if (typeof window !== "undefined") {
  socket = io(process.env.NEXT_PUBLIC_WS_Route as string, {
    withCredentials: true,
    transports: ["websocket"], // Usar solo WebSocket
  });

  // Evento para manejar conexión exitosa
  socket.on("connect", () => {
    console.log("Conectado al servidor exitosamente");
  });

  // Evento para manejar errores de conexión
  socket.on("connect_error", (error) => {
    console.error("Error de conexión:", error.message);
    // Puedes agregar lógica adicional aquí, como mostrar un mensaje al usuario
  });

  // Evento para manejar la desconexión
  socket.on("disconnect", (reason) => {
    console.warn("Desconectado del servidor:", reason);
    if (reason === "io server disconnect") {
      // El servidor ha desconectado el socket manualmente
      console.log("Intentando reconectar...");
      socket?.connect(); // Reconectar manualmente
    } else if (reason === "transport close") {
      console.log(
        "Conexión cerrada por problemas de transporte. Intentando reconectar..."
      );
      socket?.connect(); // Reconectar manualmente
    }
    // Puedes manejar reconexiones automáticas u otras acciones aquí
  });

  // Evento para manejar reconexión exitosa
  socket.on("reconnect", (attemptNumber) => {
    console.log(`Reconectado exitosamente en el intento ${attemptNumber}`);
  });

  // Evento para manejar fallos en la reconexión
  socket.on("reconnect_error", (error) => {
    console.error("Error al intentar reconectar:", error.message);
  });

  // Evento para manejar cierre de transporte
  socket.on("close", () => {
    console.warn("Conexión cerrada por el servidor o problemas de red.");
  });
}

export default socket;
