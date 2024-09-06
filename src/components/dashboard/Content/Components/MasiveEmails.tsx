import FilterBox from "@/components/Email/FilterBox";
import React, { useCallback, useEffect, useState } from "react";
import styles from "../styles/masiveEmails.module.css";
import { JsonExcelConvert } from "@/types/ExcelFile";
import axios from "axios";
import { toast } from "sonner";
import { PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";
import {
  TbBrandWhatsapp,
  TbCircleCheck,
  TbCircleChevronDown,
  TbCircleChevronRight,
  TbLoader,
  TbQrcode,
  TbQrcodeOff,
  TbUserPlus,
} from "react-icons/tb";
import QrGenerate from "./qr_generate";
import AddUserIntranet from "./add_user";
import socket from "@/app/socket";
import { generateSessionName } from "@/handlers/randomNamesSession";
import QRCode from "react-qr-code";
import { scalarWhatsappSession } from "@/types/session";
import { useGlobalContext } from "@/context/Session";

function MasiveEmails() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jsonFile, setJsonFile] = useState<JsonExcelConvert[] | null>(null);

  const { dataSession } = useGlobalContext();

  const [openMail, setOpenMails] = useState(false);
  const [openMailQr, setOpenMailsQr] = useState(false);
  const [openAddUser, setOpenAddUser] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isReadySession, setIsReadySession] = useState(false);
  const [inProccess, setInProccess] = useState(false);

  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentSession = async () => {
      setInProccess(true);
      const response = await axios.post(
        "api/whatsapp/get",
        {},
        { headers: { Authorization: `Bearer ${dataSession?.token}` } }
      );

      if (response.data.success == true) {
        const data: scalarWhatsappSession = response.data.data;
        setInProccess(false);
        setSessionId(data.id as string);
        toast.success("Sessiones recuperada");
      } else if (response.data.success == false) {
        setInProccess(false);
        // toast.error(response.data.error);
      }
    };

    getCurrentSession();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("[whatsapp]qr_obtained", (data) => {
      const qr = data.qr;
      const message = data.message;
      if (inProccess == true) setInProccess(false);

      setQr(qr);
    });

    socket.on("[whatsapp]isReady", async (data) => {
      const sessionId = data.id;
      const message = data.message;

      console.log(sessionId);
      console.log(message);

      const addSession = await axios.post(
        "/api/whatsapp/create",
        {
          sessionId,
        },
        { headers: { Authorization: `Bearer ${dataSession?.token}` } }
      );

      console.log(addSession.data);

      if (addSession.data.success == true) {
        setQr(null);
        setInProccess(false);
        setIsReadySession(true);
        toast.error("Session guardada exitosamente");
      } else if (addSession.data.success == false) {
        setQr(null);
        setInProccess(false);
        setIsReadySession(true);
        toast.error("Error al guardar session");
      }
    });

    return () => {
      socket?.off("[whatsapp]qr_obtained");
    };
  }, []);

  const handlerCreateSession = () => {
    try {
      if (!socket) return;

      setInProccess(true);
      const sessionId = generateSessionName();
      setSessionId(sessionId);

      socket.emit("createSession", { id: sessionId });
    } catch (error) {}
  };

  const processFile = async () => {
    if (selectedFile) {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = async () => {
        let formData = new FormData();
        formData.append("workbook", selectedFile);

        // console.log(formData.get("workbook"));
        // console.log(selectedFile);

        try {
          const response = await axios.post(
            "/api/handler/exceltojson",
            formData
          );

          // console.log(response.data);

          if (response.data.success == false) {
            throw new Error("Error al procesar archivo");
          }

          const jsonResponse: JsonExcelConvert[] = await response.data.data;
          // console.log(jsonResponse);
          setJsonFile(jsonResponse);
        } catch (error) {
          if (error instanceof Error) {
            // console.log(error);
            toast.error(error.message);
          }
        }
      };

      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        // Comprueba si el archivo es un libro de Excel
        if (
          file.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          file.type === "application/vnd.ms-excel"
        ) {
          setSelectedFile(file);
          processFile();
        } else {
          console.log("El archivo no es un libro de Excel");
        }
      });
    },
    [processFile]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <>
      <div className={styles.mainMail}>
        <div className={styles.barWhatsapp}>
          <div
            className={
              isReadySession == true && sessionId !== null
                ? styles.noNormalCenterBar
                : styles.normalCenterBar
            }
          >
            <div
              className={
                isReadySession == true && sessionId !== null
                  ? styles.boxIconWhatsappOk
                  : styles.boxIconWhatsapp
              }
            >
              <TbBrandWhatsapp
                className={styles.iconWhatsapp}
                size={isReadySession == true && sessionId !== null ? 50 : 20}
              />
            </div>

            <div className={styles.boxAlerts}>
              {isReadySession == true && sessionId !== null && (
                <>
                  <div className={styles.boxInfoSession}>
                    <h5>Session ID</h5>
                    <h3>{sessionId}</h3>
                  </div>
                </>
              )}

              {isReadySession == false && (
                <>
                  <h3>Crear session de whatsapp</h3>
                  <h5>
                    Da Click en "Generar" y despues: abre la aplicacion de
                    whatsapp y vincula el dispositivo con el qr generado
                  </h5>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      marginTop: "10px",
                    }}
                  >
                    <p
                      className={styles.btnGenerate}
                      onClick={handlerCreateSession}
                    >
                      Generar
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div
            className={
              isReadySession == true && sessionId !== null
                ? styles.noNoxActionConnect
                : styles.boxActionConnect
            }
          >
            {isReadySession == false && qr == null && (
              <div className={styles.boxTextBtn}>
                {inProccess == true && (
                  <div className={styles.boxQrLoader}>
                    <div className={styles.boxQrOff}>
                      <TbLoader className={styles.iconLoader} size={50} />
                    </div>
                    <p>Generando Qr</p>
                  </div>
                )}

                {inProccess == false && (
                  <>
                    <div className={styles.boxQrLoader}>
                      <div className={styles.boxQrOff}>
                        <TbQrcodeOff size={60} />
                      </div>
                      <p>Qr no disponible</p>
                    </div>
                  </>
                )}
              </div>
            )}

            {qr !== null && isReadySession == false && (
              <QRCode
                size={120}
                // style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={qr as string}
                viewBox={`0 0 256 256`}
              />
            )}

            {isReadySession == true && qr == null && (
              <TbCircleCheck size={30} className={styles.iconCheck} />
            )}
          </div>
        </div>

        <div
          className={styles.containerMasiveMail}
          onClick={() => setOpenMails(!openMail)}
        >
          <div className={styles.partMassive}>
            <div className={styles.boxIconExcel}>
              <PiMicrosoftExcelLogoDuotone size={30} />
            </div>
            <div>
              <h3>Contactos en Excel</h3>
              <p>Saca informacion de contacto desde un archivo Excel</p>
            </div>
          </div>
          <div className={styles.iconOpenTool}>
            {openMail && <TbCircleChevronDown size={20} />}
            {!openMail && <TbCircleChevronRight size={20} />}
          </div>
        </div>

        {openMail && (
          <>
            <div
              {...getRootProps()}
              className={
                !selectedFile ? styles.containerDropNo : styles.containerDrop
              }
            >
              <input {...getInputProps()} />

              {selectedFile ? (
                <>
                  <div className={styles.NameFile}>
                    <div className={styles.iconNameFile}>
                      <PiMicrosoftExcelLogoDuotone size={44} />
                    </div>
                    <p>{selectedFile.name}</p>
                  </div>
                  <p className={styles.bytesFile}>
                    Tamaño: {selectedFile.size} bytes
                  </p>
                </>
              ) : (
                <div className={styles.boxMessage}>
                  <div className={styles.boxIconFile}>
                    <FiUpload className={styles.iconLoadFile} size={30} />
                  </div>
                  <p>Arrastra y suelta el documento de Excel</p>
                </div>
              )}
            </div>

            {!jsonFile && (
              <div className={styles.boxBtnProc}>
                <button
                  className={styles.btnProcess}
                  disabled={selectedFile ? false : true}
                  onClick={processFile}
                >
                  Procesar
                </button>
              </div>
            )}

            {jsonFile && (
              <>
                <div className={styles.containerFilter}>
                  <FilterBox JsonFile={jsonFile} />
                </div>
              </>
            )}
          </>
        )}

        <div
          className={styles.containerMasiveMail}
          onClick={() => setOpenMailsQr(!openMailQr)}
        >
          <div className={styles.partMassive}>
            <div className={styles.boxIconExcel}>
              <TbQrcode size={30} />
            </div>
            <div>
              <h3>Generar Codigo Qr</h3>
              <p>Digita un link y genera un codigo QR</p>
            </div>
          </div>
          <div className={styles.iconOpenTool}>
            {openMailQr && <TbCircleChevronDown size={20} />}
            {!openMailQr && <TbCircleChevronRight size={20} />}
          </div>
        </div>

        {openMailQr && <QrGenerate />}

        <div
          className={styles.containerMasiveMail}
          onClick={() => setOpenAddUser(!openAddUser)}
        >
          <div className={styles.partMassive}>
            <div className={styles.boxIconExcel}>
              <TbUserPlus size={30} />
            </div>
            <div>
              <h3>Agregar usuarios a Intranet</h3>
              <p>Agrega un integrante a la intranet y dale permisos</p>
            </div>
          </div>
          <div className={styles.iconOpenTool}>
            {openAddUser && <TbCircleChevronDown size={20} />}
            {!openAddUser && <TbCircleChevronRight size={20} />}
          </div>
        </div>

        {openAddUser && <AddUserIntranet />}
      </div>
    </>
  );
}

export default MasiveEmails;
