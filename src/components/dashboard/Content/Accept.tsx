import React, { useEffect, useState } from "react";
import styles from "./styles/accept.module.css";
import HeaderContent from "./Components/HeaderContent";
import { ScalarLoanApplication } from "@/types/session";
import CardRequest from "./Components/CardReq";
import axios from "axios";
import { useGlobalContext } from "@/context/Session";
import Loading from "@/app/dashboard/loading";

function AcceptContent() {
  const [liveLoans, setLiveLoans] = useState<ScalarLoanApplication[] | null>(
    null
  );
  const [status, setStatus] = useState<string>("Aprobado");
  const [loading, setLoading] = useState<boolean>(true);
  const { dataSession } = useGlobalContext();

  useEffect(() => {
    const getAllLoans = async () => {
      const response = await axios.post("/api/loans/all");
      // console.log(response);
      setLiveLoans(response.data.data);
      setLoading(false);
    };

    getAllLoans();
  }, []);

  const handleChangeStatus = (status: string) => {
    setStatus(status);
  };

  return (
    <>
      <div className={styles.mainActives}>
        <HeaderContent label={"Prestaciones activas"} />
        {loading && <Loading />}
        {!loading && (
          <>
            <div className={styles.barTypeLoan}>
              <p
                className={styles.btnAprove}
                onClick={() => handleChangeStatus("Aprobado")}
              >
                Aprobados
              </p>
              <p
                className={styles.btnReject}
                onClick={() => handleChangeStatus("Rechazado")}
              >
                Rechazados
              </p>
            </div>

            <div className={styles.listLiveRequests}>
              {liveLoans
                ?.filter((loan) => loan.status === status)
                .map((loan) => (
                  <CardRequest
                    loan={loan}
                    key={loan.id}
                    token={dataSession?.token as string}
                  />
                ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default AcceptContent;
