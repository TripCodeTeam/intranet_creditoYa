"use client";

import React, { useCallback, useEffect, useState } from "react";
import styles from "../styles/BoxSession.module.css";
import { ScalarSession } from "@/types/session";
import { TbSettings, TbTrash } from "react-icons/tb";
import { toast } from "sonner";
import QRCode from "react-qr-code";
import { useGlobalContext } from "@/context/Session";
import { useWebSocket } from "next-ws/client";
import { Message } from "whatsapp-web.js";
import { createSessionWP } from "@/controllers/Whassap";

interface PropsSession {
  infoSession: ScalarSession[] | null;
  setName: (name: string) => void;
}

function BoxControlSession({ infoSession, setName }: PropsSession) {
  const { dataSession } = useGlobalContext();
  const [nameSession, setNameSession] = useState<string>("");
  const [finalNameSession, setFinalNameSession] = useState<string | null>(null);

  const ws = useWebSocket();

  const [qr, setQr] = useState<string | null>(null);
  const [loadingQr, setLoadingQr] = useState<boolean>(false);

  const onMessage = useCallback((event: MessageEvent<Blob>) => {
    // console.log(event.data);
    const dataJson = JSON.parse(String(event.data));

    if (dataJson.data.socket) {
      const id = nameSession;
      const socket = dataJson.data.socket;
      console.log(socket);
    }

    console.log(dataJson);
  }, []);

  useEffect(() => {
    ws?.addEventListener("message", onMessage);
    return () => ws?.removeEventListener("message", onMessage);
  }, [onMessage, ws]);

  const handleGenerate = async () => {
    try {
      if (!nameSession) throw new Error("Ingresa un nombre a la session");
      setFinalNameSession(nameSession);
      setLoadingQr(true);

      ws?.send(
        JSON.stringify({ type: "createSession", data: { id: nameSession } })
      );
      // createSessionWP(id, socket);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      <div className={qr !== null ? styles.registerWp : styles.unregisterWp}>
        <div className={styles.detailSession}>
          {infoSession && infoSession.length > 0 && (
            <>
              <div className={styles.boxStatus}>
                <div className={styles.centerBoxStatus}>
                  <h5>Estado: </h5>
                  <p>{infoSession[0].status}</p>
                </div>
              </div>
            </>
          )}

          <div className={styles.boxNameSession}>
            <div className={styles.centerNameStatus}>
              <h5>Nombre de session</h5>
              {finalNameSession && <h2>{nameSession}</h2>}
              {!finalNameSession && (
                <input
                  className={styles.inputNameSession}
                  type="text"
                  onChange={(e) => setNameSession(e.target.value)}
                />
              )}
            </div>
          </div>
        </div>
        {qr && (
          <div className={styles.containerBtnsQr}>
            <QRCode value={qr} style={{ width: "100%", height: "auto" }} />
          </div>
        )}
        {loadingQr && (
          <div className={styles.containerBtnsQr}>
            <p>Cargando Qr</p>
          </div>
        )}
        <div className={styles.containerBtns}>
          {infoSession && infoSession[0] && infoSession[0].nameSession ? (
            <div className={styles.btnGenerateClient} onClick={handleGenerate}>
              <div className={styles.btnCenterGenerateClient}>
                <div className={styles.boxIconBtn}>
                  <TbTrash />
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.btnGenerateClient} onClick={handleGenerate}>
              <div className={styles.btnCenterGenerateClient}>
                <div className={styles.boxIconBtn}>
                  <TbSettings className={styles.iconSetting} />
                </div>
                <p>Generar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default BoxControlSession;
