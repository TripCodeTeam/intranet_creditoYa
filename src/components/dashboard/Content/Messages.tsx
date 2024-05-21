import React from "react";
import styles from "./styles/messages.module.css"
import HeaderContent from "./Components/HeaderContent";

function MessagesContent() {
  return (
    <>
      <div className={styles.mainMessages}>
        <HeaderContent label={"Atencion al cliente"} />
      </div>
    </>
  );
}

export default MessagesContent;
