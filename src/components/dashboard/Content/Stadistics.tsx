import React from "react";
import HeaderContent from "./Components/HeaderContent";
import styles from "./styles/stadistics.module.css"

function StadisticsComponent() {
  return (
    <>
      <div className={styles.mainStats}>
        <HeaderContent label={"Estadisticas de prestamos"} />
      </div>
    </>
  );
}

export default StadisticsComponent;
