import React from "react";
import styles from "./styles/setting.module.css"
import HeaderContent from "./Components/HeaderContent";

function SettingsContent() {
  return (
    <>
      <div className={styles.mainSetting}>
        <HeaderContent label={"Prefencias"} />
      </div>
    </>
  );
}

export default SettingsContent;
