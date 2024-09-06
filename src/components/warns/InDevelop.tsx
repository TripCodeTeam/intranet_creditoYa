import React from "react";
import { TbCircleCheck, TbLoader } from "react-icons/tb";
import styles from "./inDev.module.css";

interface InDevProps {
  reason: string;
  status: "In Progress" | "Success";
}

function InDevelop({ reason, status }: InDevProps) {
  return (
    <div className={styles.containerWarn}>
      <p className={styles.reasonText}>{reason}</p>

      <div className={styles.boxStatus}>
        <div className={styles.boxIconStatus}>
          {status === "In Progress" && (
            <TbLoader className={styles.iconSpiner} />
          )}
          {status === "Success" && (
            <TbCircleCheck className={styles.iconCheck} />
          )}
        </div>
        <p>
          {status == "In Progress" && "En Mantenimiento"}
          {status == "Success" && "En Funcionamiento"}
        </p>
      </div>
    </div>
  );
}

export default InDevelop;
