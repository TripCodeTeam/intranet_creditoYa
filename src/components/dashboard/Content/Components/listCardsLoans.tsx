"use client";

import React from "react";
import styles from "../styles/Request.module.css";
import CardRequest from "./CardReq";
import { ScalarLoanApplication } from "@/types/session";
import { TbArrowNarrowLeft, TbArrowNarrowRight, TbRss } from "react-icons/tb";
import Image from "next/image";
import noDataImg from "@/assets/out-bro.svg"; // Asegúrate de que la ruta de la imagen sea correcta

interface PendingLoansListProps {
  pendingLoans: ScalarLoanApplication[] | null;
  token: string;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  total: number;
  status?: string; // Nuevo prop opcional para manejar el estado
}

const LoansList = ({
  pendingLoans,
  token,
  page,
  setPage,
  total,
  status,
}: PendingLoansListProps) => {
  return (
    <div>
      {/* Lista de solicitudes con paginación */}
      {status ? (
        // Si el status está definido, muestra un mensaje si no hay datos
        pendingLoans && pendingLoans.length === 0 ? (
          <div className={styles.noData}>
            <div style={{ display: "grid", placeContent: "center" }}>
              <Image
                className={styles.imgNoData}
                src={noDataImg}
                alt={"No data"}
              />
            </div>
            <p className={styles.titleNodata}>
              No hay Solicitudes en este estado
            </p>
          </div>
        ) : (
          pendingLoans?.map((loan) => (
            <CardRequest
              user={loan.user}
              loan={loan}
              token={token}
              key={loan.id}
            />
          ))
        )
      ) : // Si no hay estado definido, muestra la lista normalmente
      pendingLoans && pendingLoans.length > 0 ? (
        pendingLoans.map((loan) => (
          <CardRequest
            user={loan.user}
            loan={loan}
            token={token}
            key={loan.id}
          />
        ))
      ) : (
        <div className={styles.containerVoidReqss}>
          <div className={styles.centerContainerVoidReqss}>
            <div className={styles.boxRssIcon}>
              <TbRss className={styles.iconRss} size={20} />
            </div>
            <p>No hay solicitudes pendientes en este momento</p>
          </div>
        </div>
      )}

      {/* Controles de paginación */}
      <div className={styles.pagination}>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          <div className={styles.centerBtnSkip}>
            <div className={styles.boxIconSkipPage}>
              <TbArrowNarrowLeft />
            </div>
            <p className={styles.textSkip}>Anterior</p>
          </div>
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={pendingLoans ? pendingLoans.length < 5 : false}
        >
          <div className={styles.centerBtnSkip}>
            <p className={styles.textSkip}>Siguiente</p>
            <div className={styles.boxIconSkipPage}>
              <TbArrowNarrowRight />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default LoansList;
