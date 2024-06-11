import React, { useState } from "react";
import styles from "./editor.module.css";
import { toast } from "sonner";
import axios from "axios";
import { useGlobalContext } from "@/context/Session";
import ImagesBox from "./ImagesBox";

interface UserTypes {
  subject: string;
  content: string;
}

function EditorComponent({
  success,
  email,
}: {
  success: (complete: boolean) => void;
  email: string;
}) {
  const [option, setOption] = useState<string | null>("text");
  const { dataSession } = useGlobalContext();
  const [images, setImages] = useState<File[] | null>(null);

  const [data, setData] = useState<UserTypes>({
    subject: "",
    content: "",
  });

  const handleChangeOption = (option: string) => {
    setOption(option);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendMail = async () => {
    if (data.content.length == 0 && data.subject.length !== 0) {
      toast.error("Correo sin contenido");
    } else if (data.content.length !== 0 && data.subject.length == 0) {
      toast.error("Correo sin asunto");
    } else if (data.subject.length !== 0 && data.content.length !== 0) {
      console.log(data.content, data.subject);
      const response = await axios.post(
        "/api/mail/by_user",
        {
          content: data.content,
          subject: data.subject,
          addressee: email,
        },
        { headers: { Authorization: `Bearer ${dataSession?.token}` } }
      );

      // console.log(response);

      if (response.data.accepted) {
        toast.success("Correo enviado exitosamente");
        success(true);
      }
    } else if (data.subject.length == 0 && data.content.length == 0) {
      toast.error("Correo vacio");
    }
  };

  const agreeImages = (images: File[]) => {
    console.log(images);
    setImages(images);
  };

  const handleSendMailWithImages = async () => {
    if (data.content.length == 0 && data.subject.length !== 0) {
      toast.error("Correo sin contenido");
    } else if (data.content.length !== 0 && data.subject.length == 0) {
      toast.error("Correo sin asunto");
    } else if (data.subject.length !== 0 && data.content.length !== 0) {
      const formData = new FormData();
      images?.forEach((image, index) => {
        formData.append(`image-${index}`, image);
      });
      formData.append("content", data.content);
      formData.append("subject", data.subject);
      formData.append("addressee", email);
      const response = await axios.post("/api/mail/by_user_images", formData, {
        headers: { Authorization: `Bearer ${dataSession?.token}` },
      });

      // console.log(response);

      if (response.data.accepted) {
        toast.success("Correo enviado exitosamente");
        success(true);
      }
    } else if (data.subject.length == 0 && data.content.length == 0) {
      toast.error("Correo vacio");
    }
  };

  return (
    <>
      <div className={styles.boxOptions}>
        <h1 className={styles.mailTitle}>Selecciona el tipo de correo</h1>
        <div className={styles.centerBoxOptions}>
          <p
            className={option == "text" ? styles.btnOptActive : styles.btnOpt}
            onClick={() => handleChangeOption("text")}
          >
            Texto
          </p>
          <p
            className={option == "image" ? styles.btnOptActive : styles.btnOpt}
            onClick={() => handleChangeOption("image")}
          >
            Imagenes
          </p>
          <p
            className={
              option == "textAndImage" ? styles.btnOptActive : styles.btnOpt
            }
            onClick={() => handleChangeOption("textAndImage")}
          >
            Texto y Imagenes
          </p>
        </div>
      </div>

      <div className={styles.containerContent}>
        <div className={styles.groupInput}>
          <h4>Asunto</h4>
          <input
            className={styles.inputSubject}
            onChange={handleChange}
            name={"subject"}
            value={data.subject}
            type="text"
          />
        </div>

        <div className={styles.groupInput}>
          <h4>Contenido</h4>
          {option == "text" || option == "textAndImage" ? (
            <textarea
              className={styles.inputContent}
              onChange={handleChange}
              value={data.content}
              name={"content"}
            />
          ) : null}
        </div>

        {option == "image" && (
          <div className={styles.groupInput}>
            <ImagesBox transfer={agreeImages} />
          </div>
        )}

        {option == "textAndImage" && (
          <>
            <div className={styles.groupInput}>
              <h4>Imagenes</h4>
              <ImagesBox transfer={agreeImages} />
            </div>
          </>
        )}

        <div className={styles.boxBtnSend}>
          {option == "textAndImage" && (
            <p onClick={handleSendMailWithImages}>Enviar</p>
          )}
          {option == "text" && <p onClick={handleSendMail}>Enviar</p>}
        </div>
      </div>
    </>
  );
}

export default EditorComponent;
