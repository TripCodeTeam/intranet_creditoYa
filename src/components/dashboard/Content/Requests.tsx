"use client";

import React, { useState, useEffect } from "react";
import styles from "./styles/Request.module.css";
import { ScalarLoanApplication } from "@/types/session";
import axios from "axios";
import CardRequest from "./Components/CardReq";
import HeaderContent from "./Components/HeaderContent";
import socket from "@/lib/socket/socket";
import { toast } from "sonner";

function RequestsContent() {
  const [liveLoans, setLiveLoans] = useState<ScalarLoanApplication[] | null>(
    null
  );

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
