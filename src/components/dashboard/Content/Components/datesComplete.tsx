import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "../styles/datesComplete.module.css";

interface infoPreview {
  total: number;
  completed: number;
  paid: number;
  pending: number;
}

function DatesComplete({ userId, token }: { userId: string; token: string }) {
  const [infoUser, setInfoUser] = useState<infoPreview | null>(null);
  useEffect(() => {
    const VerifyCompleteDates = async () => {
      const response = await axios.post(
        "/api/users/verify/previnfo",
        { userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data: infoPreview = response.data.data;

      // console.log(data.total);

      if (response.data.success == true) {
        setInfoUser(data);
      }
    };

    VerifyCompleteDates();
  }, [userId, token]);

  return (
    <>
      <div className={styles.centerInfoUser}>
        <h5 className={styles.cubeInfo}>
          Prestaciones Activas:
          <span className={styles.numberCantity}>{infoUser?.completed}</span>
        </h5>
        <h5 className={styles.cubeInfo}>
          Prestaciones Pendientes:
          <span className={styles.numberCantity}>{infoUser?.pending}</span>
        </h5>
        <h5 className={styles.cubeInfo}>
          Total Prestaciones:
          <span className={styles.numberCantity}>{infoUser?.total}</span>
        </h5>
      </div>
    </>
  );
}

export default DatesComplete;
