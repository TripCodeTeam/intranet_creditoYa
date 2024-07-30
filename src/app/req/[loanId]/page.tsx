"use client";

import { useGlobalContext } from "@/context/Session";
import {
  ScalarClient,
  ScalarDocument,
  ScalarLoanApplication,
  ScalarUser,
  Status,
} from "@/types/session";
import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { TbArrowLeft, TbPdf, TbPencilCog } from "react-icons/tb";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { useWebSocket } from "next-ws/client";
import Modal from "@/components/modal/modal";
import Loading from "@/app/dashboard/loading";
import Document00 from "@/components/pdfs/pdfCard00";
import Document03 from "@/components/pdfs/pdfCard02";
import { stringToPriceCOP } from "@/handlers/stringToPriceCOP";

import CurrencyInput from "react-currency-input-field";
import { Document01 } from "@/components/pdfs/pdfCard01";
import Document02 from "@/components/pdfs/pdfCard02";
import { RefreshDataLoan } from "@/handlers/requests/allDataLoan";

function RequestPreview({ params }: { params: { loanId: string } }) {
  const { dataSession } = useGlobalContext();
  const router = useRouter();

  const [dataLoan, setDataLoan] = useState<ScalarLoanApplication | null>(null);
  const [dataDocument, setDataDocument] = useState<ScalarDocument | null>(null);
  const [dataClient, setDataClient] = useState<ScalarClient | null>(null);
  const [dataIntra, setDataIntra] = useState<ScalarUser | null>(null);
  const [openModel, setOpenModel] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [openReject, setOpenReject] = useState<boolean>(false);
  const [isReject, setIsReject] = useState<string | null>(null);
  const [linkSelect, setLinkSelect] = useState<number | null>(null);
  const [openModelChange, setOpenModelChange] = useState<boolean>(false);

  const [newValue, setNewValue] = useState<string | null>(null);
  const [reasonNewCantity, setReasonNewCantity] = useState<string | null>(null);

  const handleOpenViewPdf = (option: number) => {
    setOpenModel(true);
    setLinkSelect(option);
  };

  const handleSuccesChangeCantity = async () => {
    try {
      if (!newValue) throw new Error("Digita el valor a cambiar");
      if (!reasonNewCantity) throw new Error("Digita la razon del cambio");

      const response = await axios.post(
        "/api/loans/change_cantity",
        {
          loanId: dataLoan?.id,
          newCantity: newValue,
          reasonChangeCantity: reasonNewCantity,
          employeeId: dataIntra?.id,
        },
        { headers: { Authorization: `Bearer ${dataSession?.token}` } }
      );

      console.log(response.data);

      if (response.data.success == true) {
        const data: ScalarLoanApplication = response.data.data;

        const sendMail = await axios.post("/api/mail/change_cantity", {
          completeName: `${dataClient?.firstLastName} ${dataClient?.secondLastName}`,
          loanId: data.id,
          mail: dataClient?.email,
        });

        if (sendMail.data.success == true) {
          setDataLoan(data);
          const updataDataLoan = await RefreshDataLoan(
            dataLoan?.id as string,
            dataSession?.token as string
          );
          setDataLoan(updataDataLoan);
          toast.success("Cantidad Cambiada");
          setOpenModelChange(false);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

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

      // console.log(response);

      if (response.data.success === true) {
        setDataLoan(response.data.data);

        const dataLoan: ScalarLoanApplication = response.data.data;

        const responseDocs = await axios.post(
          "/api/clients/docs/id",
          {
            userId: dataLoan.userId,
          },
          { headers: { Authorization: `Bearer ${dataSession?.token}` } }
        );

        // console.log(responseDocs);

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
            // console.log(data);
            setDataClient(data);
            setLoadingData(false);

            const dataIntranet = await axios.post(
              "/api/users/id",
              {
                employeeId: dataLoan.employeeId,
              },
              { headers: { Authorization: `Bearer ${dataSession?.token}` } }
            );

            console.log(dataIntranet);

            if (dataIntranet.data.success == true) {
              const dataUserInt: ScalarUser = dataIntranet.data.data;
              setDataIntra(dataUserInt);
            }
          }
        }
      }
    };

    getLoanInfo();
  }, [dataSession?.token, params.loanId]);

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

    // console.log(response.data);

    if (
      response.data.success == true &&
      dataIntra?.name !== undefined &&
      dataIntra.lastNames !== undefined
    ) {
      const sendMail = await axios.post(
        "/api/mail/change_status",
        {
          newStatus,
          employeeName: `${dataIntra?.name} ${dataIntra?.lastNames}`,
          loanId: loanApplicationId,
          mail: dataClient?.email,
        },
        { headers: { Authorization: `Bearer ${dataSession?.token}` } }
      );

      console.log(sendMail.data);

      if (sendMail.data.success) {
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
    }
  };

  const handleCloseModalReject = () => {
    setOpenReject(!openReject);
  };

  const handleCloseModal = () => {
    setOpenModel(!openModel);
  };

  const handleChangeCantity = () => {
    setOpenModelChange(!openModelChange);
  };

  if (loadingData) {
    return <Loading />;
  }

  if (!loadingData) {
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

            {dataLoan?.status === "Pendiente" &&
              !dataLoan.newCantity &&
              !dataLoan.newCantityOpt && (
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

          <h3 className={styles.titleDocs}>Cantidad Solicitada</h3>
          <div className={styles.prevInfoClient}>
            <div className={styles.boxCantity}>
              <h1>{stringToPriceCOP(dataLoan?.cantity as string)}</h1>
              {dataLoan?.status == "Pendiente" &&
                dataLoan?.newCantity == null && (
                  <div
                    className={styles.btnChangeCantity}
                    onClick={handleChangeCantity}
                  >
                    <div className={styles.boxIConPencil}>
                      <TbPencilCog size={20} className={styles.iconPensil} />
                    </div>
                    <p>Editar Cantidad</p>
                  </div>
                )}
            </div>
          </div>

          {dataLoan?.status == "Pendiente" && dataLoan?.newCantity && (
            <>
              <h3 className={styles.titleDocs}>Cantidad Aceptada</h3>
              <div className={styles.prevInfoClient}>
                <div className={styles.boxCantity}>
                  <h1>{stringToPriceCOP(dataLoan?.newCantity as string)}</h1>
                </div>
              </div>
            </>
          )}

          {dataLoan?.newCantityOpt !== null && (
            <>
              <h3 className={styles.titleDocs}>Desicion del cliente</h3>
              <div className={styles.prevInfoClient}>
                <div className={styles.boxCantity}>
                  <p>
                    {dataLoan?.newCantity && dataLoan.newCantityOpt == true
                      ? "Aceptado"
                      : "Rechazado"}

                    {dataLoan?.newCantityOpt == null &&
                      dataLoan?.newCantity && (
                        <p>Esperando respuesta del cliente...</p>
                      )}
                  </p>
                </div>
              </div>
            </>
          )}

          <h3 className={styles.titleDocs}>Informacion del solicitante</h3>
          <div className={styles.prevInfoClient}>
            <div className={styles.infoClient}>
              <h5 className={styles.subTitleClient}>Nombre completo</h5>
              <h3>{`${dataClient?.names} ${dataClient?.firstLastName} ${dataClient?.secondLastName}`}</h3>
            </div>

            <div className={styles.infoClient}>
              <h5 className={styles.subTitleClient}>Numero de documento</h5>
              <h3>{dataDocument?.number}</h3>
            </div>

            <div className={styles.infoClient}>
              <h5 className={styles.subTitleClient}>Email</h5>
              <h3>{dataClient?.email}</h3>
            </div>

            <div className={styles.infoClient}>
              <h5 className={styles.subTitleClient}>Numero celular</h5>
              <h3>{dataClient?.phone}</h3>
            </div>
          </div>

          <h3 className={styles.titleDocs}>Status del prestamo</h3>
          <div className={styles.prevInfoClient}>
            <div className={styles.infoClient}>
              <h5 className={styles.subTitleClient}>Status</h5>
              <h2>{dataLoan?.status}</h2>
            </div>

            {dataLoan?.status == "Rechazado" && (
              <div className={styles.infoClient}>
                <h5 className={styles.subTitleClient}>Razon del rechazo</h5>
                <h3>{dataLoan?.reasonReject}</h3>
              </div>
            )}
          </div>

          <h3 className={styles.titleDocs}>Informacion Financiera</h3>
          <div className={styles.prevInfoClient}>
            <div className={styles.infoClient}>
              <h5 className={styles.subTitleClient}>Cantidad solicitada</h5>
              <h3>{stringToPriceCOP(dataLoan?.cantity as string)}</h3>
            </div>

            <div className={styles.infoClient}>
              <h5 className={styles.subTitleClient}>Numero de cuenta</h5>
              <h3>{dataLoan?.bankNumberAccount}</h3>
            </div>

            <div className={styles.infoClient}>
              <h5 className={styles.subTitleClient}>Tipo de cuenta</h5>
              <h3>{dataLoan?.bankSavingAccount && "Ahorros"}</h3>
            </div>

            <div className={styles.infoClient}>
              <h5 className={styles.subTitleClient}>Entidad Bancaria</h5>
              <h3>{dataLoan?.entity}</h3>
            </div>
          </div>

          <h3 className={styles.titleDocs}>Documentos Obligatorios</h3>
          <div className={styles.barDocs}>
            <div className={styles.docBox}>
              <div className={styles.barIconPdf}>
                <TbPdf className={styles.iconPdf} size={30} />
              </div>
              <p>Primer Volante</p>
              <div className={styles.actionDocBox}>
                <button>Ver</button>
              </div>
            </div>

            <div className={styles.docBox}>
              <div className={styles.barIconPdf}>
                <TbPdf className={styles.iconPdf} size={30} />
              </div>
              <p>Segundo Volante</p>
              <div className={styles.actionDocBox}>
                <button>Ver</button>
              </div>
            </div>

            <div className={styles.docBox}>
              <div className={styles.barIconPdf}>
                <TbPdf className={styles.iconPdf} size={30} />
              </div>
              <p>Tercer Volante</p>
              <div className={styles.actionDocBox}>
                <button>Ver</button>
              </div>
            </div>

            <div className={styles.docBox}>
              <div className={styles.barIconPdf}>
                <TbPdf className={styles.iconPdf} size={30} />
              </div>
              <p>Carta Laboral</p>
              <div className={styles.actionDocBox}>
                <button>Ver</button>
              </div>
            </div>
          </div>

          <h3 className={styles.titleDocs}>Otros Documentos</h3>
          <div className={styles.barDocs}>
            <div className={styles.docBox}>
              <div className={styles.barIconPdf}>
                <TbPdf className={styles.iconPdf} size={30} />
              </div>
              <p>Autorizacion centrales de riesgo</p>
              <div className={styles.actionDocBox}>
                <button onClick={() => handleOpenViewPdf(0)}>Ver</button>
              </div>
            </div>

            <div className={styles.docBox}>
              <div className={styles.barIconPdf}>
                <TbPdf className={styles.iconPdf} size={30} />
              </div>
              <p>Autorizacion cobro</p>
              <div className={styles.actionDocBox}>
                <button onClick={() => handleOpenViewPdf(1)}>Ver</button>
              </div>
            </div>

            <div className={styles.docBox}>
              <div className={styles.barIconPdf}>
                <TbPdf className={styles.iconPdf} size={30} />
              </div>
              <p>Autorizacion descuento nomina</p>
              <div className={styles.actionDocBox}>
                <button onClick={() => handleOpenViewPdf(2)}>Ver</button>
              </div>
            </div>

            <div className={styles.docBox}>
              <div className={styles.barIconPdf}>
                <TbPdf className={styles.iconPdf} size={30} />
              </div>
              <p>Pagare</p>
              <div className={styles.actionDocBox}>
                <button onClick={() => handleOpenViewPdf(3)}>Ver</button>
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
          {linkSelect == 0 && (
            <Document00
              numberDocument={dataDocument?.number as string}
              signature={dataLoan?.signature}
              entity={dataLoan?.entity as string}
              numberBank={dataLoan?.bankNumberAccount as string}
            />
          )}
          {linkSelect == 1 && (
            <Document01
              name={`${dataClient?.names} ${dataClient?.firstLastName} ${dataClient?.secondLastName}`}
              numberDocument={dataDocument?.number as string}
              signature={dataLoan?.signature as string}
            />
          )}
          {linkSelect == 2 && (
            <Document02
              name={`${dataClient?.names} ${dataClient?.firstLastName} ${dataClient?.secondLastName}`}
              numberDocument={dataDocument?.number as string}
              signature={dataLoan?.signature as string}
            />
          )}
          {linkSelect == 3 && (
            <Document03
              name={`${dataClient?.names} ${dataClient?.firstLastName} ${dataClient?.secondLastName}`}
              numberDocument={dataDocument?.number as string}
              signature={dataLoan?.signature}
            />
          )}
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
              <button
                className={styles.btnRejectReady}
                onClick={() => onDes({ newStatus: "Rechazado" })}
              >
                Listo
              </button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={openModelChange} onClose={handleChangeCantity}>
          <div className={styles.intraRejectModal}>
            <h3>Cantidad</h3>
            <CurrencyInput
              className={styles.inputPrice}
              placeholder="Ingresa la cantidad"
              defaultValue={0}
              decimalsLimit={2}
              onValueChange={(value, name, values) => {
                setNewValue(value as string);
              }}
              prefix="$"
            />
            <h3>Razon</h3>
            <p>Escribe una razon clara</p>
            <textarea
              className={styles.rejectTextArea}
              onChange={(e) => setReasonNewCantity(e.target.value)}
            ></textarea>
            <div>
              <button
                className={styles.btnRejectReady}
                onClick={handleSuccesChangeCantity}
              >
                Listo
              </button>
            </div>
          </div>
        </Modal>
      </>
    );
  }
}

export default RequestPreview;
