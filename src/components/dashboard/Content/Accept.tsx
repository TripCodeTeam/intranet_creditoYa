"use client";

import React, { useEffect, useState } from "react";
import styles from "./styles/accept.module.css";
import HeaderContent from "./Components/HeaderContent";
import { ScalarLoanApplication } from "@/types/session";
import axios from "axios";
import { useGlobalContext } from "@/context/Session";
import Loading from "@/app/dashboard/loading";
import LoansList from "./Components/listCardsLoans"; // Asegúrate de ajustar la ruta según la ubicación real del archivo
import InDevelop from "@/components/warns/InDevelop";

function AcceptContent() {
  const [liveLoans, setLiveLoans] = useState<ScalarLoanApplication[] | null>(
    null
  );
  const [status, setStatus] = useState<string>("Aprobado");
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [documentNumber, setDocumentNumber] = useState<string>("");
  const { dataSession } = useGlobalContext();

  useEffect(() => {
    const getLoans = async () => {
      setLoading(true);
      try {
        // Determinar la URL de la API en función del estado
        let url;
        switch (status) {
          case "Aprobado":
            url = "/api/loans/approved"; // Ajusta la ruta según tu API
            break;
          case "Aplazado":
            url = "/api/loans/deferred"; // Ajusta la ruta según tu API
            break;
          case "Cantity":
            url = "/api/loans/cantity"; // Ajusta la ruta según tu API
            break;
          default:
            throw new Error("Estado desconocido");
        }

        // Obtener las solicitudes del estado seleccionado con paginación
        const response = await axios.post(
          url,
          { page, pageSize: 5, documentNumber }, // Paginación: página actual, 5 solicitudes por página
          { headers: { Authorization: `Bearer ${dataSession?.token}` } }
        );

        // console.log(response.data);

        const { data, totalCount } = response.data; // Suponiendo que el total se devuelve en la respuesta
        setLiveLoans(data);
        setTotal(totalCount); // Asignar el total de solicitudes
      } catch (error) {
        console.error("Error al obtener las solicitudes de préstamos:", error);
      } finally {
        setLoading(false);
      }
    };

    getLoans();
  }, [status, page, dataSession?.token]);

  const handleChangeStatus = (status: string) => {
    setStatus(status);
    setPage(1); // Reiniciar la página a 1 cuando cambie el estado
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentNumber(e.target.value); // Actualizar el número de documento con el input
  };

  return (
    <div className={styles.mainActives}>
      <HeaderContent label={"Prestaciones activas"} />
      {loading && <Loading />}

      <InDevelop
        reason="Creando sistema avanzado de filtrado de solicitudes de prestamo"
        status="Develop"
      />

      {!loading && (
        <>
          <div className={styles.barTypeLoan}>
            <p
              className={
                status === "Aprobado"
                  ? styles.btnAproveActive
                  : styles.btnAprove
              }
              onClick={() => handleChangeStatus("Aprobado")}
            >
              Aprobados
            </p>

            <p
              className={
                status === "Aplazado"
                  ? styles.btnRejectActive
                  : styles.btnReject
              }
              onClick={() => handleChangeStatus("Aplazado")}
            >
              Aplazados
            </p>

            <p
              className={
                status === "Cantity"
                  ? styles.btnCantityActive
                  : styles.btnCantity
              }
              onClick={() => handleChangeStatus("Cantity")}
            >
              Cambio de Cantidad
            </p>
          </div>

          <div className={styles.searchBar}>
            <input
              type="search"
              onChange={handleSearch}
              placeholder="Ingresa el numero de cedula"
            />
          </div>

          {liveLoans && liveLoans.length > 0 ? (
            <LoansList
              status={status}
              pendingLoans={liveLoans}
              token={dataSession?.token as string}
              page={page}
              setPage={setPage}
              total={total}
            />
          ) : (
            // Si no hay préstamos, mostrar el mensaje de error
            <div className={styles.noLoans}>
              No existen solicitudes con este documento
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AcceptContent;
