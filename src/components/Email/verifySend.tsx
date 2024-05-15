import { JsonExcelConvert } from "@/types/ExcelFile";
import React from "react";
import styles from "./styles/verify.module.css";
import { TbX } from "react-icons/tb";

function VerifySend({
  perfils,
  emails,
}: {
  perfils: JsonExcelConvert[];
  emails: JsonExcelConvert[] | string[];
}) {
  console.log(perfils, emails);
  return (
    <>
      <h2 className={styles.titleModel}>Destinatarios:</h2>
      <div className={styles.containerDst}>
        {perfils.map((user) => (
          <div className={styles.boxUser} key={user.id}>
            <div className={styles.prevInfo}>
              <div className={styles.subBoxUser}>
                <h5 className={styles.label}>Email</h5>
                <p className={styles.text}>{user.email}</p>
              </div>
            </div>

            <div className={styles.boxDelete}>
              <TbX className={styles.iconDelete} size={20} />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.boxSend}>
        <p className={styles.btnSend}>Enviar</p>
      </div>
    </>
  );
}

export default VerifySend;
