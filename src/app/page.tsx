"use client";

import styles from "./page.module.css";
import React, { FormEvent, useEffect, useState } from "react";
import socket from "@/Socket";
import logoIntranet from "@/assets/only_object_logo.png";
import Image from "next/image";
import axios from "axios";

export default function Home() {
  const [validEmail, setValidEmail] = useState<boolean>(false);
  const [loadingSession, setLoadingSession] = useState<boolean>(false);
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const typeEmail = e.target.value;
    setEmail(typeEmail);

    if (!e.target.value.includes("@")) {
      setValidEmail(true);
    } else {
      setValidEmail(false);
    }
  };

  const handleLogin = () => {
    setLoadingSession(true);
    if (!email && !password) throw new Error("Credenciales incompletas");

    // const response = axios.post("/api")
  };

  return (
    <main className={styles.containerInit}>
      <div
        className={!loadingSession ? styles.centerBox : styles.centerBoxLoading}
      >
        {!loadingSession && (
          <>
            <div className={styles.boxImage}>
              <Image
                className={styles.logoIntranet}
                src={logoIntranet}
                alt="logo"
                width={70}
              />
            </div>
            <div className={styles.boxInputs}>
              <input
                className={styles.onlyInput}
                onChange={handleChangeEmail}
                type="email"
                placeholder="Correo Electronico"
              />
              <input
                className={styles.onlyInput}
                onChange={(e) => setPassword(e.target.value)}
                type="text"
                placeholder="Contraseña"
              />
            </div>
            <div className={styles.boxBtnSend}>
              <p className={styles.btnSend} onClick={handleLogin}>
                Ingresar
              </p>
            </div>
          </>
        )}

        {loadingSession && (
          <>
            <div className={styles.listMessages}>
              <p>Ingresando...</p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
