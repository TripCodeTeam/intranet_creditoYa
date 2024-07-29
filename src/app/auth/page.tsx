"use client";

import React, { useState } from "react";
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

  const { dataSession } = useGlobalContext();
  // console.log(dataSession);
  const router = useRouter();

  const handleVerifyAccount = async () => {
    setVerify(true);
    try {
      if (newPassword == null || newPassword.length == 0)
        throw new Error("Ingresa una contraseña valida");

      const response = await axios.post(
        "/api/users/verify/active",
        {
          userId: dataSession?.id,
          newPassword,
        },
        { headers: { Authorization: `Bearer ${dataSession?.token}` } }
      );

      console.log(response);

      if (response.data.success == true) {
        setIsVerify(true);
        Cookies.remove("SessionData");
        router.push("/");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      <div className={styles.containerCenterActive}>
        {!verify && (
          <div className={styles.centerActive}>
            <h3>Activacion de cuenta</h3>
            <input
              type="text"
              placeholder="Ingresa tu contraseña"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div className={styles.boxBtnActive}>
              <button onClick={handleVerifyAccount}>Verificar</button>
            </div>
          </div>
        )}

        {verify && (
          <>
            <div>{!isVerify ? <TbLoader /> : <TbRosetteDiscountCheck />}</div>
            <p>
              {!isVerify
                ? "Verificando tu cuenta"
                : "Tu cuenta ha sido verificada"}
            </p>
          </>
        )}
      </div>
    </>
  );
}

export default AuthActiveAccount;
