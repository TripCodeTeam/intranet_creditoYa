"use client";

import { useDashboardContext } from "@/context/DashboardContext";
import React from "react";
import styles from "./Styles/Content.module.css";
import RequestsContent from "./Content/Requests";
import ListClients from "./Content/ListClients";
import MailsComponents from "./Content/Mails";
import AcceptContent from "./Content/Accept";
import UserProfile from "./Content/UserProfile";
import Issues from "./Content/Issues";

function ContentOptions() {
  const { option } = useDashboardContext();

  return (
    <>
      <div className={styles.containerContent}>
        {option == "Request" && <RequestsContent />}
        {option == "Accepts" && <AcceptContent />}
        {option == "Clients" && <ListClients />}
        {option == "Emails" && <MailsComponents />}
        {option == "User" && <UserProfile />}
        {option == "Issues" && <Issues />}
      </div>
    </>
  );
}

export default ContentOptions;
