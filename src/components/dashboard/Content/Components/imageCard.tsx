"use client";

import React, { useEffect, useState } from "react";
import styles from "../styles/imagecard.module.css";

interface ImageCardProps {
  image: File; // Cambiar a File para recibir el objeto File
  onDelete: (image: File) => void; // Mantener como File para pasar el objeto
}

const ImageCard = ({ image, onDelete }: ImageCardProps) => {
  const [imageURL, setImageURL] = useState<string>("");

  useEffect(() => {
    // Crear un URL para la imagen
    const url = URL.createObjectURL(image);
    setImageURL(url);

    // Limpiar el objeto URL cuando el componente se desmonte
    return () => {
      URL.revokeObjectURL(url); // Liberar memoria
    };
  }, [image]);

  return (
    <div className={styles.card}>
      <img src={imageURL} alt="Uploaded" className={styles.image} />
      <button className={styles.deleteButton} onClick={() => onDelete(image)}>
        Borrar
      </button>
    </div>
  );
};

export default ImageCard;
