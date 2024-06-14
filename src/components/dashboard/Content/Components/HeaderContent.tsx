import React, { useEffect, useState, useMemo } from "react";
import styles from "../styles/Request.module.css";
import { TbClock24 } from "react-icons/tb";

function HeaderContent({ label }: { label: string }) {
  const [date, setDate] = useState<Date>(new Date());
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formattedDate, setFormattedDate] = useState("");

  // useEffect(() => {
  //   const updateFormattedDate = (now: Date) => {
  //     setFormattedDate(
  //       `${now.toLocaleDateString("es-ES", {
  //         weekday: "long",
  //         month: "long",
  //         day: "numeric",
  //         year: "numeric",
  //       })}, ${now.toLocaleTimeString("es-ES", {
  //         hour: "2-digit",
  //         minute: "2-digit",
  //         second: "2-digit",
  //       })}`
  //     );
  //   };

  //   const timer = setInterval(() => {
  //     const now = new Date();
  //     setDate(now);

  //     const day = now.getDay();
  //     const hour = now.getHours();

  //     // De lunes a viernes de 6am a 6pm
  //     if (day >= 1 && day <= 5 && hour >= 6 && hour < 18) {
  //       setIsOpen(true);
  //     }
  //     // Los sábados de 6am a 12pm
  //     else if (day === 6 && hour >= 6 && hour < 12) {
  //       setIsOpen(true);
  //     } else {
  //       setIsOpen(false);
  //     }

  //     updateFormattedDate(now);
  //   }, 1000);

  //   const initialDate = new Date();
  //   updateFormattedDate(initialDate);

  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);

  return (
    <div className={styles.headerReq}>
      <h1>{label}</h1>
      {/* <p>{isOpen ? "Abierto" : "Cerrado"}</p> */}
      {/* <div className={styles.textDate}>
        <div className={styles.boxIconTime}>
          <TbClock24 className={styles.iconClock} size={30} />
        </div>
        <div className={styles.boxtextClock}>
          <span className={styles.titleDate}>Fecha y hora actual: </span>
          {formattedDate}
        </div>
      </div> */}
    </div>
  );
}

export default HeaderContent;
