import React, { useEffect, useState } from "react";
import styles from "./styles/accept.module.css";
import HeaderContent from "./Components/HeaderContent";
import { ScalarLoanApplication } from "@/types/session";
import CardRequest from "./Components/CardReq";
import axios from "axios";

function AcceptContent() {
  const [liveLoans, setLiveLoans] = useState<ScalarLoanApplication[] | null>(
    null
  );

  useEffect(() => {
    const getAllLoans = async () => {
      const response = await axios.post("/api/loans/all");
      console.log(response);
      setLiveLoans(response.data.data);
    };

    getAllLoans();
  }, []);
  return (
    <>
      <div className={styles.mainActives}>
        <HeaderContent label={"Prestaciones activas"} />

        <div className={styles.barTypeLoan}>
          <p>Aprobados</p>
          <p>Rechazados</p>
        </div>

        <div className={styles.listLiveRequests}>
          {liveLoans
            ?.filter((loan) => loan.status === "Aprobado")
            .map((loan) => (
              <CardRequest loan={loan} key={loan.id} />
            ))}
        </div>
      </div>
    </>
  );
}

export default AcceptContent;
