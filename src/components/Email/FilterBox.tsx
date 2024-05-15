"use client";

import React, { useEffect, useState } from "react";
import { JsonExcelConvert } from "@/types/ExcelFile";
import {
  TbFlame,
  TbInfoOctagon,
  TbMailCancel,
  TbMailCheck,
  TbPhotoPlus,
  TbX,
} from "react-icons/tb";
import styles from "./styles/Filter.module.css";
import Dropzone from "react-dropzone";
import axios from "axios";
import { toast } from "sonner";
import { useGlobalContext } from "@/context/Session";

import { Editor } from "primereact/editor";
import { MdFormatListBulletedAdd } from "react-icons/md";
import Modal from "../modal/modal";
import VerifySend from "./verifySend";

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
  const [contentMail, setContentMail] = useState("");
  const { dataSession } = useGlobalContext();

  useEffect(() => {
    const emails = JsonFile.map((user) => user.email);
    setMasiveEmails(emails);
    setMasivePerfils(JsonFile);
  }, [JsonFile]);

  const handleTextChange = (e: EditorEvent) => {
    setContentMail(e.htmlValue);
    // console.log(e.htmlValue);
  };

  const handleSelectUsers = (detail: JsonExcelConvert) => {
    setMasivePerfils(null);
    setPerfilsSelects((prevPerfils) => [...(prevPerfils || []), detail]);
    setMailsSelects((prevEmails) => [...(prevEmails || []), detail]);
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

  const filteredDetails = JsonFile.filter(
    (detail) =>
      detail.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      detail.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    setVerfMailSend(!verfMailSend);
  };

  console.log();

  return (
    <>
      <div className={styles.editorContainer}>
        <Editor
          value={contentMail}
          onTextChange={handleTextChange}
          style={{ height: "300px" }}
        />
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
              <div className={styles.subBoxDetail}>
                <h5>Nombre</h5>
                <p>{detail.Nombre}</p>
              </div>

              <div className={styles.subBoxDetail}>
                <h5>Email</h5>
                <p>{detail.email}</p>
              </div>

              <div className={styles.subBoxDetail}>
                <h5>Telefono</h5>
                <p>{detail.telefono}</p>
              </div>

              <div className={styles.subBoxDetail}>
                <h5>Profesion</h5>
                <p>{detail.rol}</p>
              </div>
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

              {/* <div className={styles.boxIconSend}>
                <MdFormatListBulletedAdd
                  className={styles.iconSelect}
                  size={23}
                />
              </div> */}
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
