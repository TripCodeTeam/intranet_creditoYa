import { scalarClient } from "@/types/session";
import React, { useState } from "react";
import styles from "../styles/userCard.module.css";
import Avatar from "react-avatar";
import DatesComplete from "./datesComplete";
import { TbAdjustmentsCog, TbHistoryToggle, TbMailPlus } from "react-icons/tb";
import Tooltip from "@/components/gadget/Tooltip";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal/modal";

function CardUser({
  user,
  token,
  changeOption,
}: {
  user: scalarClient;
  token: string;
  changeOption: ({
    option,
    userId,
  }: {
    option: string;
    userId: string;
  }) => void;
}) {
  const [openModel, setOpenModel] = useState<boolean>(false);
  const [typeModel, setTypeModel] = useState<string | null>(null);

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
            onClick={() =>
              changeOption({ option: "email", userId: user.id as string })
            }
          >
            <Tooltip message="Enviar correo">
              <TbMailPlus size={20} className={styles.iconOption} />
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
          {typeModel == "message" && "Whatsapp Coming soon..."}
        </Modal>
      )}
    </>
  );
}

export default CardUser;
