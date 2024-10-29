"use client";

import { ScalarClient, ScalarLoanApplication } from "@/types/session";
import React from "react";
import Avatar from "react-avatar";
import styles from "../styles/CardReq.module.css";
import { stringToPriceCOP } from "@/handlers/stringToPriceCOP";

function CardRequest({
  loan,
  user,
  token,
}: {
  loan: ScalarLoanApplication;
  user: ScalarClient;
  token: string;
}) {
  return (
    <div className={styles.cardRequest}>
      <div className={styles.boxInfo}>
        <div className={styles.user}>
          <div className={styles.boxAvatarClient}>
            <Avatar
              src={user?.avatar}
              className={styles.imgAvatar}
              round={true}
              size="55"
            />
          </div>
          <div className={styles.perfilInfo}>
            <h3>{`${user?.names} ${user?.firstLastName} ${user?.secondLastName}`}</h3>

            <h5 className={styles.linkPerfil}>{user.email}</h5>
          </div>
        </div>
      </div>

      <div className={styles.boxInfo}>
        <div className={styles.centerDocs}>
          <div className={styles.detailInfo}>
            <h5>Monto solicitado</h5>
            <h1>{stringToPriceCOP(loan.cantity)}</h1>
          </div>
        </div>
      </div>

      <div className={styles.boxInfoActs}>
        <div className={styles.centerInfoActs}>
          <p onClick={() => (window.location.href = `/req/${loan.id}`)}>
            Revisar solicitud
          </p>
          <p onClick={() => (window.location.href = `/client/${loan.userId}`)}>
            Ver perfil
          </p>
        </div>
      </div>
    </div>
  );
}

export default CardRequest;
