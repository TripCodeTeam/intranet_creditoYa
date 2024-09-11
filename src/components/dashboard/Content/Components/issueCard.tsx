import { ScalarIssues } from "@/types/session";
import React, { useState } from "react";
import { TbCircleCheck, TbLoader, TbTool } from "react-icons/tb";
import styles from "../styles/issueCard.module.css";

interface issueCardProp {
  issue: ScalarIssues;
  openIssue: () => void;
}

function IssueCard({ issue, openIssue }: issueCardProp) {
  return (
    <>
      <div onClick={openIssue} className={styles.card}>
        <div className={styles.boxTitle}>
          <h5>Titulo</h5>
          <h3>{issue.title}</h3>
        </div>

        <div className={styles.boxStatus}>
          <div className={styles.boxIconStatus}>
            {issue.status == "activo" && (
              <TbLoader className={styles.iconLoader} />
            )}
            {issue.status == "pendiente" && <TbTool />}
            {issue.status == "corregido" && <TbCircleCheck />}
          </div>
          <h5 className={styles.textStatus}>
            {issue.status == "activo" && "Informado"}
            {issue.status == "pendiente" && "Corrigiendo"}
            {issue.status == "corregido" && "Corregido"}
          </h5>
        </div>
      </div>
    </>
  );
}

export default IssueCard;
