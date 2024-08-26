"use client";

import styles from "./page.module.css";
import React, { FormEvent, useEffect, useState } from "react";
import logoIntranet from "@/assets/only_object_logo.png";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import { ScalarUser, SessionAuth } from "@/types/session";
import { urlBase64ToUint8Array } from "@/handlers/Base64";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/Session";
import Loading from "./dashboard/loading";

const applicationServerKey = process.env.NEXT_PUBLIC_VAPID_KEY as string;

export default function Home() {
  const [validEmail, setValidEmail] = useState<boolean>(false);
  const [loadingSession, setLoadingSession] = useState<boolean>(false);
  const [missingSession, setMissingSession] = useState<boolean>(false);
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  const router = useRouter();
  const { dataSession, setDataSession } = useGlobalContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [subscription, setSubscription] = useState({} as PushSubscription);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then((registration) =>
        registration.pushManager
          .subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(applicationServerKey),
          })
          .then(async (subscription) => {
            // console.log(subscription);
            setSubscription(subscription);
          })
      );
    }
  }, []);

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const typeEmail = e.target.value;
    setEmail(typeEmail);

    if (!e.target.value.includes("@")) {
      setValidEmail(true);
    } else {
      setValidEmail(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    setMissingSession(true);

    if (!email) toast.error("Ingresa tu email");
    if (!password) toast.error("Ingresa tu contraseña");

    const response = await axios.post("/api/users/signin", {
      email,
      password,
    });

    const data: SessionAuth = response.data.data;
    console.log(response);

    if (response.data.success == false) {
      toast.error(response.data.error);
    }

    if (response.data.success) {
      if (data.isActive == true) {
        setMissingSession(false);
        setDataSession(data);
        toast.success(`Bienvenido de nuevo ${data.name}`);
        setLoadingSession(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else if (data.isActive == false) {
        setMissingSession(false);
        setDataSession(data);
        toast.warning("Activación pendiente");
        setLoadingSession(true);
        setTimeout(() => {
          router.push("/auth");
        }, 2000);
      }
    }
  };

  useEffect(() => {
    if (!dataSession) {
      setIsLoading(false);
    }

    if (dataSession && dataSession.isActive !== false) {
      router.push("/dashboard");
    }
  }, [dataSession, router]);

  if (isLoading) <Loading />;

  if (!isLoading && !dataSession)
    return (
      <main className={styles.containerInit}>
        <form
          className={
            !loadingSession ? styles.centerBox : styles.centerBoxLoading
          }
          onSubmit={handleLogin}
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
                <button
                  type="submit"
                  className={styles.btnSend}
                  onClick={handleLogin}
                >
                  Ingresar
                </button>
              </div>

              {missingSession && (
                <p className={styles.loadingText}>Ingresando ...</p>
              )}
            </>
          )}
        </form>
      </main>
    );
}
