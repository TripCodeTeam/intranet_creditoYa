"use client";

import { useGlobalContext } from "@/context/Session";
import { ScalarClient } from "@/types/session";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CardUser from "./Components/cardUser";
import styles from "./styles/listClients.module.css";
import { TbArrowLeft, TbArrowRight } from "react-icons/tb";
import HeaderContent from "./Components/HeaderContent";
import ContainerMail from "@/components/Email/ContainerMail";

function ListClients() {
  const { dataSession } = useGlobalContext();

  const [dataUsers, setDataUsers] = useState<ScalarClient[] | null>(null);
  const [option, setOption] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(8);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const getAllUsers = async () => {
      const response = await axios.post(
        "/api/clients/all",
        { page, pageSize },
        { headers: { Authorization: `Bearer ${dataSession?.token}` } }
      );

      const { data, totalCount } = response.data;
      setDataUsers(data);

      // Calculate total pages based on totalCount and pageSize
      const calculatedTotalPages = Math.ceil(totalCount / pageSize);
      setTotalPages(calculatedTotalPages);
    };

    getAllUsers();
  }, [dataSession?.token, page]);

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
    if (complete) setOption(null);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <>
      <div className={styles.mainContainer}>
        <HeaderContent label="Gestión de usuarios" />

        {option !== null && (
          <div className={styles.btnBack}>
            <div
              className={styles.centerBtnBack}
              onClick={() => setOption(null)}
            >
              <div className={styles.boxIconBtnBack}>
                <TbArrowLeft size={20} />
              </div>
              <p>Atrás</p>
            </div>
          </div>
        )}

        {option == null && (
          <div className={styles.containerListUsers}>
            {dataUsers && dataUsers.length > 0 ? (
              dataUsers.map((user) => (
                <CardUser
                  changeOption={handleChangeOption}
                  user={user}
                  token={dataSession?.token as string}
                  key={user.id}
                />
              ))
            ) : (
              <p>Sin Usuarios</p>
            )}
          </div>
        )}

        {option == "email" && (
          <ContainerMail
            success={handleSuccessSendEmail}
            clientId={clientId}
            token={dataSession?.token as string}
          />
        )}

        {/* Controles de paginación */}
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            <div className={styles.centerBtnSkip}>
              <div className={styles.boxIconSkipPage}>
                <TbArrowLeft size={20} />
              </div>
              <p>Anterior</p>
            </div>
          </button>
          {/* <span>{`Página ${page} de ${totalPages}`}</span> */}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            <div className={styles.centerBtnSkip}>
              <p>Siguiente</p>
              <div className={styles.boxIconSkipPage}>
                <TbArrowRight size={20} />
              </div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}

export default ListClients;
