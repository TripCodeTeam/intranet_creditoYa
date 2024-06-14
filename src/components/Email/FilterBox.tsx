"use client";

import React, { useEffect, useState } from "react";
import { JsonExcelConvert } from "@/types/ExcelFile";
import { TbInfoOctagon, TbMailCancel, TbMailCheck, TbX } from "react-icons/tb";
import styles from "./styles/Filter.module.css";
import { useGlobalContext } from "@/context/Session";

import Modal from "../modal/modal";
import VerifySend from "./verifySend";
import EditorComponent from "../Editor/Editor";

interface EditorEvent {
  htmlValue: string;
  textValue: string;
  delta: any;
  source: string;
}

function FilterBox({ JsonFile }: { JsonFile: JsonExcelConvert[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const [masiveEmails, setMasiveEmails] = useState<string[] | null>(null);
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

  const [sendMail, setSendMail] = useState<boolean>(false);
  const { dataSession } = useGlobalContext();

  useEffect(() => {
    const emails = JsonFile.map((user) => user.email);
    setMasiveEmails(emails);
    setMasivePerfils(JsonFile);
  }, [JsonFile]);

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
          email: email,
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
    // Buscamos en todas las claves del objeto detail
    for (const key in detail) {
      // Verificamos si el valor de la clave parece ser un correo electrónico
      if (typeof detail[key] === "string" && /\S+@\S+\.\S+/.test(detail[key])) {
        // Si el valor parece ser un correo electrónico, hacemos más comprobaciones
        const email = detail[key].toLowerCase();
        // Hacemos diferentes comprobaciones para detectar diferentes tipos de correo electrónico
        if (
          email.includes("@gmail") ||
          email.includes("@yahoo") ||
          email.includes("@hotmail") ||
          email.includes("@outlook")
        ) {
          return true; // Si es uno de los correos electrónicos específicos, lo incluimos en los detalles filtrados
        }
      }
    }
    return false; // Si no encontramos un correo electrónico válido, excluimos este detalle
  });

  const handleSubmit = () => {
    setVerfMailSend(!verfMailSend);
  };

  const successSendMail = (complete: boolean): void => {
    setSendMail(complete);
  };

  console.log("Mails para enviar: ", mailSelects);
  console.log("Perfiles seleccionados: ", perfilsSelects);
  console.log("All Emails: ", masiveEmails);

  return (
    <>
      <div className={styles.editorContainer}>
        <EditorComponent success={successSendMail} email={masiveEmails} />
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
                <p className={styles.textAll}>{user.email}</p>
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
        {masivePerfils != null && masiveEmails != null && (
          <VerifySend perfils={masivePerfils} emails={masiveEmails} />
        )}

        {perfilsSelects != null && mailSelects != null && (
          <VerifySend perfils={perfilsSelects} emails={mailSelects} />
        )}
      </Modal>
    </>
  );
}

export default FilterBox;
