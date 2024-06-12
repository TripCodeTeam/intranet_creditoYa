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
        <HeaderContent label={"Envia correos"} />

        <div className={styles.boxSelect}>
          <div
            className={option == "excel" ? styles.btnSelectActive : styles.btnSelect }
            onClick={() => handleSelect({ option: "excel" })}
          >
            <div className={styles.centerBtnSelect}>
              <div className={styles.boxIconSelect}>
                <TbFileTypeXls className={styles.iconSelect} size={20} />
              </div>
              <p className={styles.textBtn}>Excel</p>
            </div>
          </div>

          <div
            className={option == "clients" ? styles.btnSelectActive : styles.btnSelect }
            onClick={() => handleSelect({ option: "clients" })}
          >
            <div className={styles.centerBtnSelect}>
              <div className={styles.boxIconSelect}>
                <TbUsersGroup className={styles.iconSelect} size={20} />
              </div>
              <p className={styles.textBtn}>Clientes</p>
            </div>
          </div>
        </div>

        {option == "excel" && <MasiveEmails />}
      </div>
    </>
  );
}

export default MailsComponents;
