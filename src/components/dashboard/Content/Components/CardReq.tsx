import { ScalarLoanApplication } from "@/types/session";
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

function CardRequest({ loan }: { loan: ScalarLoanApplication }) {
  const [avatarPerfil, setAvatarPerfil] = useState<string>("");
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

    getAvatar();
  }, []);

  return (
    <>
      <div className={styles.cardRequest}>
        <div className={styles.barDetails}>
          <div className={styles.boxAvatar}>
            <Avatar
              className={styles.iconAvatar}
              src={avatarPerfil}
              round={true}
              size="40"
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
            <p className={styles.textDetail}>{loan.ccNumber}</p>
          </div>

          <div className={styles.boxDetail}>
            <h4 className={styles.label}>Ingresos Mensuales</h4>
            <p className={styles.textDetail}>$ {loan.monthly_income} COP</p>
          </div>
        </div>

        <div className={styles.previewDocs}>
          <div className={styles.boxAvatar}>
            <Image
              src={
                "https://res.cloudinary.com/df2gu30lb/image/upload/v1714866540/lof8bc8zqyy5ttrafzia.jpg"
              }
              className={styles.imgDocPrew}
              alt={"logo"}
              width={250}
              height={150}
            />
          </div>
          <div className={styles.boxAvatar}>
            <Image
              src={
                "https://res.cloudinary.com/df2gu30lb/image/upload/v1714866540/lof8bc8zqyy5ttrafzia.jpg"
              }
              className={styles.imgDocPrew}
              alt={"logo"}
              width={250}
              height={150}
            />
          </div>

          <div className={styles.boxAvatar}>
            <Image
              src={
                "https://res.cloudinary.com/df2gu30lb/image/upload/v1714866540/lof8bc8zqyy5ttrafzia.jpg"
              }
              className={styles.imgDocPrew}
              alt={"logo"}
              width={250}
              height={150}
            />
          </div>
        </div>

        <div className={styles.btnsActions}>
          <div className={styles.barBtnsActios}>
            <div className={styles.BoxInfo}>
              <div
                className={styles.centerBoxInfo}
                onClick={() => router.push(`/req/${loan.id}`)}
              >
                {/* <div className={styles.boxIconInfo}>
                <TbInfoHexagon size={20} className={styles.iconInfo} />
              </div> */}
                <p className={styles.textBtnDetails}>Detalles</p>
              </div>
            </div>
          </div>

          <div className={styles.loadCantity}>
            <h4 className={styles.titleCantity}>Cantidad Requerida</h4>
            <p className={styles.textCantity}>$ {loan.requested_amount} COP</p>
          </div>

          <div className={styles.barBtnsActios}>
            <div className={styles.BoxInfoAccept}>
              <p
                className={styles.btnAccept}
                onClick={() => handlerDecision({ accept: true, reason: null })}
              >
                Aceptar
              </p>
              <p
                className={styles.btnCancel}
                onClick={() => handlerDecision({ accept: false, reason: null })} 
              >
                Rechazar
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CardRequest;
