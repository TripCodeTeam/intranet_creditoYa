"use client";

import React, { useEffect, useState } from "react";
import styles from "../styles/imagecard.module.css";

interface ImageCardProps {
  image: File; // Cambié el tipo a File ya que trabajas con archivos
  onDelete: (image: File) => void; // Ajusta para recibir un objeto File
}

const ImageCard = ({ image, onDelete }: ImageCardProps) => {
  const [imageURL, setImageURL] = useState<string>("");

  useEffect(() => {
    // Crear un URL para la imagen
    const url = URL.createObjectURL(image);
    setImageURL(url);

    // Limpiar el objeto URL cuando el componente se desmonte
    return () => URL.revokeObjectURL(url);
  }, [image]);

  return (
    <div className={styles.card}>
      <img src={imageURL} alt={image.name} className={styles.image} />
      <button className={styles.deleteButton} onClick={() => onDelete(image)}>
        Borrar
      </button>
    </div>
  );
};

export default ImageCard;
