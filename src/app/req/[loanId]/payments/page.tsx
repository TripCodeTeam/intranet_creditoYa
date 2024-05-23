"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ScalarLoanApplication, ScalarPaymentLoan } from "@/types/session";
import { useGlobalContext } from "@/context/Session";
import { TbArrowLeft } from "react-icons/tb";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

interface Props {
  loanId: string;
}

function PaymentsLoan({ params }: { params: { loanId: string } }) {
  const { dataSession } = useGlobalContext();
  const [loanData, setLoanData] = useState<ScalarLoanApplication | null>(null);
  const [payments, setPayments] = useState<ScalarPaymentLoan[] | null>(null);
  const [paymentDetails, setPaymentDetails] = useState({
    monthsToPay: 0,
    totalCuotas: 0,
    cuotaAmount: 0,
    nextPaymentDate: "",
  });

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "/api/loans/id",
          { loanId: params.loanId },
          {
            headers: { Authorization: `Bearer ${dataSession?.token}` },
          }
        );
        if (response.data.success) {
          setLoanData(response.data.data);
          calculatePaymentDetails(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [dataSession, params]);

  useEffect(() => {
    const fetchPayments = async () => {
      const response = await axios.post(
        "/api/loans/payment/all",
        {
          loanId: params.loanId,
        },
        { headers: { Authorization: `Bearer ${dataSession?.token}` } }
      );

      console.log(response);

      if (response.data.success) setPayments(response.data.data);
    };

    fetchPayments();
  }, [params, dataSession]);

  const calculatePaymentDetails = (loan: ScalarLoanApplication) => {
    // Calculate payment details based on loan data
    // Assuming payment frequency is stored in loanData.payment (e.g., 'Mensual', 'Quincenal', 'Semanal')
    let monthsToPay = 0;
    switch (loan.payment) {
      case "Mensual":
        monthsToPay = parseInt(loan.deadline) / 30;
        break;
      case "Quincenal":
        monthsToPay = parseInt(loan.deadline) / 15;
        break;
      case "Semanal":
        monthsToPay = parseInt(loan.deadline) / 7;
        break;
      default:
        break;
    }

    const totalCuotas = parseInt(loan.deadline);
    const cuotaAmount = parseFloat(loan.quota_value);

    // Calculate next payment date
    const createdDate = new Date(loan.createdAt);
    const nextPaymentDate = new Date(
      createdDate.getTime() + 30 * 24 * 60 * 60 * 1000
    ); // Assuming monthly payment

    setPaymentDetails({
      monthsToPay,
      totalCuotas,
      cuotaAmount,
      nextPaymentDate: nextPaymentDate.toDateString(), // Convert next payment date to string
    });
  };

  return (
    <main className={styles.mainPay}>
      <div className={styles.barBack}>
        <div
          className={styles.centerBarBack}
          onClick={() => router.push("/dashboard")}
        >
          <div className={styles.boxIcon}>
            <TbArrowLeft size={20} className={styles.iconArrow} />
          </div>
          <p className={styles.labelBtn}>Volver</p>
        </div>
      </div>

      {loanData && (
        <div className={styles.headerInfo}>
          <h1>Detalles de Pago</h1>
          <h4 className={styles.detailText}>
            Número total de cuotas:{" "}
            <span className={styles.valueP}>{paymentDetails.totalCuotas}</span>
          </h4>
          <h4 className={styles.detailText}>
            Monto de cada cuota:{" "}
            <span className={styles.valueP}>{paymentDetails.cuotaAmount}</span>
          </h4>
          <h4 className={styles.detailText}>
            Próxima fecha de pago:{" "}
            <span className={styles.valueP}>
              {paymentDetails.nextPaymentDate}
            </span>
          </h4>
        </div>
      )}

      <div className={styles.containerPay}>
        {payments?.length === 0 && <p>No hay registros de pago</p>}
        {payments &&
          payments?.length > 0 &&
          payments?.map((details) => <div key={details.id}></div>)}
      </div>
    </main>
  );
}

export default PaymentsLoan;
