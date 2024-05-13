import React, { useCallback, useState } from "react";
import HeaderContent from "./Components/HeaderContent";
import styles from "./styles/mails.module.css";
import { JsonExcelConvert } from "@/types/ExcelFile";
import { toast } from "sonner";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import { FiUpload } from "react-icons/fi";
import FilterBox from "@/components/Email/FilterBox";
import { TbFileTypeXls, TbUsersGroup } from "react-icons/tb";

const handleSelect = ({ option }: { option: string }) => {
   
};

function MailsComponents() {
  return (
    <>
      <div className={styles.mainMasive}>
        <HeaderContent label={"Envia correos"} />

        <div className={styles.boxSelect}>
          <div className={styles.btnSelect}>
            <div className={styles.centerBtnSelect}>
              <div className={styles.boxIconSelect}>
                <TbFileTypeXls className={styles.iconSelect} size={20} />
              </div>
              <p className={styles.textBtn}>Excel</p>
            </div>
          </div>

          <div className={styles.btnSelect}>
            <div className={styles.centerBtnSelect}>
              <div className={styles.boxIconSelect}>
                <TbUsersGroup className={styles.iconSelect} size={20} />
              </div>
              <p className={styles.textBtn}>Clientes</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MailsComponents;
