"use client";

import React, { useState, useEffect } from "react";
import styles from "./styles/Request.module.css";
import { ScalarLoanApplication } from "@/types/session";
import axios from "axios";
import CardRequest from "./Components/CardReq";
import { useWebSocket } from "../../../../socket/SocketHook";
import HeaderContent from "./Components/HeaderContent";

function RequestsContent() {
  const [liveLoans, setLiveLoans] = useState<ScalarLoanApplication[] | null>(
    null
  );
  const [textTest, setTextTest] = useState<string | null>(null);

  const handleOnMessage = (event: any) => {
    const message = JSON.parse(event.data);
    console.log("Mensaje del servidor: ", event.data);

    switch (message.type) {
      case "newUserCreate":
        console.log(message);
        setTextTest(message.newUser);
    }
  };

  const { send } = useWebSocket({
    url: process.env.NEXT_PUBLIC_ENDPOINT_WEBSOCKET as string,
    onMessage: handleOnMessage,
  });

  useEffect(() => {
    const getAllLoans = async () => {
      const response = await axios.post("/api/loans/all");
      console.log(response)
      setLiveLoans(response.data.data);
    };

    getAllLoans();
  }, []);

  useEffect(() => {
    socket.emit("connected", "Hello from live requests");

    socket.on("updateLoan", (data: ScalarLoanApplication[]) => {
      console.log("request from server: ", data);
      setLiveLoans(data);
    });

    socket.on(
      "successAcept",
      (data: { message: string; loan: ScalarLoanApplication[] }) => {
        toast.success(data.message);
      }
    );

    return () => {
      socket.off("updateLoan");
      socket.off("successAcept");
    };
  }, []);

  return (
    <>
      <div className={styles.containerLoads}>
        <HeaderContent label="Solicitudes de prestamos" />

        <div className={styles.listLiveRequests}>
          {liveLoans
            ?.filter((loan) => loan.status === "Pendiente")
            .map((loan) => (
              <CardRequest loan={loan} key={loan.id} />
            ))}
        </div>
      </div>
    </>
  );
}

export default RequestsContent;
