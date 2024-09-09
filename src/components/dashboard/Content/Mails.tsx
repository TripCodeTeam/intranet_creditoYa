"use client";

import HeaderContent from "./Components/HeaderContent";
import styles from "./styles/mails.module.css";
import MasiveEmails from "./Components/MasiveEmails";

function MailsComponents() {
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
