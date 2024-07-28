"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { TbArrowLeft } from "react-icons/tb";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useGlobalContext } from "@/context/Session";
import { ScalarLoanApplication } from "@/types/session";
import HistoryCard from "@/components/history/HistoryCard";

function LoansHistory({ params }: { params: { clientId: string } }) {
  const router = useRouter();
  const { dataSession } = useGlobalContext();

  const [loans, setLoans] = useState<ScalarLoanApplication[] | null>(null);

  useEffect(() => {
    const getAllLoans = async () => {
      const response = await axios.post(
        "/api/loans/allbyclient",
        {
          userId: params.clientId,
        },
        { headers: { Authorization: `Bearer ${dataSession?.token}` } }
      );

      console.log(response);

      if (response.data.success) {
        const data: ScalarLoanApplication[] = response.data.data;
        setLoans(data);
      }
    };

    getAllLoans();
  }, [dataSession?.token, params.clientId]);

  return (
    <>
      <main className={styles.mainLoan}>
        <div className={styles.barBack}>
          <div
            className={styles.centerBarBack}
            onClick={() => router.push(`/dashboard`)}
          >
            <div className={styles.boxIcon}>
              <TbArrowLeft size={20} className={styles.iconArrow} />
            </div>
            <p className={styles.labelBtn}>Volver</p>
          </div>
        </div>

        <div className={styles.containerLoans}>
          {loans &&
            loans?.map((loan) => <HistoryCard key={loan.id} loan={loan} />)}
        </div>
      </main>
    </>
  );
}

export default LoansHistory;
