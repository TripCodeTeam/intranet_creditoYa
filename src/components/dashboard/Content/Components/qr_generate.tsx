import React, { useRef, useState } from "react";
import styles from "../styles/qr.module.css";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import domtoimage from "dom-to-image";

function QrGenerate() {
  const [link, setLink] = useState<string | null>(null);
  const [successGenerate, setSuccessGenerate] = useState(false);
  const qrContainerRef = useRef(null);

  const handleGenerateQr = () => {
    console.log(link);
    try {
      if (link == null || link?.length == 0 || link == "")
        throw new Error("Ingresa el texto a converir");
      setSuccessGenerate(true);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const handleCleanQr = () => {
    setSuccessGenerate(false);
    setLink(null);
  };

  const handleDownloadQr = () => {
    if (!successGenerate) return;

    // Captura el contenido del elemento QR
    const qrContainer = qrContainerRef.current;

    if (qrContainer) {
      const scale = 2;
      domtoimage
        .toPng(qrContainer, { width: 300 * scale, height: 300 * scale })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "YourCodeQr.png";
          link.click();
        });
    }
  };

  return (
    <>
      <h3 className={styles.titleLink}>Digita un link</h3>
      {!successGenerate && (
        <>
          <input
            className={styles.inputLink}
            onChange={(e) => setLink(e.target.value)}
            type="text"
            placeholder="Link"
          />

          <div className={styles.boxBtnGenerate}>
            <button className={styles.btnGenerate} onClick={handleGenerateQr}>
              Generar
            </button>
          </div>
        </>
      )}

      {successGenerate && (
        <>
          <div className={styles.boxBtnGenerate}>
            <button className={styles.btnGenerate} onClick={handleCleanQr}>
              Limpiar
            </button>
          </div>

          <div className={styles.boxBtnGenerate}>
            <button className={styles.btnGenerate} onClick={handleDownloadQr}>
              Descargar
            </button>
          </div>

          <div ref={qrContainerRef}>
            <QRCode value={link as string} size={300} />
          </div>
        </>
      )}
    </>
  );
}

export default QrGenerate;
