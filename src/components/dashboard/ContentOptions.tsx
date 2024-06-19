"use client";

import { useDashboardContext } from "@/context/DashboardContext";
import React from "react";
import styles from "./Styles/Content.module.css";
import RequestsContent from "./Content/Requests";
import ListClients from "./Content/ListClients";
import MailsComponents from "./Content/Mails";
import AcceptContent from "./Content/Accept";

function ContentOptions() {
  const { option } = useDashboardContext();

  return (
    <>
      <div className={styles.containerContent}>
        {option == "Request" && <RequestsContent />}
        {option == "Accepts" && <AcceptContent />}
        {option == "Clients" && <ListClients />}
        {option == "Emails" && <MailsComponents />}
      </div>
    </>
  );
}

export default ContentOptions;
