import { ScalarDocument, ScalarLoanApplication } from "@/types/session";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import styles from "../styles/CardReq.module.css";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Status } from "@/types/session";
import { useGlobalContext } from "@/context/Session";
import Link from "next/link";
import { stringToPriceCOP } from "@/handlers/stringToPriceCOP";

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
      // socket.emit("changeState", data);
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

      console.log(response.data);

      if (response.data.success) setDocsClient(response.data.data);
    };

    getAvatar();
    getDocs();
  }, [loan.userId, token]);

  return (
    <>
      <div className={styles.cardRequest}>
        <div className={styles.boxInfo}>
          <div className={styles.user}>
            <div className={styles.boxAvatarClient}>
              <Avatar src={avatarPerfil} round={true} size="55" />
            </div>
            <div className={styles.perfilInfo}>
              <h3>{`${loan.names} ${loan.firtLastName} ${loan.secondLastName}`}</h3>

              <Link
                className={styles.linkPerfil}
                href={`/client/${loan.userId}`}
              >
                Visitar perfil
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.boxInfo}>
          <div className={styles.centerDocs}>
            <div className={styles.detailInfo}>
              <h5>Monto solicitado</h5>
              <h1>{stringToPriceCOP(loan.requested_amount)}</h1>
            </div>
          </div>
        </div>

        <div className={styles.boxInfoActs}>
          <div className={styles.centerInfoActs}>
            <p onClick={() => router.push(`/req/${loan.id}`)}>Revisar</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default CardRequest;
