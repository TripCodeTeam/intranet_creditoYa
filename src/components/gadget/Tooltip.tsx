import React, { ReactNode } from "react";
import styles from "./tooltip.module.css";

interface tooltipProps {
  message: string;
  children: ReactNode;
}

function Tooltip({ message, children }: tooltipProps) {
  return (
    <div className={styles.tooltip}>
      {children}
      <span className={styles.tooltiptext}>{message}</span>
    </div>
  );
}

export default Tooltip;
