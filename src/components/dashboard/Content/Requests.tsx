"use client";

import React, { useState, useEffect } from "react";
import styles from "./styles/Request.module.css";
import { TbClock24 } from "react-icons/tb";
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

      setLiveLoans(response.data.data);
    };

    getAllLoans();
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

        {textTest && (
          <>
            <h1>Text from server</h1>
            <p>{textTest}</p>
          </>
        )}
      </div>
    </>
  );
}

export default RequestsContent;
