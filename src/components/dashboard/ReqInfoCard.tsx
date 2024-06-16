import React from "react";
import styles from "../../app/req/[loanId]/page.module.css";
import { TbPencil } from "react-icons/tb";

function CardInfo({
  label,
  text,
  money,
  datetime,
}: {
  label: string;
  text: string | undefined;
  money: boolean;
  datetime: boolean;
}) {
  const number = parseFloat(text as string);
  const date = new Date(text as string);

  const formatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const datter = new Intl.DateTimeFormat("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  const formattedNumber = formatter.format(number);
  const formattedDate = isNaN(date.getTime())
    ? "Fecha no valida"
    : datter.format(date);

  return (
    <>
      <div className={styles.cardInfo}>
        <div className={styles.boxTexts}>
          <h5>{label}</h5>
          {money == false && datetime == false && <p>{text}</p>}
          {money == true && datetime == false && <p>{formattedNumber}</p>}
          {datetime == true && money == false && <p>{formattedDate}</p>}
        </div>
        <div className={styles.barAction}>
          <div className={styles.boxIconAction}>
            <TbPencil className={styles.iconPensil} size={20} />
          </div>
        </div>
      </div>
    </>
  );
}

export default CardInfo;
