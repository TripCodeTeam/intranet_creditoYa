import React, { useState, useEffect } from "react";
import styles from "./styles/Request.module.css";
import { TbClock24 } from "react-icons/tb";
import socket from "@/Socket";
import { ScalarLoanApplication } from "@/types/session";
import axios from "axios";
import CardRequest from "./CardReq";

function RequestsContent() {
  const [date, setDate] = useState<Date>(new Date());
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [liveLoans, setLiveLoans] = useState<ScalarLoanApplication[] | null>(
    null
  );

  useEffect(() => {
    const getAllLoans = async () => {
      const response = await axios.post("/api/loans/all");

      setLiveLoans(response.data.data);
    };

    getAllLoans();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setDate(now);

      const day = now.getDay();
      const hour = now.getHours();

      // De lunes a viernes de 6am a 6pm
      if (day >= 1 && day <= 5 && hour >= 6 && hour < 18) {
        setIsOpen(true);
      }
      // Los sábados de 6am a 12pm
      else if (day === 6 && hour >= 6 && hour < 12) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formattedDate = `${date.toLocaleDateString("es-ES", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })}, ${date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })}`;

  return (
    <>
      <div className={styles.containerLoads}>
        <div className={styles.headerReq}>
          <h1>Solicitudes de prestamos</h1>
          <p>{isOpen ? "Abierto" : "Cerrado"}</p>
          <div className={styles.textDate}>
            <div className={styles.boxIconTime}>
              <TbClock24 className={styles.iconClock} size={30} />
            </div>
            <div className={styles.boxtextClock}>
              <span className={styles.titleDate}>Fecha y hora actual: </span>
              {formattedDate}
            </div>
          </div>
        </div>

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
