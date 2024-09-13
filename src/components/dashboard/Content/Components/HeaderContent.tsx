import React from "react";
import styles from "../styles/Request.module.css";

function HeaderContent({ label }: { label: string }) {
  return (
    <div className={styles.headerReq}>
      <h1>{label}</h1>
    </div>
  );
}

export default HeaderContent;
