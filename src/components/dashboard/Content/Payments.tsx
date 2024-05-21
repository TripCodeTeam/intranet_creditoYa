import React from "react";
import styles from "./styles/payment.module.css"
import HeaderContent from "./Components/HeaderContent";

function PaymentsContent() {
  return (
    <>
      <div className={styles.mainPayment}>
        <HeaderContent label={"Gestion de pagos"} />
      </div>
    </>
  );
}

export default PaymentsContent;
