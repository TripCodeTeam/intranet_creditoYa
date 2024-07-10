"use client";

import { useDashboardContext } from "@/context/DashboardContext";
import React, { useState } from "react";
import styles from "./sidebar.module.css";
import Image from "next/image";

import logoCreditoYa from "@/assets/only_object_logo.png";

import {
  TbMailPlus,
  TbMoneybag,
  TbUserSearch,
  TbX,
  TbMobiledata,
  TbTool,
} from "react-icons/tb";

import Avatar from "react-avatar";
import { useGlobalContext } from "@/context/Session";
import { OptionDash } from "@/types/session";

function OnlySideOpen({ chageSide }: { chageSide: (status: boolean) => void }) {
  const { option, setOption } = useDashboardContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { dataSession } = useGlobalContext();

  const handleChangeOption = ({ option }: { option: OptionDash }) => {
    // console.log(option);
    setOption(option);
  };

  return (
    <>
      <div className={styles.sideBarSupra}>
        <div className={styles.listOptions}>
          <div className={styles.logoAndBtn}>
            <div className={styles.logoSide}>
              <Image className={styles.logo} src={logoCreditoYa} alt="logo" />
            </div>

            <div className={styles.BtnClose} onClick={() => chageSide(false)}>
              <TbX className={styles.iconMenu} size={20} />
            </div>
          </div>

          <div className={isOpen ? styles.btnOption : styles.btnOptionOpen}>
            <div
              className={
                option == "Request"
                  ? styles.btnOpenOptSelect
                  : styles.btnOpenOpt
              }
              onClick={() => handleChangeOption({ option: "Request" })}
            >
              <div className={styles.subBtnOptionOpen}>
                <TbMobiledata
                  className={
                    option == "Request"
                      ? styles.iconOptionSelect
                      : styles.iconOption
                  }
                  size={18}
                />
              </div>
              <p className={styles.messageBtn}>Solicitudes</p>
            </div>

            <div
              className={
                option == "Accepts"
                  ? styles.btnOpenOptSelect
                  : styles.btnOpenOpt
              }
              onClick={() => handleChangeOption({ option: "Accepts" })}
            >
              <div className={styles.subBtnOptionOpen}>
                <TbMoneybag
                  className={
                    option == "Accepts"
                      ? styles.iconOptionSelect
                      : styles.iconOption
                  }
                  size={18}
                />
              </div>
              <p className={styles.messageBtn}>Prestamos</p>
            </div>

            <div
              className={
                option == "Clients"
                  ? styles.btnOpenOptSelect
                  : styles.btnOpenOpt
              }
              onClick={() => handleChangeOption({ option: "Clients" })}
            >
              <div className={styles.subBtnOptionOpen}>
                <TbUserSearch
                  className={
                    option == "Clients"
                      ? styles.iconOptionSelect
                      : styles.iconOption
                  }
                  size={18}
                />
              </div>
              <p className={styles.messageBtn}>Clientes</p>
            </div>

            <div
              className={
                option == "Emails" ? styles.btnOpenOptSelect : styles.btnOpenOpt
              }
              onClick={() => handleChangeOption({ option: "Emails" })}
            >
              <div className={styles.subBtnOptionOpen}>
                <TbTool
                  className={
                    option == "Emails"
                      ? styles.iconOptionSelect
                      : styles.iconOption
                  }
                  size={18}
                />
              </div>
              <p className={styles.messageBtn}>Herramientas</p>
            </div>
          </div>
        </div>

        <div className={styles.boxUser}>
          {!isOpen && (
            <>
              <div
                className={styles.btnOpenOpt}
                onClick={() => handleChangeOption({ option: "User" })}
              >
                <div className={styles.subBtnOptionOpen}>
                  <Avatar
                    src={dataSession?.avatar}
                    className={styles.avatarUser}
                    size="25px"
                    round={true}
                  />
                </div>
                <div className={styles.detailUser}>
                  <div className={styles.centerDetailUser}>
                    <p className={styles.messageBtn}>
                      {dataSession?.name} {dataSession?.lastNames.split(" ")[0]}
                    </p>
                    <p className={styles.rolUser}>Empleado</p>
                  </div>
                </div>
                {/* <div className={styles.threePoints}>
                  <TbLineDashed className={styles.iconThreePoint} size={20} />
                </div> */}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default OnlySideOpen;
