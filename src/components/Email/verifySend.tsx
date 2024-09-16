import { JsonExcelConvert } from "@/types/ExcelFile";
import React, { useEffect, useState } from "react";
import styles from "./styles/verify.module.css";
import { TbX } from "react-icons/tb";
import socket from "@/app/socket";
import { toast } from "sonner";

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

  const [localPerfils, setLocalPerfils] = useState(perfils);

  useEffect(() => {
    if (!socket) return;

    socket.on("[whatsapp]sendVerifyPhones", (data) => {
      toast.success(data.message);
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
              <div className={styles.prevInfo}>
                <div className={styles.subBoxUser}>
                  <h5 className={styles.label}>Email</h5>
                  <p className={styles.text}>{user.correo_electronico}</p>
                  <p className={styles.text}>{user.telefono}</p>
                  <p className={styles.text}>{user.nombre}</p>
                </div>
              </div>

              <div
                className={styles.boxDelete}
                onClick={() => handleDeleteUser(user.id)}
              >
                <TbX className={styles.iconDelete} size={20} />
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.boxSend}>
        <p className={styles.btnSend} onClick={handleSendMessages}>
          Enviar
        </p>
      </div>
    </>
  );
}

export default VerifySend;
