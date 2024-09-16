"use client";

import React, { useEffect, useState } from "react";
import { JsonExcelConvert } from "@/types/ExcelFile";
import {
  TbInfoOctagon,
  TbMailCancel,
  TbMailCheck,
  TbPhotoPlus,
  TbX,
} from "react-icons/tb";
import styles from "./styles/Filter.module.css";
import { useGlobalContext } from "@/context/Session";

import Modal from "../modal/modal";
import VerifySend from "./verifySend";
import axios from "axios";
import ImageCard from "../dashboard/Content/Components/imageCard";

function FilterBox({ JsonFile }: { JsonFile: JsonExcelConvert[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const [masiveEmails, setMasiveEmails] = useState<string[] | null>(null);
  const [massivePhones, setMassivePhones] = useState<string[] | null>(null);
  const [massiveNames, setMassiveNames] = useState<string[] | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const [menssage, setMessage] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]); // Estado para las imágenes

  const [masivePerfils, setMasivePerfils] = useState<JsonExcelConvert[] | null>(
    null
  );
  const [perfilsSelects, setPerfilsSelects] = useState<
    JsonExcelConvert[] | null
  >(null);
  const [mailSelects, setMailsSelects] = useState<JsonExcelConvert[] | null>(
    null
  );
  const [verfMailSend, setVerfMailSend] = useState<boolean>(false);
  const { dataSession } = useGlobalContext();

  useEffect(() => {
    const names = JsonFile.map((user) => user.nombre);
    const emails = JsonFile.map((user) => user.correo_electronico);
    const phones = JsonFile.map((user) => String(user.telefono));

    setMasiveEmails(emails);
    setMassiveNames(names);
    setMassivePhones(phones);
    setMasivePerfils(JsonFile);

    const getSessionId = async () => {
      const response = await axios.post(
        "/api/whatsapp/get",
        {},
        { headers: { Authorization: `Bearer ${dataSession?.token}` } }
      );

      if (response.data.success == true) {
        const data = response.data.data;
        console.log(data.sessionId);
        setSessionId(data.sessionId);
      }
    };

    getSessionId();
  }, [JsonFile]);

  // Manejar la carga de imágenes
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files);
      setFiles((prevImages) => [...(prevImages || []), ...newImages]); // Guardar múltiples imágenes
    }
  };

  const handleDeleteImage = (image: File) => {
    setFiles((prevImages) =>
      prevImages ? prevImages.filter((img) => img.name !== image.name) : []
    );
  };

  const findEmailInDetail = (detail: JsonExcelConvert) => {
    for (let prop in detail) {
      if (typeof detail[prop] === "string" && detail[prop].includes("@")) {
        return detail[prop];
      }
    }
    return null;
  };

  const handleSelectUsers = (detail: JsonExcelConvert) => {
    setMasivePerfils(null);
    setPerfilsSelects((prevPerfils) => [...(prevPerfils || []), detail]);
    setMailsSelects((prevEmails) => {
      const email = findEmailInDetail(detail);
      if (email) {
        const newJsonExcelConvert = {
          ...detail,
          correo_electronico: email,
        };
        return [...(prevEmails || []), newJsonExcelConvert];
      } else {
        return prevEmails;
      }
    });
  };

  const handleDeleteSelect = (id: string) => {
    setPerfilsSelects((prevPerfils) =>
      prevPerfils ? prevPerfils.filter((user) => user.id !== id) : null
    );
    setMailsSelects((prevEmails) =>
      prevEmails ? prevEmails.filter((user) => user.id !== id) : null
    );

    if (perfilsSelects?.length == 0) {
      setPerfilsSelects(null);
    }

    if (mailSelects?.length == 0) {
      setPerfilsSelects(null);
    }
  };

  const isUserSelected = (user: JsonExcelConvert): boolean => {
    if (
      perfilsSelects &&
      perfilsSelects.some((selectedUser) => selectedUser.id === user.id)
    ) {
      return true;
    }
    return false;
  };

  const handleDeleteAll = () => {
    setMasivePerfils(null);
    setMasiveEmails(null);
  };

  const filteredDetails = JsonFile.filter((detail) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      detail.nombre.toLowerCase().includes(searchTermLower) ||
      detail.correo_electronico.toLowerCase().includes(searchTermLower)
    );
  });

  const handleSubmit = () => {
    setVerfMailSend(!verfMailSend);
  };

  console.log("Mails para enviar: ", mailSelects);
  console.log("Perfiles seleccionados: ", perfilsSelects);
  console.log("All Emails: ", masiveEmails);
  console.log("All Names: ", massiveNames);
  console.log("All Phones: ", massivePhones);

  return (
    <>
      <div className={styles.editorContainer}>
        <div className={styles.boxMessage}>
          <h5>Mensaje</h5>
          <textarea onChange={(e) => setMessage(e.target.value)} />
        </div>

        <div className={styles.barOpenIssues}>
          <input
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            id="fileInput"
            onChange={handleImageUpload}
          />

          <div
            className={styles.btnPic}
            onClick={() => {
              document.getElementById("fileInput")?.click();
            }}
          >
            <div className={styles.boxIconIssue}>
              <TbPhotoPlus className={styles.iconAddImage} size={20} />
            </div>
            <p className={styles.TextPic}>Agregar Imagen</p>
          </div>
        </div>

        <div className={styles.imageGallery}>
          {files &&
            files.map((image, index) => (
              <ImageCard
                onDelete={handleDeleteImage}
                key={index}
                image={image}
              />
            ))}
        </div>
      </div>

      <div className={styles.mailDestinity}>
        <div className={styles.barDestinities}>
          <p className={styles.warnTitle}>Destinatarios: </p>
          {masiveEmails && masivePerfils && (
            <div className={styles.btnSelect}>
              <div className={styles.boxIconCancel}>
                <TbX
                  className={styles.iconCancel}
                  size={20}
                  onClick={handleDeleteAll}
                />
              </div>
              <p className={styles.textAll}>Todos</p>
            </div>
          )}

          {perfilsSelects &&
            mailSelects &&
            perfilsSelects.map((user) => (
              <div className={styles.btnSelect} key={user.id}>
                <div className={styles.boxIconCancel}>
                  <TbX
                    className={styles.iconCancel}
                    size={20}
                    onClick={() => handleDeleteSelect(user.id)}
                  />
                </div>
                <p className={styles.textAll}>{user.correo_electronico}</p>
              </div>
            ))}

          {masiveEmails == null &&
            masivePerfils == null &&
            mailSelects == null && (
              <div className={styles.noDest}>
                <div className={styles.warnIconBox}>
                  <TbInfoOctagon />
                </div>
                <p>No hay destinatarios para este correo</p>
              </div>
            )}
        </div>
        <div className={styles.btnSendMail}>
          <p className={styles.btnSend} onClick={handleSubmit}>
            Enviar
          </p>
        </div>
      </div>

      <div className={styles.searchContainer}>
        <div className={styles.boxInput}>
          <input
            type="text"
            placeholder="Busca por nombre"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>

      <div className={styles.maxCardPerson}>
        {filteredDetails.map((detail) => (
          <div className={styles.centerCardPerson} key={detail.id}>
            <div className={styles.cardPerson}>
              {Object.entries(detail).map(([key, value]) => (
                <div className={styles.subBoxDetail} key={key}>
                  <h5>{key}</h5>
                  <p>{value}</p>
                </div>
              ))}
            </div>

            <div className={styles.boxOpts}>
              <div className={styles.boxIconSend}>
                {isUserSelected(detail) ? (
                  <TbMailCancel
                    onClick={() => handleDeleteSelect(detail.id)}
                    className={styles.iconSelect}
                    size={23}
                  />
                ) : (
                  <TbMailCheck
                    onClick={() => handleSelectUsers(detail)}
                    className={styles.iconSelect}
                    size={23}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={verfMailSend} onClose={handleSubmit}>
        <VerifySend
          perfils={masivePerfils as JsonExcelConvert[]}
          emails={masiveEmails as string[]}
          phones={massivePhones as string[]}
          names={massiveNames as string[]}
          sessionId={sessionId as string}
          files={files}
          message={menssage as string}
        />
      </Modal>
    </>
  );
}

export default FilterBox;
