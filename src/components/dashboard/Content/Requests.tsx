import React, { useState, useEffect, useMemo, useCallback } from "react";
import styles from "./styles/Request.module.css";
import { ScalarClient, ScalarLoanApplication } from "@/types/session";
import axios from "axios";
import CardRequest from "./Components/CardReq";
import HeaderContent from "./Components/HeaderContent";
import { useGlobalContext } from "@/context/Session";
import { TbRss } from "react-icons/tb";
import { useMediaQuery } from "react-responsive";
import Loading from "@/app/dashboard/loading";

function RequestsContent() {
  const isMobile = useMediaQuery({ query: "(max-width: 700px)" });
  const [liveLoans, setLiveLoans] = useState<ScalarLoanApplication[] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const { dataSession } = useGlobalContext();

  useEffect(() => {
    const getAllLoans = async () => {
      try {
        const response = await axios.post("/api/loans/all");
        if (response.data.success == true) {
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
              if (clientResponse.data.success == true) {
                const dataUser = clientResponse.data.data;
                return { ...loan, clientInfo: dataUser };
              }
              return loan;
            })
          );

          setLiveLoans(loansWithClientInfo);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error al obtener las solicitudes de préstamos:", error);
      }
    };

    getAllLoans();
  }, [dataSession?.token]);


  const pendingLoans = useMemo(() => {
    return liveLoans
      ? liveLoans.filter((loan) => loan.status === "Pendiente" && loan.id)
      : [];
  }, [liveLoans]);

  return (
    <div className={styles.containerLoads}>
      {!isMobile && <HeaderContent label="Solicitudes de prestamos" />}

      {loading ? (
        <Loading />
      ) : (
        <div className={styles.listLiveRequests}>
          {pendingLoans.length > 0 ? (
            pendingLoans.map((loan) => (
              <CardRequest
                user={loan.clientInfo as ScalarClient}
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
      )}
    </div>
  );
}

export default RequestsContent;
