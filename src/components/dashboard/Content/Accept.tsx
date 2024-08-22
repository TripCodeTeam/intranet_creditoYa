import React, { useEffect, useState } from "react";
import styles from "./styles/accept.module.css";
import HeaderContent from "./Components/HeaderContent";
import { ScalarClient, ScalarLoanApplication } from "@/types/session";
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
      try {
        const response = await axios.post("/api/loans/all");
        const loans = response.data.data;

        // Obtener la información de los clientes
        const loansWithClientInfo = await Promise.all(
          loans.map(async (loan: ScalarLoanApplication) => {
            const clientResponse = await axios.post(
              "/api/clients/id",
              {
                userId: loan.userId,
              },
              { headers: { Authorization: `Bearer ${dataSession?.token}` } }
            );
            if (clientResponse.data.success) {
              const dataUser = clientResponse.data.data;
              return { ...loan, clientInfo: dataUser };
            }
            return loan; // En caso de que la llamada falle, retorna el préstamo original
          })
        );

        setLiveLoans(loansWithClientInfo);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener las solicitudes de préstamos:", error);
        setLoading(false);
      }
    };

    getAllLoans();
  }, [dataSession?.token]);

  const handleChangeStatus = (status: string) => {
    setStatus(status);
  };

  const filteredLoans =
    status !== "Cantity"
      ? liveLoans?.filter((loan) => loan.status === status) || []
      : liveLoans?.filter((loan) => loan.newCantity && loan.newCantityOpt == null) || [];

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
                onClick={() => handleChangeStatus("Aplazado")}
              >
                Aplazados
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
                    user={loan.clientInfo as ScalarClient}
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
