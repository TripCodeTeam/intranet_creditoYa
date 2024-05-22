import { io } from "socket.io-client";

const socket = io(process.env.ENDPOINT_WEBSOCKET as string, {});

export default socket;
