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

        if (response.data.success) {
          const loans = response.data.data;

          const loansWithClientInfo = await Promise.all(
            loans.map(async (loan: ScalarLoanApplication) => {
              try {
                const clientResponse = await axios.post(
                  "/api/clients/id",
                  { userId: loan.userId },
                  { headers: { Authorization: `Bearer ${dataSession?.token}` } }
                );

                if (clientResponse.data.success) {
                  return { ...loan, clientInfo: clientResponse.data.data };
                } else {
                  console.error(
                    `Error fetching client info for userId ${loan.userId}:`,
                    clientResponse.data.error
                  );
                }
              } catch (clientError) {
                console.error(
                  `Error during client info fetch for userId ${loan.userId}:`,
                  clientError
                );
              }
              return loan;
            })
          );

          setLiveLoans(loansWithClientInfo);
        } else {
          console.error("Error fetching loans:", response.data.error);
        }
      } catch (error) {
        console.error("Error fetching loans:", error);
      } finally {
        setLoading(false);
      }
    };

    if (dataSession?.token) {
      getAllLoans();
    }
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
