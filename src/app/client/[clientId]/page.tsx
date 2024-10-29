"use client"

import { ScalarClient } from "@/types/session";
import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import Avatar from "react-avatar";
import { toast } from "sonner";
import DateToPretty from "@/handlers/DateToPretty";
import {
  TbArrowBigDown,
  TbBrandMailgun,
  TbBrandWhatsapp,
  TbBuildingSkyscraper,
  TbDeviceLandlinePhone,
  TbHeartBolt,
  TbHistoryToggle,
  TbHomeSearch,
  TbHomeSignal,
  TbMapPin2,
  TbViewportWide,
} from "react-icons/tb";
import Loading from "@/app/dashboard/loading";
import Modal from "@/components/modal/modal";
import InDevelop from "@/components/warns/InDevelop";
import { useGlobalContext } from "@/context/Session";

function PerfilClient({ params }: { params: { clientId: string } }) {
  const [dataUser, setDataUser] = useState<ScalarClient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [docScan, setDocScan] = useState<string | null>(null);
  const { dataSession } = useGlobalContext()

  const [openModelViewDoc, setOpenModelViewDoc] = useState(false);

  const [sectionSelect, setSectionSelect] = useState<string>("info");

  const handlerBanAccount = () => {
    toast.warning("Opcion no disponible por el momento");
  };

  const handlerDownloadDoc = () => {
    if (docScan) {
      // Verifica que la URL sea válida
      const link = document.createElement("a");
      link.href = docScan; // Enlace al PDF
      link.setAttribute("target", "_blank"); // Abre en una nueva pestaña
      link.setAttribute("download", "scan-docs.pdf"); // Nombre del archivo al descargar
      document.body.appendChild(link); // Agrega el enlace al DOM
      link.click(); // Simula el clic para descargar
      document.body.removeChild(link); // Remueve el enlace del DOM
    } else {
      console.log("No hay documento para descargar.");
    }
  };

  useEffect(() => {
    const getDataUser = async () => {
      const response = await axios.post(
        "/api/clients/id",
        {
          userId: params.clientId,
        },
        { headers: { Authorization: `Bearer ${dataSession?.token}` } }
      );

      console.log(response);

      if (response.data.success == true) {
        const data: ScalarClient = response.data.data;
        setDataUser(data);
        setDocScan(data.Document[0].documentSides);
        setLoading(false);
      }

      if (response.data.success == false) {
        setLoading(false);
        toast.error(response.data.error);
      }
    };

    getDataUser();
  }, [params.clientId, dataSession?.token]);

  //   console.log(dataUser);

  return (
    <>
      {loading == true && <Loading />}

      {loading == false && (
        <>
          <div className={styles.userContainer}>
            <div className={styles.subPerfilDetails}>
              <div className={styles.boxAvatarUser}>
                <Avatar
                  src={dataUser?.avatar}
                  round={true}
                  size="160"
                  className={styles.avatar}
                />
              </div>
              <div className={styles.infoUser}>
                <div className={styles.centerInfoUser}>
                  <h1
                    className={styles.NameUser}
                  >{`${dataUser?.names} ${dataUser?.firstLastName} ${dataUser?.secondLastName}`}</h1>
                  <div className={styles.prevDetailsBar}>
                    <div className={styles.boxDateCreate}>
                      <div className={styles.boxIconHistory}>
                        <TbHistoryToggle
                          className={styles.iconMinDetails}
                          size={20}
                        />
                      </div>
                      <p
                        className={styles.dateCreateUser}
                      >{`Cliente desde: ${DateToPretty(
                        String(dataUser?.createdAt),
                        false
                      )}`}</p>
                    </div>

                    <div className={styles.boxDateCreate}>
                      <div className={styles.boxIconHistory}>
                        <TbMapPin2
                          className={styles.iconMinDetails}
                          size={20}
                        />
                      </div>
                      <p className={styles.dateCreateUser}>
                        {dataUser?.city?.toLowerCase()}
                      </p>
                    </div>

                    {dataUser?.currentCompanie !== "no" && (
                      <div className={styles.boxDateCreate}>
                        <div className={styles.boxIconHistory}>
                          <TbBuildingSkyscraper
                            className={styles.iconMinDetails}
                            size={20}
                          />
                        </div>
                        <p className={styles.dateCreateUser}>Valor Agregado</p>
                      </div>
                    )}

                    <div className={styles.boxDateCreate}>
                      <div className={styles.boxIconHistory}>
                        <TbHeartBolt
                          className={styles.iconMinDetails}
                          size={20}
                        />
                      </div>
                      <p className={styles.dateCreateUser}>{dataUser?.genre}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {!dataUser?.isBan && (
              <div className={styles.btnDesactive}>
                <p onClick={handlerBanAccount}>Desactivar cuenta</p>
              </div>
            )}
          </div>

          <div className={styles.optionsContainer}>
            <div className={styles.subOptions}>
              <p
                className={
                  sectionSelect == "info" ? styles.activeOption : styles.option
                }
                onClick={() => setSectionSelect("info")}
              >
                Informacion
              </p>
              <p
                className={
                  sectionSelect == "history"
                    ? styles.activeOption
                    : styles.option
                }
                onClick={() => setSectionSelect("history")}
              >
                Historial
              </p>
            </div>
          </div>

          {sectionSelect == "info" && (
            <>
              <div className={styles.boxInfo}>
                <h1 className={styles.docsTitle}>Documentos de identidad</h1>
                <div className={styles.barDataInfoDocs}>
                  <div className={styles.numberDoc}>
                    <h3>Numero del documento</h3>
                    <p>{dataUser?.Document[0].number}</p>
                  </div>

                  <div className={styles.barOptionsDoc}>
                    <p className={styles.textWarn}>
                      Cedula de ciudadania escaneada
                    </p>
                    <div className={styles.boxOptions}>
                      <div
                        className={styles.onlyOption}
                        onClick={() => handlerDownloadDoc}
                      >
                        <TbArrowBigDown
                          onClick={() => handlerDownloadDoc}
                          className={styles.iconOption}
                        />
                      </div>

                      <div className={styles.onlyOption}>
                        <TbViewportWide
                          onClick={() => setOpenModelViewDoc(true)}
                          className={styles.iconOption}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <h1 className={styles.docsTitleDetail}>Detalles de contacto</h1>

                <div className={styles.barBoxsDetails}>
                  <div className={styles.boxDetail}>
                    <div className={styles.boxIconMail}>
                      <TbBrandMailgun
                        className={styles.iconDetails}
                        size={30}
                      />
                    </div>
                    <div>
                      <h5>Correo electronico</h5>
                      <p>{dataUser?.email}</p>
                    </div>
                  </div>

                  <div className={styles.boxDetail}>
                    <div className={styles.boxIconMail}>
                      <TbDeviceLandlinePhone
                        className={styles.iconDetails}
                        size={30}
                      />
                    </div>
                    <div>
                      <h5>Numero de celular</h5>
                      <p>{dataUser?.phone}</p>
                    </div>
                  </div>

                  <div className={styles.boxDetail}>
                    <div className={styles.boxIconMail}>
                      <TbBrandWhatsapp
                        className={styles.iconDetails}
                        size={30}
                      />
                    </div>
                    <div>
                      <h5>Numero de WhatsApp</h5>
                      <p>{dataUser?.phone_whatsapp}</p>
                    </div>
                  </div>

                  <div className={styles.boxDetail}>
                    <div className={styles.boxIconMail}>
                      <TbHomeSignal className={styles.iconDetails} size={30} />
                    </div>
                    <div>
                      <h5>Numero de residencia</h5>
                      <p>{dataUser?.phone}</p>
                    </div>
                  </div>

                  <div className={styles.boxDetail}>
                    <div className={styles.boxIconMail}>
                      <TbHomeSearch className={styles.iconDetails} size={30} />
                    </div>
                    <div>
                      <h5>Direccion de residencia</h5>
                      <p>{dataUser?.residence_address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {sectionSelect == "history" && (
            <>
            <div style={{ marginTop: "1em" }}>
            <InDevelop
                reason="Historial de solicitudes de prestamo"
                status="Develop"
              />
            </div>
            </>
          )}

          <Modal
            isOpen={openModelViewDoc}
            onClose={() => setOpenModelViewDoc(false)}
            link={docScan}
          >
            <p>Nada que ver aqui</p>
          </Modal>
        </>
      )}
    </>
  );
}

export default PerfilClient;
