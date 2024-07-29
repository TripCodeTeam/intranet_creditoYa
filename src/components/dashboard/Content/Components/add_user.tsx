"use client";

import React, { useState } from "react";
import Select from "react-select";
import styles from "../styles/addUser.module.css";
import { toast } from "sonner";
import axios from "axios";
import { useGlobalContext } from "@/context/Session";
import { ScalarUser } from "@/types/session";
import { generateSimpleRandomPassword } from "@/handlers/passwordTemp";

const rolOpt = [
  { value: null, label: "Selecciona un rol" },
  { value: "admin", label: "Administrador" },
  { value: "employee", label: "Empleado" },
];

function AddUserIntranet() {
  const [isClearable, setIsClearable] = useState(true);
  const { dataSession } = useGlobalContext();
  const [name, setName] = useState<string | null>(null);
  const [lastNames, setLastNames] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [rol, setRol] = useState<string | null>(null);

  const [loadingCreate, setLoadingCreate] = useState<boolean>(false);

  const handlerCreateUser = async () => {
    try {
      setLoadingCreate(true);
      const errors: string[] = [];
      if (!name) errors.push("Falta el nombre");
      if (!lastNames) errors.push("Falta el apellido");
      if (!email) errors.push("Falta el Correo Electronico");
      if (!rol) errors.push("Selecciona un rol valido");

      if (errors.length > 0) errors.forEach((error) => toast.error(error));

      const response = await axios.post(
        "/api/users/create",
        {
          name,
          lastNames,
          email,
          rol,
        },
        { headers: { Authorization: `Bearer ${dataSession?.token}` } }
      );

      // console.log(response);

      if (response.data.success == true) {
        const data: ScalarUser = response.data.data;

        const completeName = `${data.name} ${data.lastNames}`;

        const noHashPasword = response.data.noHashPass;

        const sendMail = await axios.post(
          "/api/mail/active_account",
          {
            completeName,
            mail: data.email,
            password: noHashPasword,
          },
          { headers: { Authorization: `Bearer ${dataSession?.token}` } }
        );

        console.log(sendMail);

        if (sendMail.data.success == true) {
          toast.success(
            "La activacion de cuenta fue enviada al usuaio al correo"
          );
          setName(null);
          setLastNames(null);
          setEmail(null);
          setLoadingCreate(false);
        }
      } else if (response.data.success == false) {
        toast.error(response.data.error);
        setLoadingCreate(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      <div className={styles.boxInfo}>
        <h3>Nombre</h3>
        <input
          value={(name as string) || ""}
          className={styles.inputInfo}
          type="text"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className={styles.boxInfo}>
        <h3>Apellidos</h3>
        <input
          value={lastNames || ""}
          className={styles.inputInfo}
          type="text"
          onChange={(e) => setLastNames(e.target.value)}
        />
      </div>

      <div className={styles.boxInfo}>
        <h3>Correo Electronico</h3>
        <input
          value={email || ""}
          className={styles.inputInfo}
          type="text"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className={styles.boxInfo}>
        <h3>Rol</h3>
        <Select
          defaultValue={rolOpt[0]}
          isClearable={isClearable}
          onChange={(e) => setRol(e?.value as string)}
          options={rolOpt}
          value={rolOpt.find((option) => option.value === rol) || rolOpt[0]}
        />
      </div>

      <div className={styles.boxBtnCreate}>
        <button onClick={handlerCreateUser}>
          {loadingCreate ? "Creando ..." : "Crear"}
        </button>
      </div>
    </>
  );
}

export default AddUserIntranet;
