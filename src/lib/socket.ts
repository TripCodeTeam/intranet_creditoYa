import { io } from "socket.io-client";

const socket = io(
  (process.env.ENDPOINT_WEBSOCKET as string) || "http://localhost:4000/",
  {}
);

export default socket;
