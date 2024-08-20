"use client";

import Loading from "@/app/dashboard/loading";
import { useGlobalContext } from "@/context/Session";
import { ScalarUser, SessionAuth } from "@/types/session";
import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import styles from "./styles/userProfile.module.css";
import { TbCircleCheck } from "react-icons/tb";
import axios from "axios";
import { toast } from "sonner";

function UserProfile() {
  const { dataSession, setDataSession } = useGlobalContext();
  const [dataUser, setDataUser] = useState<ScalarUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    key: keyof ScalarUser
  ) => {
    const { value } = e.target;

    setDataUser((prevFormData) => ({
      ...(prevFormData as ScalarUser),
      [key]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      if (!dataUser) throw new Error("No hay nada que actualizar");

      const updateProfile = await axios.post(
        "/api/users/update",
        {
          employeeId: dataSession?.id,
          data: dataUser,
        },
        { headers: { Authorization: `Bearer ${dataSession?.token}` } }
      );

      if (updateProfile.data.success == true) {
        // const data: ScalarUser = updateProfile.data.data;
        // // const { password, created_at, updated_at, ...authData } = data;

        toast.success("Datos actualizados");
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;

    // Verifica que fileInput y files no sean null o undefined
    if (fileInput && fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];

      setAvatarFile(file);

      // Opción para previsualizar la imagen antes de la subida
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setDataUser((prevData) => ({
            ...(prevData as ScalarUser),
            avatar: e.target ? (e.target.result as string) : "",
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      if (dataSession !== null) {
        const getUser = await axios.post(
          "/api/users/id",
          {
            employeeId: dataSession.id,
          },
          { headers: { Authorization: `Bearer ${dataSession.token}` } }
        );

        if (getUser.data.success == true) {
          const data: ScalarUser = getUser.data.data;
          console.log(data);

          setDataUser((prevData) => ({
            ...(prevData as ScalarUser),
            email: data.email,
            avatar: data.avatar,
            name: data.name,
            lastNames: data.lastNames,
            isActive: data.isActive,
            phone: data.phone,
          }));

          setLoading(false);
        }
      }
    };

    getUser();
  }, [dataSession]);

  if (loading) <Loading />;

  if (!loading) {
    return (
      <>
        <div className={styles.componentUserProfile}>
          <label htmlFor="avatar-upload">
            <Avatar
              src={dataUser?.avatar}
              round={true}
              size="230"
              style={{ cursor: "pointer" }}
            />
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
            />
          </label>

          <div className={styles.componentBoxDetails}>
            <div className={styles.boxDetail}>
              <h5>Correo electronico</h5>
              <input
                type="text"
                value={
                  (dataUser?.email == "No definido" ? "" : dataUser?.email) ||
                  ""
                }
                onChange={(e) => handleInputChange(e, "email")}
              />
            </div>

            <div className={styles.boxDetail}>
              <h5>Nombre</h5>
              <input
                type="text"
                value={
                  (dataUser?.name == "No definido" ? "" : dataUser?.name) || ""
                }
                onChange={(e) => handleInputChange(e, "name")}
              />
            </div>

            <div className={styles.boxDetail}>
              <h5>Apellidos</h5>
              <input
                type="text"
                value={
                  (dataUser?.lastNames == "No definido"
                    ? ""
                    : dataUser?.lastNames) || ""
                }
                onChange={(e) => handleInputChange(e, "lastNames")}
              />
            </div>

            <div className={styles.boxDetail}>
              <h5>Contraseña </h5>
              <input
                type="text"
                onChange={(e) => handleInputChange(e, "password")}
              />
            </div>

            <div className={styles.boxDetail}>
              <h5>Numero de contacto</h5>
              <input
                type="text"
                value={
                  (dataUser?.phone == "No definido" ? "" : dataUser?.phone) ||
                  ""
                }
                onChange={(e) => handleInputChange(e, "phone")}
              />
            </div>

            <div className={styles.boxBtnSave}>
              <button onClick={handleUpdate}>
                <div className={styles.boxIconCheck}>
                  <TbCircleCheck className={styles.iconCheck} size={20} />
                </div>
                <p className={styles.textBtnAct}>Actualizar</p>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default UserProfile;
