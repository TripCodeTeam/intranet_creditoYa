"use client"

import SendMessagePriv from "@/components/chat/SendMessagePriv";
import { useGlobalContext } from "@/context/Session";
import React, { useEffect } from "react";

function ChatComponent() {
  const { dataSession } = useGlobalContext();

  return <SendMessagePriv userId={dataSession?.id as string} />;
}

export default ChatComponent;
