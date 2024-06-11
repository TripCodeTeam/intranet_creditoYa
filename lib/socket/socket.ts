import { io } from "socket.io-client";

const socket = io("https://io-server-creditoya.fly.dev", {});

export default socket;
