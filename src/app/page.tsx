"use client";

import styles from "./page.module.css";
import React, { FormEvent, useEffect, useState } from "react";
import logoIntranet from "@/assets/only_object_logo.png";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import { ScalarUser, SessionAuth } from "@/types/session";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/Session";

export default function Home() {
  const [validEmail, setValidEmail] = useState<boolean>(false);
  const [loadingSession, setLoadingSession] = useState<boolean>(false);
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [dataAuth, setDataAuth] = useState<ScalarUser | null>();

  const router = useRouter();
  const { dataSession, setDataSession } = useGlobalContext();

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const typeEmail = e.target.value;
    setEmail(typeEmail);

    if (!e.target.value.includes("@")) {
      setValidEmail(true);
    } else {
      setValidEmail(false);
    }
  };

  const handleLogin = async () => {
    if (!email) toast.error("Ingresa tu email");
    if (!password) toast.error("Ingresa tu contraseña");

    const response = await axios.post("/api/users/signin", {
      email,
      password,
    });
    const data: SessionAuth = response.data.data;
    console.log(response);
    setDataSession(data);
    setLoadingSession(true);

    if (response.data.success == true) {
      setInterval(() => {
        router.push("/dashboard");
      }, 3000);
    }
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
                type="password"
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
              <p>Bienvenido {dataSession?.name}</p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
