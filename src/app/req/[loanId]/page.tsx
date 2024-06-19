"use client";

import { useGlobalContext } from "@/context/Session";
import { ScalarDocument, ScalarLoanApplication, Status } from "@/types/session";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CardInfo from "@/components/dashboard/ReqInfoCard";
import styles from "./page.module.css";
import { TbArrowLeft, TbChevronDown, TbChevronRight } from "react-icons/tb";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { useWebSocket } from "next-ws/client";

function RequestPreview({ params }: { params: { loanId: string } }) {
  const { dataSession } = useGlobalContext();
  const router = useRouter();

  const [dataLoan, setDataLoan] = useState<ScalarLoanApplication | null>(null);
  const [dataDocument, setDataDocument] = useState<ScalarDocument | null>(null);

  const [openFirst, setOpenFirst] = useState<boolean>(false);
  const [openSecond, setOpenSecond] = useState<boolean>(false);
  const [openThree, setOpenThree] = useState<boolean>(false);
  const [openFour, setOpenFour] = useState<boolean>(false);
  const [openFive, setOpenFive] = useState<boolean>(false);
  const [openSix, setOpenSix] = useState<boolean>(false);
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
        }
      }
    };

    getLoanInfo();
  }, [dataSession?.token, params.loanId]);

  const onDes = async ({ newStatus }: { newStatus: Status }) => {
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
            <p>Solicitud ID: {dataLoan?.id}</p>
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
                onClick={() => onDes({ newStatus: "Rechazado" })}
              >
                Rechazar
              </p>
            </div>
          )}
        </div>

        <div
          className={openSecond ? styles.secondTitleActive : styles.secondTitle}
          onClick={() => setOpenSecond(!openSecond)}
        >
          <h3 className={styles.firstTitle}>Informacion del credito</h3>
          <div className={styles.boxChevron}>
            {!openSecond && <TbChevronRight size={20} />}
            {openSecond && <TbChevronDown size={20} />}
          </div>
        </div>
        {openSecond && (
          <div className={styles.listDetails}>
            <CardInfo
              money={false}
              label={"Deudor principal"}
              text={dataLoan?.principal_debtor || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              label={"Codeudor"}
              text={dataLoan?.co_debtor || "Sin definir"}
              money={false}
              datetime={false}
            />

            <CardInfo
              label={"Fecha Solicitud"}
              text={String(dataLoan?.createdAt) || "Sin definir"}
              money={false}
              datetime={true}
            />

            <CardInfo
              label={"Empresa Afiliada"}
              text={dataLoan?.affiliated_company || "Sin definir"}
              money={false}
              datetime={false}
            />

            <CardInfo
              label={"Nit"}
              text={dataLoan?.nit || "Sin definir"}
              money={false}
              datetime={false}
            />

            <CardInfo
              label={"Monto Solicitado"}
              text={dataLoan?.requested_amount || "Sin definir"}
              money={true}
              datetime={false}
            />

            <CardInfo
              label={"Plazo (Meses)"}
              text={dataLoan?.deadline || "Sin definir"}
              money={false}
              datetime={false}
            />

            <CardInfo
              label={"Pago"}
              text={dataLoan?.payment || "Sin definir"}
              money={false}
              datetime={false}
            />

            <CardInfo
              label={"Valor Cuota"}
              text={dataLoan?.quota_value || "Sin definir"}
              money={true}
              datetime={false}
            />

            {/* <CardInfo
                    label={"Creditos vigentes"}
                    text={dataLoan?.current_loans_affecting}
                    money={false}
                  /> */}
          </div>
        )}

        <div
          className={openFirst ? styles.secondTitleActive : styles.secondTitle}
          onClick={() => setOpenFirst(!openFirst)}
        >
          <h3>Informacion general del solicitante</h3>
          <div className={styles.boxChevron}>
            {!openFirst && <TbChevronRight size={20} />}
            {openFirst && <TbChevronDown size={20} />}
          </div>
        </div>
        {openFirst && (
          <div className={styles.listDetails}>
            <CardInfo
              money={false}
              label={"Primer Apellido"}
              text={dataLoan?.firtLastName || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Segundo Apellido"}
              text={dataLoan?.secondLastName || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Nombre"}
              text={dataLoan?.names || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Ocupacion, Oficio o Profesion"}
              text={dataLoan?.occupation || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Documento de identidad"}
              text={dataLoan?.typeDocument || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Personas a cargo"}
              text={dataLoan?.persons_in_charge || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Fecha de nacimiento"}
              text={String(dataLoan?.birthDate) || "Sin definir"}
              datetime={true}
            />

            <CardInfo
              money={false}
              label={"Lugar de nacimiento"}
              text={dataLoan?.place_birth || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Sexo"}
              text={dataLoan?.genre || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Estado civil"}
              text={dataLoan?.marital_status || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Telefono/Celular"}
              text={dataLoan?.cellPhone || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Destino de los recursos"}
              text={dataLoan?.destination_resources || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Antiguedad de la empresa"}
              text={dataLoan?.labor_seniority || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Direccion residencia"}
              text={dataLoan?.residence_address || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Ciudad"}
              text={dataLoan?.city || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Telefono residencia"}
              text={dataLoan?.residence_phone || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Tipo de vivienda"}
              text={dataLoan?.housing_type || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Email"}
              text={dataLoan?.email || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Whatsapp"}
              text={dataLoan?.whatsapp_number || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Pignorado"}
              text={dataLoan?.pignorado || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"A favor de"}
              text={dataLoan?.in_favor_pignorado || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={true}
              label={"Valor comercial"}
              text={dataLoan?.commercial_value || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Otros bienes personales o familiares"}
              text={dataLoan?.other_income_other_principal || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={true}
              label={"Valor comercial"}
              text={dataLoan?.other_personal_commercial_value || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Tiene familiares en la empresa de convenio?"}
              text={
                dataLoan?.family_members_in_company_agreement || "Sin definir"
              }
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Actualmente es codeudor de alguna obligacion crediticia?"}
              text={dataLoan?.is_currently_codebtor || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Con Credito Ya?"}
              text={dataLoan?.codebtor_in_creditoya || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Otra entidad?"}
              text={dataLoan?.other_entity || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Cual?"}
              text={dataLoan?.name_other_entity || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={true}
              label={"Monto"}
              text={dataLoan?.amount_in_the_other_entity || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Nombres y apellidos del conyugue"}
              text={dataLoan?.complete_name_spouse || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"N° identificacion"}
              text={dataLoan?.number_document_spouse || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Telefono fijo"}
              text={dataLoan?.landline_telephone_spouse || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Empresa donde trabaja"}
              text={dataLoan?.name_company_spouse || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Telefono oficina"}
              text={dataLoan?.phone_company_spoue || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Telefono celular"}
              text={dataLoan?.phone_spouse || "Sin definir"}
              datetime={false}
            />
          </div>
        )}

        <div
          className={openThree ? styles.secondTitleActive : styles.secondTitle}
          onClick={() => setOpenThree(!openThree)}
        >
          <h3>Informacion financiera</h3>
          <div className={styles.boxChevron}>
            {!openThree && <TbChevronRight size={20} />}
            {openThree && <TbChevronDown size={20} />}
          </div>
        </div>
        {openThree && (
          <div className={styles.listDetails}>
            <CardInfo
              money={true}
              label={"Total ingresos mensuales"}
              text={dataLoan?.total_monthly_income || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={true}
              label={"Total egresos mensuales"}
              text={dataLoan?.monthly_expenses || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={true}
              label={"Total activos"}
              text={dataLoan?.total_assets || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={true}
              label={"Total pasivos"}
              text={dataLoan?.total_liabilities || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={true}
              label={"Patrimonio"}
              text={dataLoan?.total_liabilities || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Corte"}
              text={String(dataLoan?.court) || "Sin definir"}
              datetime={true}
            />

            <CardInfo
              money={false}
              label={"N° empleados"}
              text={dataLoan?.number_employees || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={
                "Tiene otros ingresos diferentes a la actividad economica principal en la familia?"
              }
              text={dataLoan?.other_economy_activity_principal || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Cuales?"}
              text={
                dataLoan?.which_other_economy_activity_principal ||
                "Sin definir"
              }
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Ingresos mensuales"}
              text={
                dataLoan?.monthly_income_other_economy_activity_principal ||
                "Sin definir"
              }
              datetime={false}
            />
          </div>
        )}

        <div
          className={openFour ? styles.secondTitleActive : styles.secondTitle}
          onClick={() => setOpenFour(!openFour)}
        >
          <h3>Referencias</h3>
          <div className={styles.boxChevron}>
            {!openFour && <TbChevronRight size={20} />}
            {openFour && <TbChevronDown size={20} />}
          </div>
        </div>
        {openFour && (
          <div className={styles.listDetails}>
            <h3>Referencias Personales</h3>
            <CardInfo
              money={false}
              label={"Apellidos y nombres"}
              text={dataLoan?.personal_reference_name || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Empresa donde trabaja"}
              text={
                dataLoan?.personal_reference_work_company_name || "Sin definir"
              }
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Ciudad"}
              text={dataLoan?.personal_reference_city || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Direccion residencia"}
              text={dataLoan?.personal_reference_address || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Telefono residencia"}
              text={dataLoan?.personal_reference_address || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Telefono Celular"}
              text={dataLoan?.personal_reference_number_phone || "Sin definir"}
              datetime={false}
            />

            <h3>Referencias Familiares</h3>
            <CardInfo
              money={false}
              label={"Apellidos y nombres"}
              text={dataLoan?.family_reference_name || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Empresa donde trabaja"}
              text={
                dataLoan?.family_reference_work_company_name || "Sin definir"
              }
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Ciudad"}
              text={dataLoan?.family_reference_city || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Direccion residencia"}
              text={dataLoan?.family_reference_address || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Telefono residencia"}
              text={
                dataLoan?.family_reference_number_residence || "Sin definir"
              }
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Telefono Celular"}
              text={dataLoan?.family_reference_number_phone || "Sin definir"}
              datetime={false}
            />
          </div>
        )}

        <div
          className={openFive ? styles.secondTitleActive : styles.secondTitle}
          onClick={() => setOpenFive(!openFive)}
        >
          <h3>Clase de contrato</h3>
          <div className={styles.boxChevron}>
            {!openFive && <TbChevronRight size={20} />}
            {openFive && <TbChevronDown size={20} />}
          </div>
        </div>
        {openFive && (
          <div className={styles.listDetails}>
            <CardInfo
              money={false}
              label={"Termino Fijo"}
              text={dataLoan?.fixed_term || "Sin definir"}
              datetime={false}
            />

            <CardInfo
              money={false}
              label={"Labor o Obra"}
              text={dataLoan?.labor_or_work || "Sin definir"}
              datetime={false}
            />
          </div>
        )}

        <div
          className={openSix ? styles.secondTitleActive : styles.secondTitle}
          onClick={() => setOpenSix(!openSix)}
        >
          <h3>Datos del contrato</h3>
          <div className={styles.boxChevron}>
            {!openSix && <TbChevronRight size={20} />}
            {openSix && <TbChevronDown size={20} />}
          </div>
        </div>
        {openSix && (
          <div className={styles.listDetails}>
            <CardInfo
              money={false}
              label={"Fecha de vinculacion"}
              text={String(dataLoan?.createdAt) || "Sin definir"}
              datetime={true}
            />
          </div>
        )}

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

        <h3>Carta laboral</h3>
      </main>
    </>
  );
}

export default RequestPreview;
