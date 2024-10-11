import React, { useState } from "react";
import HeaderContent from "./Components/HeaderContent";
import styles from "./styles/issues.module.css";
import {
  TbArrowNarrowLeft,
  TbLoader,
  TbPhotoPlus,
  TbProgressCheck,
  TbProgressHelp,
} from "react-icons/tb";
import Select from "react-select";
import ImageCard from "./Components/imageCard";
import { toast } from "sonner";
import axios from "axios";
import { useGlobalContext } from "@/context/Session";
import AllReports from "./Components/AllReports";
import { ScalarIssues } from "@/types/session";
import Image from "next/image";
import DateToPretty from "@/handlers/DateToPretty";

const appOpt = [
  { value: null, label: "Selecciona una aplicacion" },
  { value: "intranet", label: "Intranet" },
  { value: "clients", label: "App Clientes" },
];

function Issues() {
  const [openIssue, setOpenIssue] = useState<boolean>(false);
  const [onlyIssue, setOnlyIssue] = useState<boolean>(false);
  const [onlyIssueData, setOnlyIssueData] = useState<ScalarIssues | null>(null);

  const [creating, setCreating] = useState<boolean>(false);

  const { dataSession } = useGlobalContext();

  const [description, setDescription] = useState<string | null>(null);
  const [app, setApp] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]); // Estado para las imágenes

  // Manejar la carga de imágenes
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files); // Convierte los archivos a un array

      // Guarda los nuevos archivos en el estado
      setImages((prevImages) => [...(prevImages || []), ...newImages]);
    }
  };

  const handleCreateReport = async () => {
    try {
      setCreating(true);

      let error: string[] = [];
      let imagesLoad: string[] = [];

      if (!description) error.push("Falta la descripción");
      if (!app) error.push("Falta seleccionar la app del problema");

      if (error.length > 0) {
        error.forEach((err) => toast.error(err));
        setCreating(false);
        return;
      }

      // console.log(images);

      if (images.length > 0) {
        const uploadPromises = images.map((image) => {
          return new Promise<void>(async (resolve, reject) => {
            // Especificamos que la promesa devuelve void
            const reader = new FileReader();

            reader.onload = async (event) => {
              const target = event.target;

              if (target) {
                const imageDataUrl = target.result as string;

                try {
                  const addImage = await axios.post(
                    "/api/upload/image_report",
                    {
                      img: imageDataUrl,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${dataSession?.token}`,
                      },
                    }
                  );

                  // console.log(addImage.data);

                  if (addImage.data.success) {
                    imagesLoad.push(addImage.data.data);
                    resolve(); // Resuelve la promesa
                  } else {
                    toast.error(addImage.data.error);
                    reject(new Error(addImage.data.error)); // Rechaza la promesa
                  }
                } catch (error) {
                  reject(error); // Rechaza la promesa en caso de error
                }
              } else {
                reject(new Error("Error al cargar la imagen")); // Manejar el caso donde target es null
              }
            };

            reader.onerror = () => {
              reject(new Error("Error al leer el archivo")); // Rechaza en caso de error de FileReader
            };

            reader.readAsDataURL(image); // Lee el archivo como data URL
          });
        });

        await Promise.all(uploadPromises); // Esperar a que todas las imágenes sean procesadas
      }

      const newReport = await axios.post(
        "/api/report/create",
        {
          description,
          images: imagesLoad,
          app,
        },
        { headers: { Authorization: `Bearer ${dataSession?.token}` } }
      );

      console.log(newReport);

      if (newReport.data.success) {
        setOpenIssue(false);
        setApp(null);
        setImages([]);
        setDescription(null);
        toast.success("Reporte creado exitosamente");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    } finally {
      setCreating(false);
    }
  };

  const handleOpenIssue = (data: ScalarIssues) => {
    setOpenIssue(false);
    setOnlyIssue(true);
    setOnlyIssueData(data);
  };

  const handleDeleteImage = (image: File) => {
    setImages((prevImages) =>
      prevImages ? prevImages.filter((img) => img.name !== image.name) : []
    );
  };

  return (
    <>
      <main className={styles.issuesContainer}>
        <HeaderContent label={"Reporta Errores en las aplicaciones"} />

        <div className={styles.barOpenIssues}>
          <div
            className={styles.btnIssues}
            onClick={() => setOpenIssue(!openIssue)}
          >
            <div className={styles.boxIconIssue}>
              {openIssue && <TbProgressCheck size={20} />}
              {!openIssue && <TbProgressHelp size={20} />}
            </div>
            <p className={styles.TextIssue}>
              {openIssue && "Listo"}
              {!openIssue && "Reportar Problema"}
            </p>
          </div>
        </div>

        {openIssue && !onlyIssue && (
          <>
            <div className={styles.boxDetails}>
              <div className={styles.boxDetailIssue}>
                <h5>Aplicacion</h5>
                <Select
                  defaultValue={appOpt[0]}
                  isClearable={true}
                  onChange={(e) => setApp(e?.value as string)}
                  options={appOpt}
                  value={
                    appOpt.find((option) => option.value === app) || appOpt[0]
                  }
                />
              </div>

              <div className={styles.boxDetailIssue}>
                <h5>Descripcion del problema</h5>
                <textarea
                  minLength={200}
                  onChange={(e) => setDescription(e.target.value)}
                  className={styles.inputForm}
                />
              </div>

              <div className={styles.barOpenIssues}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  id="fileInput"
                  onChange={handleImageUpload}
                />

                <div
                  className={styles.btnPic}
                  onClick={() => {
                    document.getElementById("fileInput")?.click();
                  }}
                >
                  <div className={styles.boxIconIssue}>
                    <TbPhotoPlus className={styles.iconAddImage} size={20} />
                  </div>
                  <p className={styles.TextPic}>Agregar Imagen</p>
                </div>
              </div>

              <div className={styles.imageGallery}>
                {images &&
                  images.map((image, index) => (
                    <ImageCard
                      onDelete={handleDeleteImage}
                      key={index}
                      image={image}
                    />
                  ))}
              </div>
            </div>

            <div className={styles.barOpenCreate}>
              <div className={styles.btnIssues} onClick={handleCreateReport}>
                <div className={styles.boxIconIssue}>
                  {creating && (
                    <TbLoader className={styles.iconLoader} size={20} />
                  )}
                  {!creating && <TbProgressHelp size={20} />}
                </div>
                <p className={styles.TextIssue}>
                  {creating && "Creando reporte"}
                  {!creating && "Crear reporte"}
                </p>
              </div>
            </div>
          </>
        )}

        {!openIssue && !onlyIssue && (
          <>
            <AllReports openIssue={handleOpenIssue} />
          </>
        )}

        {onlyIssue && onlyIssueData && !openIssue && (
          <>
            <div className={styles.barBtnBack}>
              <div
                className={styles.btnBack}
                onClick={() => setOnlyIssue(false)}
              >
                <div className={styles.boxIconArrow}>
                  <TbArrowNarrowLeft />
                </div>
                <p>Atras</p>
              </div>
            </div>

            <div className={styles.columDetails}>
              <div className={styles.boxDetail}>
                <h4>Ticket del problema</h4>
                <h5>{onlyIssueData.id}</h5>
              </div>

              <div className={styles.boxDetail}>
                <h4>Estado del problema</h4>
                <h5>{onlyIssueData.status}</h5>
              </div>

              <div className={styles.boxDetail}>
                <h4>Applicacion del problema</h4>
                <h5>
                  {onlyIssueData.app == "clients" && "Aplicacion de Clientes"}
                  {onlyIssueData.app == "intranet" && "Aplicacion Intranet"}
                </h5>
              </div>

              <div className={styles.boxDetail}>
                <h4>Descripcion</h4>
                <h5>{onlyIssueData.description}</h5>
              </div>

              <div className={styles.boxDetail}>
                <h4>Fecha de creacion</h4>
                <h5>{DateToPretty(String(onlyIssueData.created_at), true)}</h5>
              </div>

              <div className={styles.boxDetail}>
                <h4>Imagenes</h4>
                {onlyIssueData.images?.length === 0 && <h5>Sin imagenes</h5>}
                <div>
                  {onlyIssueData.images?.map((image, index) => (
                    <Image
                      key={index}
                      width={200}
                      height={200}
                      src={image}
                      alt={"Images"}
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}

export default Issues;
