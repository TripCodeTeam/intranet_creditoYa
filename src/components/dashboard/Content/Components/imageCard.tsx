import React from "react";
import styles from "../styles/imagecard.module.css";

interface ImageCardProps {
  image: string;
}

const ImageCard = ({ image }: ImageCardProps) => {
  return (
    <div className={styles.card}>
      <img src={image} alt="Uploaded" className={styles.image} />
    </div>
  );
};

export default ImageCard;
