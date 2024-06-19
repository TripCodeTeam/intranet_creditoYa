"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import styles from "./styles/Request.module.css";
import { ScalarLoanApplication } from "@/types/session";
import axios from "axios";
import CardRequest from "./Components/CardReq";
import HeaderContent from "./Components/HeaderContent";
import { toast } from "sonner";
import { useGlobalContext } from "@/context/Session";
import { TbMobiledata, TbRss } from "react-icons/tb";
import { useWebSocket } from "next-ws/client";
import { EventClient } from "@/types/ws";
import LoanApplicationService from "@/classes/LoanServices";
import { useMediaQuery } from "react-responsive";

function RequestsContent() {
  const ws = useWebSocket();
  const isMobile = useMediaQuery({ query: "(max-width: 700px)" });
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

  const newLoan = useCallback(async (event: MessageEvent<Blob>) => {
    console.log(event);

    const resLoan = JSON.parse(String(event.data));
    console.log(resLoan)

    if (resLoan.type == "onNewLoan") {
      const response = await axios.post("/api/loans/all");
      setLiveLoans(response.data.data);
    }
  }, []);

  useEffect(() => {
    ws?.addEventListener("message", newLoan);
    return () => ws?.removeEventListener("message", newLoan);
  }, [newLoan, ws]);

  const pendingLoans = useMemo(() => {
    return liveLoans
      ? liveLoans.filter((loan) => loan.status === "Pendiente")
      : [];
  }, [liveLoans]);

  return (
    <>
      <div className={styles.containerLoads}>
        {!isMobile && <HeaderContent label="Solicitudes de prestamos" />}
        

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
