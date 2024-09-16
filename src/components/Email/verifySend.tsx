import { JsonExcelConvert } from "@/types/ExcelFile";
import React, { useEffect, useState } from "react";
import styles from "./styles/verify.module.css";
import { TbCircleCheck, TbLoader, TbX } from "react-icons/tb";
import socket from "@/app/socket";
import { toast } from "sonner";
import axios from "axios";
import { useGlobalContext } from "@/context/Session";

function VerifySend({
  sessionId,
  perfils,
  emails,
  phones,
  names,
  files,
  message,
}: {
  perfils: JsonExcelConvert[];
  emails: JsonExcelConvert[] | string[];
  phones: JsonExcelConvert[] | string[];
  names: string[];
  sessionId: string;
  message: string;
  files: File[];
}) {
  console.log(perfils);
  console.log(emails);
  console.log(phones);
  console.log(names);
  console.log(files);
  console.log(message);

  const { dataSession } = useGlobalContext();
  const [localPerfils, setLocalPerfils] = useState(perfils);

  const [isComplete, setIsComplete] = useState(false);
  const [isSendMessages, setIsSendMessages] = useState(false);
  const [messageProcces, setMessageProcces] = useState("");

  useEffect(() => {
    if (!socket) return;

    socket.on("[whatsapp]sendVerifyPhones", async (data) => {
      toast.success(data.message);

      // const sendMails = await axios.post(
      //   "/api/mail/masive",
      //   { completeNames: names, mails: emails, message, files },
      //   { headers: { Authorization: `Bearer ${dataSession?.token}` } }
      // );

      // if (sendMails.data.success === true) {
      // }

      setIsComplete(true);
      setIsSendMessages(false);
      setMessageProcces("Mensajes enviados correctamente");
    });

    return () => {
      socket?.off("[whatsapp]sendVerifyPhones");
    };
  }, []);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file); // Convierte el archivo a base64
    });
  };

  const handleSendMessages = async () => {
    if (!socket) {
      throw new Error("Socket no required!");
    }

    if (!phones || phones.length === 0) {
      toast.error("No hay teléfonos disponibles para enviar mensajes");
      return;
    }

    const filesBase64 = await Promise.all(
      files.map(async (file) => {
        const base64 = await convertFileToBase64(file);
        return {
          name: file.name,
          type: file.type,
          data: base64.split(",")[1],
        };
      })
    );

    console.log(phones);

    const data = {
      sessionId,
      phones,
      names,
      message,
      files: filesBase64,
    };

    socket.emit("[whatsapp_client]entryNumbersPhone", data);
    setIsSendMessages(true);
    setMessageProcces("Enviando desde Whatsapp");
  };

  const handleDeleteUser = (id: string) => {
    setLocalPerfils(localPerfils.filter((user) => user.id !== id));
  };

  return (
    <>
      <h2 className={styles.titleModel}>Destinatarios:</h2>
      <div className={styles.containerDst}>
        {localPerfils.length === 0 ? (
          <p>No hay destinatarios disponibles.</p>
        ) : (
          localPerfils.map((user) => (
            <div className={styles.boxUser} key={user.id}>
              <div
                className={styles.boxDelete}
                onClick={() => handleDeleteUser(user.id)}
              >
                <p>Informacion de contacto</p>
                <TbX className={styles.iconDelete} size={20} />
              </div>
              <div className={styles.prevInfo}>
                <p className={styles.text}>{user.nombre}</p>
                <p className={styles.text}>{user.correo_electronico}</p>
                <p className={styles.text}>{user.telefono}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.boxSend}>
        {isSendMessages === false && isComplete === false && (
          <>
            <p className={styles.btnSend} onClick={handleSendMessages}>
              Enviar
            </p>
          </>
        )}

        {isSendMessages === true && isComplete === false && (
          <div className={styles.barLoader}>
            <div className={styles.boxIconLoader}>
              <TbLoader className={styles.iconLoader} size={20} />
            </div>
            <p className={styles.textMessage}>{messageProcces}</p>
          </div>
        )}

        {isComplete === true && (
          <div className={styles.barLoader}>
            <div className={styles.boxIconLoader}>
              <TbCircleCheck size={20} />
            </div>
            <p className={styles.textMessage}>{messageProcces}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default VerifySend;
