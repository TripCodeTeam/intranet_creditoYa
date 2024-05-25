"use client";

import { useGlobalContext } from "@/context/Session";
import { scalarClient } from "@/types/session";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CardUser from "./Components/cardUser";
import styles from "./styles/listClients.module.css";
import { TbClock24 } from "react-icons/tb";
import HeaderContent from "./Components/HeaderContent";

function ListClients() {
  const { dataSession } = useGlobalContext();

  // console.log(dataSession)

  const [dataUsers, setDataUsers] = useState<scalarClient[] | null>(null);

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

  return (
    <>
      <div className={styles.mainContainer}>
        <HeaderContent label="Gestion de usuarios" />

        <div className={styles.containerListUsers}>
          {dataUsers?.map((user) => (
            <CardUser
              user={user}
              token={dataSession?.token as string}
              key={user.id}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default ListClients;
