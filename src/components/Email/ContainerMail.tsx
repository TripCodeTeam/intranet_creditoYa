import { ScalarClient } from "@/types/session";
import axios from "axios";
import React, { useEffect, useState } from "react";
import EditorComponent from "../Editor/Editor";
import styles from "./styles/Mail.module.css";
import { TbSend } from "react-icons/tb";

function ContainerMail({
  clientId,
  success,
  token,
}: {
  clientId: string | null;
  success: (complete: boolean) => void;
  token: string;
}) {
  const [clientData, setClientData] = useState<ScalarClient | null>(null);

  const handleCompleteEmail = (complete: boolean) => {
    success(complete);
  };

  useEffect(() => {
    const getInfoClient = async () => {
      const response = await axios.post(
        "/api/clients/id",
        {
          userId: clientId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // console.log(response)

      if (response.data.success) {
        setClientData(response.data.data);
      }
    };

    getInfoClient();
  }, [clientId, token]);
  return (
    <>
      <div className={styles.PrevDestination}>
        <div className={styles.boxIcon}>
          <TbSend className={styles.iconPrevSend} size={25} />
        </div>
        <div className={styles.boxTextInfo}>
          <h3>Destino</h3>
          <p>{clientData?.email}</p>
        </div>
      </div>
      <EditorComponent
        send={true}
        success={handleCompleteEmail}
        email={clientData?.email as string}
      />
    </>
  );
}

export default ContainerMail;
