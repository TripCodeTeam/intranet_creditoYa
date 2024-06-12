import React, { useEffect, useState } from "react";
import styles from "../styles/statsLoan.module.css";
import { TbArrowLeft, TbArrowRight } from "react-icons/tb";
import PersonalCondition from "../../Analitycs/PersonalCondition";
import { ScalarLoanApplication } from "@/types/session";
import axios from "axios";
import IncomeLoanScatterPlot from "../../Analitycs/Incomes";

function StatsLoan({ loanId, token }: { loanId: string; token: string }) {
  const [count, setCount] = useState<number>(0);
  const [infoLoan, setInfoLoan] = useState<ScalarLoanApplication | null>(null);

  useEffect(() => {
    const getLoan = async () => {
      const response = await axios.post(
        "/api/loans/id",
        {
          loanId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data: ScalarLoanApplication = response.data.data;

      if (response.data.success == true) {
        setInfoLoan(data);
      }
    };

    getLoan();
  }, [loanId, token]);

  const handleSide = (side: string) => {
    side == "right" && setCount(count + 1);
    side == "left" && setCount(count - 1);
  };

  const options: string[] = ["active_pasive", "amount_req"];

  return (
    <div className={styles.boxStats}>
      <div className={styles.direcArrows}>
        <button
          className={styles.btnArrowLeft}
          onClick={() => handleSide("left")}
          disabled={count == 0 && true}
        >
          <TbArrowLeft size={15} />
        </button>
        {options[count] == "active_pasive" && "Activos y pasivos"}
        {options[count] == "amount_req" &&
          "Ingresos Mensuales y Monto Solicitado"}
        <button
          className={styles.btnArrowRight}
          onClick={() => handleSide("right")}
          disabled={count == options.length - 1 && true}
        >
          <TbArrowRight size={15} />
        </button>
      </div>
      {options[count] == "active_pasive" && (
        <PersonalCondition data={infoLoan as ScalarLoanApplication} />
      )}

      {options[count] == "amount_req" && (
        <IncomeLoanScatterPlot data={infoLoan as ScalarLoanApplication} />
      )}
    </div>
  );
}

export default StatsLoan;
