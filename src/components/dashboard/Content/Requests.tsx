"use client";

import React, { useState, useEffect, useMemo } from "react";
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
      setLiveLoans(response.data.data);
    };

    getAllLoans();
  }, []);

  useEffect(() => {
    socket.emit("connected", "Hello from live requests");

    socket.on("updateLoan", (data: ScalarLoanApplication[]) => {
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

  const pendingLoans = useMemo(() => {
    return liveLoans
      ? liveLoans.filter((loan) => loan.status === "Pendiente")
      : [];
  }, [liveLoans]);

  return (
    <>
      <div className={styles.containerLoads}>
        <HeaderContent label="Solicitudes de prestamos" />

        <div className={styles.listLiveRequests}>
          {pendingLoans.length > 0 ? (
            pendingLoans.map((loan) => (
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
