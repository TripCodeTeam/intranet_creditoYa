"use client";

import { WebSocketProvider } from "next-ws/client";
import React from "react";

const wsUrl =
  process.env.NODE_ENV === "production"
    ? "wss://intranet-creditoya.vercel.app//api/ws"
    : "/api/ws";

export function WsProvider({ children }: { children: React.ReactNode }) {
  return <WebSocketProvider url={wsUrl}>{children}</WebSocketProvider>;
}
