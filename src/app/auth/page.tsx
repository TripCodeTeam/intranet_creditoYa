"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { TbLoader, TbRosetteDiscountCheck } from "react-icons/tb";
import axios from "axios";
import { toast } from "sonner";
import { useGlobalContext } from "@/context/Session";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

function AuthActiveAccount() {
  const [verify, setVerify] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const [isVerify, setIsVerify] = useState<boolean>(false);

  const router = useRouter();

  const { dataSession } = useGlobalContext();

  useEffect(() => {
    if (isVerify) {
      setInterval(() => {
        window.location.href = "/";
      }, 2000);
    }
  }, [isVerify, router]);

  const handleVerifyAccount = async () => {
    setVerify(true);
    try {
      if (newPassword == null || newPassword.length == 0) {
        throw new Error("Ingresa una contraseña valida");
      }

      const response = await axios.post(
        "/api/users/verify/active",
        {
          userId: dataSession?.id,
          newPassword,
        },
        { headers: { Authorization: `Bearer ${dataSession?.token}` } }
      );

      if (response.data.success === true) {
        Cookies.remove("SessionData");
        toast.success("Tu cuenta fue activada");
        setIsVerify(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className={styles.containerCenterActive}>
      {!verify && (
        <div className={styles.centerActive}>
          <h3>Activacion de cuenta</h3>
          <input
            type="password"
            placeholder="Ingresa tu nueva contraseña"
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <div className={styles.boxBtnActive}>
            <button onClick={handleVerifyAccount}>Verificar</button>
          </div>
        </div>
      )}

      {verify && (
        <>
          <div className={styles.VerifyBanner}>
            <div className={styles.boxIconLoan}>
              {!isVerify ? (
                <TbLoader className={styles.iconLoader} size={20} />
              ) : (
                <TbRosetteDiscountCheck className={styles.iconChecks} />
              )}
            </div>
            <p>
              {!isVerify
                ? "Verificando tu cuenta"
                : "Tu cuenta ha sido verificada"}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default AuthActiveAccount;
