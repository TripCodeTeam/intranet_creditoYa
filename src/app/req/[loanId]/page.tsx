"use client";

import { useGlobalContext } from "@/context/Session";
import {
  ScalarClient,
  ScalarDocument,
  ScalarLoanApplication,
  Status,
} from "@/types/session";
import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { TbArrowLeft, TbPdf } from "react-icons/tb";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { useWebSocket } from "next-ws/client";
import Modal from "@/components/modal/modal";

function RequestPreview({ params }: { params: { loanId: string } }) {
  const { dataSession } = useGlobalContext();
  const router = useRouter();

  const [dataLoan, setDataLoan] = useState<ScalarLoanApplication | null>(null);
  const [dataDocument, setDataDocument] = useState<ScalarDocument | null>(null);
  const [dataClient, setDataClient] = useState<ScalarClient | null>(null);
  const [openModel, setOpenModel] = useState<boolean>(false);

  const [openReject, setOpenReject] = useState<boolean>(false);
  const [isReject, setIsReject] = useState<string | null>(null);

  const ws = useWebSocket();

  useEffect(() => {
    const getLoanInfo = async () => {
      const response = await axios.post(
        "/api/loans/by/id",
        {
          loanId: params.loanId,
        },
        { headers: { Authorization: `Bearer ${dataSession?.token}` } }
      );

      console.log(response);

      if (response.data.success === true) {
        setDataLoan(response.data.data);

        const data: ScalarLoanApplication = response.data.data;

        const responseDocs = await axios.post(
          "/api/clients/docs/id",
          {
            userId: data.userId,
          },
          { headers: { Authorization: `Bearer ${dataSession?.token}` } }
        );

        console.log(responseDocs);

        if (responseDocs.data.success === true) {
          const dataDocs = responseDocs.data.data;
          setDataDocument(dataDocs);

          const responseClient = await axios.post(
            "/api/clients/id",
            {
              userId: response.data.data.userId,
            },
            { headers: { Authorization: `Bearer ${dataSession?.token}` } }
          );

          if (responseClient.data.success == true) {
            const data: ScalarClient = responseClient.data.data;
            console.log(data);
            setDataClient(data);
          }
        }
      }
    };

    getLoanInfo();
  }, [dataSession?.token, params.loanId]);

  console.log(dataClient);

  const onDes = async ({ newStatus }: { newStatus: Status }) => {
    setOpenReject(false);
    const loanApplicationId = dataLoan?.id as string;
    const employeeId = dataSession?.id as string;
    const reason = isReject;

    const response = await axios.post(
      "/api/loans/status",
      {
        newStatus,
        employeeId,
        loanApplicationId,
        reason,
      },
      { headers: { Authorization: `Bearer ${dataSession?.token}` } }
    );

    console.log(response.data);

    if (response.data.success == true) {
      const data: ScalarLoanApplication = response.data.data;

      const responseReload = await axios.post(
        "/api/loans/by/id",
        {
          loanId: params.loanId,
        },
        { headers: { Authorization: `Bearer ${dataSession?.token}` } }
      );

      if (responseReload.data.success == true) {
        const dataReload: ScalarLoanApplication = responseReload.data.data;
        setDataLoan(dataReload);

        ws?.send(
          JSON.stringify({
            type: "newApprove",
            owner: dataLoan?.userId,
            from: employeeId,
          })
        );

        if (data && reason == null) toast.success("Solicitud aprobada");
        if (data && reason !== null) toast.success("Solicitud rechazado");
      }
    }
  };

  const handleCloseModalReject = () => {
    setOpenReject(!openReject);
  };

  const handleCloseModal = () => {
    setOpenModel(!openModel);
  };

  return (
    <>
      <main className={styles.mainLoan}>
        <div className={styles.barBack}>
          <div
            className={styles.centerBarBack}
            onClick={() => router.push("/dashboard")}
          >
            <div className={styles.boxIcon}>
              <TbArrowLeft size={20} className={styles.iconArrow} />
            </div>
            <p className={styles.labelBtn}>Volver</p>
          </div>
        </div>

        <div className={styles.boxTitleLoan}>
          <div className={styles.centerBoxTitleLoan}>
            <h1>Detalles del prestamo</h1>
            <p>Solicitud: {dataLoan?.id}</p>
          </div>

          {dataLoan?.status === "Pendiente" && (
            <div className={styles.listBtns}>
              <p
                className={styles.btnAprove}
                onClick={() => onDes({ newStatus: "Aprobado" })}
              >
                Aprobar
              </p>
              <p
                className={styles.btnReject}
                onClick={() => setOpenReject(true)}
              >
                Rechazar
              </p>
            </div>
          )}
        </div>

        <h3 className={styles.titleDocs}>Informacion del solicitante</h3>
        <div className={styles.prevInfoClient}>
          <div className={styles.infoClient}>
            <h5 className={styles.subTitleClient}>Nombre completo</h5>
            <h3>{`${dataClient?.names} ${dataClient?.firstLastName} ${dataClient?.secondLastName}`}</h3>
          </div>

          <div className={styles.infoClient}>
            <h5 className={styles.subTitleClient}>Email</h5>
            <h3>{dataClient?.email}</h3>
          </div>

          <div className={styles.infoClient}>
            <h5 className={styles.subTitleClient}>Numero celular</h5>
            <h3>{dataClient?.phone}</h3>
          </div>

          <div className={styles.infoClient}>
            <h5 className={styles.subTitleClient}>Whatsapp</h5>
            <h3>{dataClient?.phone_whatsapp}</h3>
          </div>
        </div>

        <h3 className={styles.titleDocs}>Documentos Obligatorios</h3>
        <div className={styles.barDocs}>
          <div className={styles.docBox}>
            <div className={styles.barIconPdf}>
              <TbPdf size={30} />
            </div>
            <div className={styles.actionDocBox}>
              <p>Primer Volante</p>
              <button>Ver</button>
            </div>
          </div>

          <div className={styles.docBox}>
            <div className={styles.barIconPdf}>
              <TbPdf size={30} />
            </div>
            <div className={styles.actionDocBox}>
              <p>Segundo Volante</p>
              <button>Ver</button>
            </div>
          </div>

          <div className={styles.docBox}>
            <div className={styles.barIconPdf}>
              <TbPdf size={30} />
            </div>
            <div className={styles.actionDocBox}>
              <p>Tercer Volante</p>
              <button>Ver</button>
            </div>
          </div>

          <div className={styles.docBox}>
            <div className={styles.barIconPdf}>
              <TbPdf size={30} />
            </div>
            <div className={styles.actionDocBox}>
              <p>Carta Laboral</p>
              <button>Ver</button>
            </div>
          </div>
        </div>

        <h3 className={styles.titleDocs}>Otros Documentos</h3>
        <div className={styles.barDocs}>
          <div className={styles.docBox}>
            <div className={styles.barIconPdf}>
              <TbPdf size={30} />
            </div>
            <div className={styles.actionDocBox}>
              <p>Primer Volante</p>
              <button>Ver</button>
            </div>
          </div>

          <div className={styles.docBox}>
            <div className={styles.barIconPdf}>
              <TbPdf size={30} />
            </div>
            <div className={styles.actionDocBox}>
              <p>Segundo Volante</p>
              <button>Ver</button>
            </div>
          </div>

          <div className={styles.docBox}>
            <div className={styles.barIconPdf}>
              <TbPdf size={30} />
            </div>
            <div className={styles.actionDocBox}>
              <p>Tercer Volante</p>
              <button>Ver</button>
            </div>
          </div>

          <div className={styles.docBox}>
            <div className={styles.barIconPdf}>
              <TbPdf size={30} />
            </div>
            <div className={styles.actionDocBox}>
              <p>Carta Laboral</p>
              <button>Ver</button>
            </div>
          </div>
        </div>

        <div className={styles.documentsBox}>
          <div className={styles.boxImageDoc}>
            <h3>Documento lado frontal</h3>
            <div className={styles.centerBoxImage}>
              <Image
                width={300}
                height={400}
                src={`${dataDocument?.documentFront as string}`}
                alt="frontDoc"
                className={styles.imgDoc}
              />
            </div>
          </div>

          <div className={styles.boxImageDoc}>
            <h3>Documento lado trasero</h3>
            <div className={styles.centerBoxImage}>
              <Image
                src={dataDocument?.documentBack as string}
                className={styles.imgDoc}
                width={300}
                height={400}
                alt="frontDoc"
              />
            </div>
          </div>
        </div>
      </main>

      <Modal isOpen={openModel} onClose={handleCloseModal}>
        <p></p>
      </Modal>

      <Modal isOpen={openReject} onClose={handleCloseModalReject}>
        <div className={styles.intraRejectModal}>
          <h3>Razon</h3>
          <p>Escribe una razon clara</p>
          <textarea
            className={styles.rejectTextArea}
            onChange={(e) => setIsReject(e.target.value)}
          ></textarea>
          <div>
            <button className={styles.btnRejectReady} onClick={() => onDes({ newStatus: "Rechazado" })}>
              Listo
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default RequestPreview;
