import {
  ScalarClient,
  ScalarDocument,
  ScalarLoanApplication,
} from "@/types/session";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import styles from "../styles/CardReq.module.css";
import { useRouter } from "next/navigation";
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
  const [infoClient, setInfoClient] = useState<ScalarClient | null>(null);

  const router = useRouter();

  const { dataSession } = useGlobalContext();

  useEffect(() => {
    const getAvatar = async () => {
      try {
        const response = await axios.post(
          "/api/clients/avatar",
          {
            userId: loan.userId,
          },
          { headers: { Authorization: `Bearer ${dataSession?.token}` } }
        );

        if (response.data.success) setAvatarPerfil(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    const getUserInfo = async () => {
      try {
        const response = await axios.post(
          "/api/clients/id",
          {
            userId: loan.userId,
          },
          { headers: { Authorization: `Bearer ${dataSession?.token}` } }
        );

        const data = response.data.data;
        setInfoClient(data);
        // console.log(data);
      } catch (error) {}
    };

    getAvatar();
    getUserInfo();
  }, [loan.userId, token]);

  return (
    <>
      <div className={styles.cardRequest}>
        <div className={styles.boxInfo}>
          <div className={styles.user}>
            <div className={styles.boxAvatarClient}>
              <Avatar src={avatarPerfil} className={styles.imgAvatar} round={true} size="55" />
            </div>
            <div className={styles.perfilInfo}>
              <h3>{`${infoClient?.names} ${infoClient?.firstLastName} ${infoClient?.secondLastName}`}</h3>

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
              <h1>{stringToPriceCOP(loan.cantity)}</h1>
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
