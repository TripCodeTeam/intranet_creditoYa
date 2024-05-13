"use client";

import { useDashboardContext } from "@/context/DashboardContext";
import React from "react";
import styles from "./Styles/Content.module.css";
import RequestsContent from "./Content/Requests";
import ListClients from "./Content/ListClients";
import MailsComponents from "./Content/Mails";
import StadisticsComponent from "./Content/Stadistics";

function ContentOptions() {
  const { option } = useDashboardContext();
  return (
    <>
      <div className={styles.containerContent}>
        {option == "Request" && <RequestsContent />}
        {option == "Clients" && <ListClients />}
        {option == "Emails" && <MailsComponents />}
        {option == "statistics" && <StadisticsComponent />}
      </div>
    </>
  );
}

export default ContentOptions;
