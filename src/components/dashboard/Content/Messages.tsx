import React, { useEffect, useState } from "react";
import styles from "./styles/messages.module.css";
import HeaderContent from "./Components/HeaderContent";
import { useGlobalContext } from "@/context/Session";
import axios from "axios";
import { ScalarSession } from "@/types/session";
import BoxControlSession from "./Components/BoxControlSession";
import { toast } from "sonner";

function MessagesContent() {
  const { dataSession } = useGlobalContext();
  const [infoSession, setInfoSession] = useState<ScalarSession[] | null>(null);
  const [nameSession, setNameSession] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const response = await axios.post(
        "/api/sessions/get",
        {},
        { headers: { Authorization: `Bearer ${dataSession?.token}` } }
      );

      if (response.data.success == true) {
        setInfoSession(response.data.data);
      }
    };

    getSession();
  }, [dataSession?.token]);

  const handleChangeNameSession = async (name: string) => {
    if (name) {
      setNameSession(name);
      toast.success(`Session de ${name}`);
    }
  };

  return (
    <>
      <div className={styles.mainMessages}>
        <HeaderContent label={"Whatsapp"} />

        {infoSession && dataSession?.rol == "supra_admin" && (
          <>
            <div className={styles.containerMessage}>
              <h4 className={styles.titleMessages}>Tu Session</h4>
              <BoxControlSession
                infoSession={infoSession}
                setName={handleChangeNameSession}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default MessagesContent;
