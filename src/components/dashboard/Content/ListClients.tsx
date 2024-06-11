"use client";

import { useGlobalContext } from "@/context/Session";
import { scalarClient } from "@/types/session";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CardUser from "./Components/cardUser";
import styles from "./styles/listClients.module.css";
import { TbArrowLeft, TbClock24 } from "react-icons/tb";
import HeaderContent from "./Components/HeaderContent";
import ContainerMail from "@/components/Email/ContainerMail";

function ListClients() {
  const { dataSession } = useGlobalContext();

  // console.log(dataSession)

  const [dataUsers, setDataUsers] = useState<scalarClient[] | null>(null);
  const [option, setOption] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    const getAllUsers = async () => {
      const response = await axios.post(
        "/api/clients/all",
        {},
        { headers: { Authorization: `Bearer ${dataSession?.token}` } }
      );

      // console.log(response.data);
      const data = response.data.data;
      setDataUsers(data);
    };

    getAllUsers();
  }, [dataSession?.token]);

  const handleChangeOption = ({
    option,
    userId,
  }: {
    option: string;
    userId: string;
  }) => {
    setOption(option);
    setClientId(userId);
  };

  const handleSuccessSendEmail = (complete: boolean) => {
    if (complete == true) setOption(null);
  };

  return (
    <>
      <div className={styles.mainContainer}>
        <HeaderContent label="Gestion de usuarios" />

        {option !== null && (
          <div className={styles.btnBack}>
            <div
              className={styles.centerBtnBack}
              onClick={() => setOption(null)}
            >
              <div className={styles.boxIconBtnBack}>
                <TbArrowLeft size={20} />
              </div>
              <p>Atras</p>
            </div>
          </div>
        )}

        {option == null && (
          <div className={styles.containerListUsers}>
            {dataUsers?.map((user) => (
              <CardUser
                changeOption={handleChangeOption}
                user={user}
                token={dataSession?.token as string}
                key={user.id}
              />
            ))}
          </div>
        )}

        {option == "email" && (
          <ContainerMail
            success={handleSuccessSendEmail}
            clientId={clientId}
            token={dataSession?.token as string}
          />
        )}
      </div>
    </>
  );
}

export default ListClients;
