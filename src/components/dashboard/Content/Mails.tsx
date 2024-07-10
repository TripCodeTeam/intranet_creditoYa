import React, { useCallback, useState } from "react";
import HeaderContent from "./Components/HeaderContent";
import styles from "./styles/mails.module.css";
import { TbFileTypeXls, TbUsersGroup } from "react-icons/tb";
import MasiveEmails from "./Components/MasiveEmails";

function MailsComponents() {
  const [option, setOption] = useState<string | null>("excel");

  const handleSelect = ({ option }: { option: string }) => {
    setOption(option);
  };

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
