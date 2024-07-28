import React, { useEffect, useState } from "react";
import styles from "./styles/accept.module.css";
import HeaderContent from "./Components/HeaderContent";
import { ScalarLoanApplication } from "@/types/session";
import CardRequest from "./Components/CardReq";
import axios from "axios";
import { useGlobalContext } from "@/context/Session";
import Loading from "@/app/dashboard/loading";
import Image from "next/image";

import noDataImg from "@/assets/out-bro.svg";

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

  const filteredLoans =
    status != "Cantity"
      ? liveLoans?.filter((loan) => loan.status === status) || []
      : liveLoans?.filter((loan) => loan.newCantity && !loan.newCantityOpt) ||
        [];

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
              <p
                className={styles.btnCantity}
                onClick={() => handleChangeStatus("Cantity")}
              >
                Cambio de cantidad
              </p>
            </div>

            <div className={styles.listLiveRequests}>
              {filteredLoans.length === 0 ? (
                <div className={styles.noData}>
                  <div style={{ display: "grid", placeContent: "center" }}>
                    <Image
                      className={styles.imgNoData}
                      src={noDataImg}
                      alt={"No data"}
                    />
                  </div>
                  <p className={styles.titleNodata}>
                    No hay Solicitudes en este estado
                  </p>
                </div>
              ) : (
                filteredLoans.map((loan) => (
                  <CardRequest
                    loan={loan}
                    key={loan.id}
                    token={dataSession?.token as string}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default AcceptContent;
