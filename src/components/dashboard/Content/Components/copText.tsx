import React from "react";
import styles from "../styles/CardReq.module.css";

function CopText({ label, cantity }: { label: string; cantity: string }) {
  const formCop = (amount: string) => {
    const number = parseFloat(amount);
    if (isNaN(number)) return amount;
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 2,
    }).format(number);
  };
  return (
    <>
      <div className={styles.loadCantity}>
        <h4 className={styles.titleCantity}>{label}</h4>
        <p className={styles.textCantity}>{formCop(cantity)} COP</p>
      </div>
    </>
  );
}

export default CopText;
