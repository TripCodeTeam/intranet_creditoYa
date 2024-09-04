"use client";

import React, { useEffect, useState } from "react";
import HeaderContent from "./Components/HeaderContent";
import styles from "./styles/mails.module.css";
import MasiveEmails from "./Components/MasiveEmails";
import socket from "@/app/socket";

function MailsComponents() {
  const [option, setOption] = useState<string | null>("excel");

  return (
    <>
      <div className={styles.mainMasive}>
        <HeaderContent label={"Herramientas"} />
        <MasiveEmails />
      </div>
    </>
  );
}

export default MailsComponents;
