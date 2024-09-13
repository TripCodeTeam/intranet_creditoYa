// RequestsContent.tsx
import React, { useState, useEffect } from "react";
import styles from "./styles/Request.module.css";
import { ScalarLoanApplication } from "@/types/session";
import axios from "axios";
import LoansList from "./Components/listCardsLoans";
import HeaderContent from "./Components/HeaderContent";
import { useGlobalContext } from "@/context/Session";
import { useMediaQuery } from "react-responsive";
import Loading from "@/app/dashboard/loading";

function RequestsContent() {
  const isMobile = useMediaQuery({ query: "(max-width: 700px)" });
  const [pendingLoans, setPendingLoans] = useState<
    ScalarLoanApplication[] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const { dataSession } = useGlobalContext();

  useEffect(() => {
    const getPendingLoans = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          "/api/loans/pendings",
          { page },
          { headers: { Authorization: `Bearer ${dataSession?.token}` } }
        );

        if (response.data.success) {
          const data = response.data.data;
          setPendingLoans(data);
          setTotal(response.data.total);
        } else {
          console.error("Error fetching pending loans:", response.data.error);
        }
      } catch (error) {
        console.error("Error fetching pending loans:", error);
      } finally {
        setLoading(false);
      }
    };

    getPendingLoans();
  }, [page, dataSession?.token]);

  return (
    <div className={styles.containerLoads}>
      {!isMobile && (
        <HeaderContent label="Solicitudes de préstamos Pendientes" />
      )}

      <div>
        {loading ? (
          <Loading />
        ) : (
          <LoansList
            pendingLoans={pendingLoans}
            token={dataSession?.token as string}
            page={page}
            setPage={setPage}
            total={total}
          />
        )}
      </div>
    </div>
  );
}

export default RequestsContent;
