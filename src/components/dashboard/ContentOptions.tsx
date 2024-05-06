"use client";

import { useDashboardContext } from "@/context/DashboardContext";
import React from "react";
import styles from "./Styles/Content.module.css";
import RequestsContent from "./Content/Requests";
import ListClients from "./Content/ListClients";

function ContentOptions() {
  const { option } = useDashboardContext();
  return (
    <>
      <div className={styles.containerContent}>
        {option == "Request" && <RequestsContent />}
        {option == "Clients" && <ListClients />}
      </div>
    </>
  );
}

export default ContentOptions;
