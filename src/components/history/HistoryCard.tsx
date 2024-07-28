import { ScalarLoanApplication } from "@/types/session";
import React, { useState } from "react";
import styles from "./history.module.css";
import DateToPretty from "@/handlers/DateToPretty";
import { stringToPriceCOP } from "@/handlers/stringToPriceCOP";
import { TbArrowUpRight, TbX } from "react-icons/tb";
import { useRouter } from "next/navigation";

function HistoryCard({ loan }: { loan: ScalarLoanApplication }) {
  const router = useRouter();

  const [openReasons, setOpenReasons] = useState<boolean>(false);

  return (
    <>
      <div className={styles.containerCard}>
        <div className={styles.boxCard}>
          <h5>Cantidad Solicitada</h5>
          <h2>{stringToPriceCOP(loan.cantity)}</h2>
        </div>

        <div className={styles.boxCard}>
          <h5>Cantidad Aprobada</h5>
          {loan.newCantity && (
            <h2>{stringToPriceCOP(loan.newCantity as string)}</h2>
          )}
          {!loan.newCantity && <h1>{stringToPriceCOP(loan.cantity)}</h1>}
        </div>

        <div className={styles.boxCard}>
          <h5>Estado</h5>
          <h2>{loan.status}</h2>
        </div>

        <div className={styles.boxCard}>
          <h5>Fecha de creacion</h5>
          <h2>{DateToPretty(String(loan.created_at), false)}</h2>
        </div>

        <div className={styles.reasons}>
          <h5>Razones</h5>

          <div
            className={styles.boxCantityReason}
            onClick={() => setOpenReasons(true)}
          >
            <p>Mostrar todas las razones</p>
            <div className={styles.boxIconArrow}>
              <TbArrowUpRight />
            </div>
          </div>
        </div>

        <div className={styles.reasons}>
          <h5>Detalles</h5>

          <div
            className={styles.boxCantityReason}
            onClick={() => router.push(`/req/${loan.id}`)}
          >
            <p>Mostrar los detalles completos</p>
            <div className={styles.boxIconArrow}>
              <TbArrowUpRight />
            </div>
          </div>
        </div>
      </div>

      {openReasons && (
        <div className={styles.containerReasons}>
          {loan.reasonChangeCantity && (
            <>
              <div
                className={styles.headerClose}
                onClick={() => setOpenReasons(false)}
              >
                <h3>Razones</h3>
                <div className={styles.boxCloseIcon}>
                  <TbX className={styles.iconClose} size={20} />
                </div>
              </div>

              <div className={styles.cardReason}>
                <h5>Razon por cambio de cantidad solicitada</h5>
                <p>{loan.reasonChangeCantity}</p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default HistoryCard;
