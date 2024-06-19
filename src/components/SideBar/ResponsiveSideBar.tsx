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
  const { option, setOption } = useDashboardContext();
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
        {option == "Request" && <p>Solicitudes</p>}
        {option == "Accepts" && <p>Prestamos</p>}
        {option == "Clients" && <p>Clientes</p>}
      </div>
    </>
  );
}

export default ResponsiveSideBar;
