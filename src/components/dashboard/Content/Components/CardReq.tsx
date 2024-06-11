import { ScalarDocument, ScalarLoanApplication } from "@/types/session";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import styles from "../styles/CardReq.module.css";
import Image from "next/image";
import { TbInfoHexagon } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import socket from "@/lib/socket/socket";
import { Status } from "@/types/session";
import { useGlobalContext } from "@/context/Session";
import InfoEmployee from "./IdForName";
import StatsLoan from "./StatsLoan";
import CopText from "./copText";

function CardRequest({
  loan,
  token,
}: {
  loan: ScalarLoanApplication;
  token: string;
}) {
  const [avatarPerfil, setAvatarPerfil] = useState<string>("");
  const [docsClient, setDocsClient] = useState<ScalarDocument | null>(null);
  const router = useRouter();

  const [reason, setReason] = useState<string | null>(null);

  const { dataSession } = useGlobalContext();

  const handlerDecision = ({
    accept,
    reason,
  }: {
    accept: boolean;
    reason: string | null;
  }) => {
    if (accept === true) {
      const data: {
        nameUser: string;
        emailUser: string;
        employeeId: string;
        loanApplicationId: string;
        state: Status;
        reason: string | null;
      } = {
        nameUser: `${loan.firtLastName} ${loan.secondLastName}`,
        emailUser: loan.email,
        employeeId: dataSession?.id as string,
        loanApplicationId: loan.id as string,
        reason,
        state: "Aprobado",
      };
      socket.emit("changeState", data);
      toast.success("Solicitud Aceptada");
    } else if (accept === false) {
      toast.error("Solicitud Rechazada");
    }
  };

  useEffect(() => {
    const getAvatar = async () => {
      const response = await axios.post("/api/clients/avatar", {
        userId: loan.userId,
      });
      setAvatarPerfil(response.data.data);
    };

    const getDocs = async () => {
      const response = await axios.post(
        "/api/clients/docs/id",
        {
          userId: loan.userId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(response.data)

      if (response.data.success) setDocsClient(response.data.data);
    };

    getAvatar();
    getDocs();
  }, []);

  return (
    <>
      <div className={styles.cardRequest}>
        <h2 className={styles.titlePreview}>Informacion previa</h2>
        <div className={styles.barDetails}>
          <div className={styles.boxAvatar}>
            <Avatar
              className={styles.iconAvatar}
              src={avatarPerfil}
              round={true}
              size="50"
            />
          </div>
          <div className={styles.boxDetail}>
            <h4 className={styles.label}>Nombre</h4>
            <p className={styles.textDetail}>
              {loan.names} {loan.firtLastName} {loan.secondLastName}
            </p>
          </div>

          <div className={styles.boxDetail}>
            <h4 className={styles.label}>Cedula ({loan.typeDocument})</h4>
            <p className={styles.textDetail}>{loan.numberDocument}</p>
          </div>

          <div className={styles.boxDetail}>
            <h4 className={styles.label}>Ingresos Mensuales</h4>
            <p className={styles.textDetail}>$ {loan.monthly_income} COP</p>
          </div>

          <div className={styles.boxDetail}>
            <h4 className={styles.label}>Codeudor</h4>
            <p className={styles.textDetail}>{loan.co_debtor}</p>
          </div>

          <div className={styles.boxDetail}>
            <h4 className={styles.label}>Creacion de prestamo</h4>
            <p className={styles.textDetail}>{String(loan.createdAt)}</p>
          </div>
        </div>

        <div className={styles.optionContainer}>
          <div className={styles.prevDocsStats}>
            <div className={styles.previewDocs}>
              <div className={styles.listDocs}>

                <div className={styles.boxAvatar}>
                  <Image
                    src={docsClient?.documentFront as string}
                    className={styles.imgDocPrew}
                    alt={"logo"}
                    width={250}
                    height={150}
                  />
                </div>

                <div className={styles.boxAvatar}>
                  <Image
                    src={docsClient?.documentBack as string}
                    className={styles.imgDocPrew}
                    alt={"logo"}
                    width={250}
                    height={150}
                  />
                </div>
              </div>
            </div>
            {/* {loan.status === "Aprobado" && (
            <StatsLoan
              loanId={loan.id as string}
              token={dataSession?.token as string}
            />
          )} */}
          </div>

          <div className={styles.btnsActions}>
            <div className={styles.supraInfo}>
              <CopText
                label={"Cantidad Requerida"}
                cantity={loan.requested_amount}
              />
              {loan.status === "Aprobado" && (
                <div className={styles.employeeInfo}>
                  <div className={styles.centerEmployeeInfo}>
                    <h3 className={styles.titleEmployee}>Asesor encargado</h3>
                    <InfoEmployee
                      employeeId={loan.employeeId as string}
                      token={token}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className={styles.barBtnsActios}>
              <div className={styles.BoxInfo}>
                <div
                  className={styles.centerBoxInfo}
                  onClick={() => router.push(`/req/${loan.id}`)}
                >
                  <p className={styles.textBtnDetails}>Detalles Completos</p>
                </div>
              </div>

              <div className={styles.BoxInfo}>
                <div
                  className={styles.centerBoxInfo}
                  onClick={() => router.push(`/req/${loan.id}/payments`)}
                >
                  <p className={styles.textBtnDetails}>Registros de pago</p>
                </div>
              </div>
            </div>

            {loan.status === "Pendiente" && (
              <div className={styles.barBtnsActios}>
                <div className={styles.BoxInfoAccept}>
                  <p
                    className={styles.btnAccept}
                    onClick={() =>
                      handlerDecision({ accept: true, reason: null })
                    }
                  >
                    Aceptar
                  </p>
                  <p
                    className={styles.btnCancel}
                    onClick={() =>
                      handlerDecision({ accept: false, reason: null })
                    }
                  >
                    Rechazar
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CardRequest;
