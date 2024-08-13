"use client";

import React, { ReactNode } from "react";
import styles from "./modal.module.css";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface modalProps {
  isOpen: boolean;
  link?: string | null;
  onClose: () => void;
  children: ReactNode | null;
}

const Modal = ({ isOpen, onClose, children, link }: modalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modal_overlay} onClick={onClose}>
      <div
        className={styles.modal_content}
        onClick={(e) => e.stopPropagation()}
      >
        {!link ? children : null}

        {link && (
          <iframe
            src={link}
            className={styles.pdfIframe}
            width="100%"
            height="900px"
            style={{ border: 0 }}
            title="PDF Document"
          ></iframe>
        )}

        <button className={styles.close_button} onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default Modal;
