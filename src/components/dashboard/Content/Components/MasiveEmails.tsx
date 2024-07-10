import FilterBox from "@/components/Email/FilterBox";
import React, { useCallback, useState } from "react";
import styles from "../styles/masiveEmails.module.css";
import { JsonExcelConvert } from "@/types/ExcelFile";
import axios from "axios";
import { toast } from "sonner";
import { PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";
import {
  TbCircleChevronDown,
  TbCircleChevronRight,
  TbQrcode,
  TbUserPlus,
} from "react-icons/tb";
import QrGenerate from "./qr_generate";

function MasiveEmails() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jsonFile, setJsonFile] = useState<JsonExcelConvert[] | null>(null);

  const [openMail, setOpenMails] = useState(false);
  const [openMailQr, setOpenMailsQr] = useState(false);
  const [openAddUser, setOpenAddUser] = useState(false);

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
      </div>

      {jsonFile && (
        <>
          <div className={styles.containerFilter}>
            <FilterBox JsonFile={jsonFile} />
          </div>
        </>
      )}
    </>
  );
}

export default MasiveEmails;
