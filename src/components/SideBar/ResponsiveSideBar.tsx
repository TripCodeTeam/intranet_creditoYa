import { useDashboardContext } from "@/context/DashboardContext";
import React from "react";
import { TbMenu2 } from "react-icons/tb";
import styles from "./sidebar.module.css";

import logo from "@/assets/only_object_logo.png";
import Image from "next/image";

interface sideProp {
  openSide: (status: boolean) => void;
}

function ResponsiveSideBar({ openSide }: sideProp) {
  return (
    <>
      <div className={styles.resHeader}>
        <div className={styles.boxIconOpen}>
          <TbMenu2
            className={styles.iconMenu}
            size={25}
            onClick={() => openSide(true)}
          />
        </div>
        <div className={styles.logoSUpraResHeader}>
          <Image className={styles.logo} src={logo} alt="logo" />
        </div>
      </div>
    </>
  );
}

export default ResponsiveSideBar;
