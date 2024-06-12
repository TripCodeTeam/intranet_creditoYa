"use client";

import React, { useState, useEffect } from "react";
import styles from "./styles/Request.module.css";
import { ScalarLoanApplication } from "@/types/session";
import axios from "axios";
import CardRequest from "./Components/CardReq";
import HeaderContent from "./Components/HeaderContent";
import socket from "@/lib/socket";
import { toast } from "sonner";
import { useGlobalContext } from "@/context/Session";
import { TbMobiledata, TbRss } from "react-icons/tb";

function RequestsContent() {
  const [liveLoans, setLiveLoans] = useState<ScalarLoanApplication[] | null>(
    null
  );

  const { dataSession } = useGlobalContext();

  useEffect(() => {
    const getAllLoans = async () => {
      const response = await axios.post("/api/loans/all");
      console.log(response);
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

    console.log("uri ws: ", process.env.NEXT_PUBLIC_ENDPOINT_WS);

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
          {liveLoans &&
          liveLoans.filter((loan) => loan.status === "Pendiente").length > 0 ? (
            liveLoans
              .filter((loan) => loan.status === "Pendiente")
              .map((loan) => (
                <CardRequest
                  loan={loan}
                  token={dataSession?.token as string}
                  key={loan.id}
                />
              ))
          ) : (
            <div className={styles.containerVoidReqss}>
              <div className={styles.centerContainerVoidReqss}>
                <div className={styles.boxRssIcon}>
                  <TbRss className={styles.iconRss} size={20} />
                </div>
                <p>Solicitudes en tiempo real</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default RequestsContent;
