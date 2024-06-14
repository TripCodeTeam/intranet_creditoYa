import React, { useState } from "react";
import styles from "./editor.module.css";
import { toast } from "sonner";
import axios from "axios";
import { useGlobalContext } from "@/context/Session";
import ImagesBox from "./ImagesBox";
import { Editor } from "primereact/editor";
import { JsonExcelConvert } from "@/types/ExcelFile";

interface UserTypes {
  subject: string;
  content: string;
}

function EditorComponent({
  success,
  email,
}: {
  success: (complete: boolean) => void;
  email: string | string[] | JsonExcelConvert[] | null;
}) {
  const { dataSession } = useGlobalContext();
  const [images, setImages] = useState<File[] | null>(null);

  const [data, setData] = useState<UserTypes>({
    subject: "",
    content: "",
  });

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
      const formData = new FormData();
      formData.append("content", data.content);
      formData.append("subject", data.subject);

      if (Array.isArray(email)) {
        email.forEach((address) => {
          formData.append("addressee", JSON.stringify(address));
        });
      } else {
        formData.append("addressee", email as string);
      }

      if (images) {
        images.forEach((image, _index) => {
          formData.append("files", image);
        });
      }

      // console.log({
      //   content: formData.get("content"),
      //   subject: formData.get("subject"),
      //   addressee: formData.get("addressee"),
      //   files: formData.get("files")
      // });

      try {
        const response = await axios.post("/api/mail/by_user", formData, {
          headers: { Authorization: `Bearer ${dataSession?.token}` },
        });

        console.log(response);

        if (response.data.success) {
          toast.success("Correo enviado exitosamente");
          success(true);
        }
      } catch (error) {
        toast.error("Error al enviar el correo");
      }
    } else if (data.subject.length == 0 && data.content.length == 0) {
      toast.error("Correo vacio");
    }
  };

  const agreeImages = (images: File[]) => {
    console.log(images);
    setImages(images);
  };

  return (
    <>
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
          <textarea
            className={styles.inputContent}
            onChange={handleChange}
            value={data.content}
            name={"content"}
          />
        </div>

        <div className={styles.groupInput}>
          <h4>Multimedia</h4>
          <ImagesBox transfer={agreeImages} />
        </div>

        <div className={styles.boxBtnSend}>
          <p onClick={handleSendMail}>Enviar</p>
        </div>
      </div>
    </>
  );
}

export default EditorComponent;
