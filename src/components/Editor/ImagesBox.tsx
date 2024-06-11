import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./images.module.css";
import { TbPlus } from "react-icons/tb";

function ImagesBox({ transfer }: { transfer: (images: File[]) => void }) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  if (selectedFiles.length > 0) {
    console.log(selectedFiles);
    transfer(selectedFiles);
  }

  const removeFile = (file: File) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((f) => f !== file));
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <>
      <div className={styles.boxAgreePics}>
        <div className={styles.boxAddImg}>
          <div {...getRootProps()} className={styles.centerBoxAddImg}>
            <input {...getInputProps()} />
            <div className={styles.boxMessage}>
              <div className={styles.boxIconFile}>
                <TbPlus className={styles.iconLoadFile} size={30} />
              </div>
              <p>Cargar Imagen</p>
            </div>
          </div>
        </div>

        <div className={styles.imagePreviews}>
          {selectedFiles.map((file, index) => (
            <div key={index} className={styles.fileContainer}>
              <div className={styles.boxImagePrev}>
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className={styles.imagePreview}
                />
              </div>

              <div>
                <button
                  className={styles.removeButton}
                  onClick={() => removeFile(file)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ImagesBox;
