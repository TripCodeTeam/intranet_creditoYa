import { scalarClient } from "@/types/session";
import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "../styles/userCard.module.css";
import Avatar from "react-avatar";
import DatesComplete from "./datesComplete";
import {
  TbAdjustmentsCog,
  TbHistoryToggle,
  TbMailPlus,
  TbMessageCirclePlus,
  TbTimelineEventText,
} from "react-icons/tb";
import Tooltip from "@/components/gadget/Tooltip";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal/modal";
import ContainerMail from "@/components/Email/ContainerMail";
import SendMessagePriv from "@/components/chat/SendMessagePriv";

function CardUser({ user, token }: { user: scalarClient; token: string }) {
  const [openModel, setOpenModel] = useState<boolean>(false);
  const [typeModel, setTypeModel] = useState<string | null>(null);
  // useEffect(() => {
  //   const getHistory = async () => {
  //     const response = await axios.post(
  //       "/api/user/count",
  //       {
  //         userId: user.id,
  //       },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //   };

  //   getHistory();
  // }, []);

  const router = useRouter();

  const toggleOpenModel = () => {
    setOpenModel(!openModel);
  };

  return (
    <>
      <div className={styles.cardUser}>
        <div className={styles.idBox}>
          <div className={styles.boxAvatar}>
            <Avatar
              src={user.avatar}
              className={styles.avatar}
              round={true}
              size="40"
            />
          </div>
          <div className={styles.textNameId}>
            <h2>
              {user.names} {user.firstLastName} {user.secondLastName}
            </h2>
            <p className={styles.textId}>ID: {user.id}</p>
          </div>
          <div className={styles.infoUser}>
            <DatesComplete userId={user.id as string} token={token} />
          </div>
        </div>
        <div className={styles.optionsBox}>
          <div
            className={styles.boxIconOption}
            onClick={() => router.push(`/client/${user.id}/events`)}
          >
            <Tooltip message="Eventos">
              <TbTimelineEventText size={20} className={styles.iconOption} />
            </Tooltip>
          </div>

          <div
            className={styles.boxIconOption}
            onClick={() => {
              setTypeModel("mail");
              toggleOpenModel();
            }}
          >
            <Tooltip message="Enviar correo">
              <TbMailPlus size={20} className={styles.iconOption} />
            </Tooltip>
          </div>

          <div
            className={styles.boxIconOption}
            onClick={() => {
              setTypeModel("message");
              toggleOpenModel();
            }}
          >
            <Tooltip message="Enviar mensaje">
              <TbMessageCirclePlus size={20} className={styles.iconOption} />
            </Tooltip>
          </div>

          <div
            className={styles.boxIconOption}
            onClick={() => router.push(`/client/${user.id}/loans`)}
          >
            <Tooltip message="Historial">
              <TbHistoryToggle size={20} className={styles.iconOption} />
            </Tooltip>
          </div>

          <div className={styles.boxIconOption}>
            <Tooltip message="Configuracion">
              <TbAdjustmentsCog size={20} className={styles.iconOption} />
            </Tooltip>
          </div>
        </div>
      </div>

      {openModel && (
        <Modal isOpen={openModel} onClose={toggleOpenModel}>
          {typeModel == "mail" && <ContainerMail mail={user.email} />}
          {typeModel == "message" && (
            <SendMessagePriv userId={user.id as string} />
          )}
        </Modal>
      )}
    </>
  );
}

export default CardUser;
