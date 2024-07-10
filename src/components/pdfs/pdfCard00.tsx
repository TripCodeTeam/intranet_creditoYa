import React, { useEffect, useState } from "react";
import skeletonPdf from "@/components/Jsons/AboutLoan.json";
import { DocumentTypes00, DocumentTypes04 } from "@/types/PDFs";
import jsPDF from "jspdf";

interface PdfViewProps {
  numberDocument: string;
  entity: string;
  numberBank: string;
  signature?: string;
}

function Document00({
  numberDocument,
  signature,
  numberBank,
  entity,
}: PdfViewProps) {
  const [jsonData, setJsonData] = useState<DocumentTypes00>(skeletonPdf);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const updatedJsonData = { ...skeletonPdf };

    updatedJsonData.optionAccount.entityAccount = entity;
    updatedJsonData.optionAccount.numberAccount = numberBank;
    setJsonData(updatedJsonData);
  }, []);

  useEffect(() => {
    const doc = new jsPDF();

    doc.setFontSize(10);
    let y = 15;

    doc.text(jsonData.TitlePrevExplain + jsonData.prevExplain, 10, y, {
      maxWidth: 190,
    });
    y += 90;

    doc.text(
      jsonData.headerTitle + " " + jsonData.firstExplainText + " ",
      10,
      y,
      {
        maxWidth: 190,
      }
    );
    y += 167;

    doc.text(jsonData.secondTitle, 10, y, { maxWidth: 190 });
    y += 10;

    doc.setFontSize(13)

    doc.text(
      "Cuenta Ahorros " +
        ` Nro. Cuenta ${jsonData.optionAccount.numberAccount}` +
        ` Entidad: ${jsonData.optionAccount.entityAccount}`,
      10,
      y,
      {
        maxWidth: 190,
      }
    );
    y += -265;

    doc.setFontSize(10)

    doc.addPage();

    doc.text(jsonData.threeTitle, 10, y, {
      maxWidth: 190,
    });
    y += 5;

    doc.text(jsonData.justifyText, 10, y, {
      maxWidth: 190,
    });
    y += 15;

    doc.text(jsonData.numberOnce + jsonData.textOnce, 10, y, {
      maxWidth: 190,
    });
    y += 25;

    doc.text(jsonData.finalTitle, 10, y, {
      maxWidth: 190,
    });
    y += 6;

    doc.text(jsonData.subFinalText, 10, y, {
      maxWidth: 190,
    });
    y += 65;

    doc.text(jsonData.finalText, 10, y, {
      maxWidth: 190,
    });
    y += 10;

    const img = new Image();
    img.src = signature as string;

    img.onload = () => {
      const imgWidth = 50; // Ancho de la imagen en el PDF
      const imgHeight = (img.height * imgWidth) / img.width; // Mantener la proporción de la imagen

      // Agregar la imagen de la firma
      doc.addImage(img, "PNG", 10, y, imgWidth, imgHeight);

      // Línea de separación debajo de la firma
      const lineY = y + imgHeight + 2; // Posición Y de la línea debajo de la firma
      doc.line(10, lineY, 10 + imgWidth, lineY); // Línea debajo de la firma
      doc.text("Firma del solicitante", 10, lineY + 6); // Texto debajo de la línea

      // Agregar el número de documento junto a la firma
      const docX = 70; // Posición x del número de documento junto a la firma
      const docY = y + imgHeight / 1; // Centrar verticalmente el número de documento respecto a la firma

      doc.text(numberDocument, docX, docY);

      // Línea de separación debajo del número de documento
      doc.line(docX, docY + 2, docX + 40, docY + 2); // Línea debajo del número de documento
      doc.text("C.C.", docX, docY + 6); // Texto debajo de la línea

      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);
    };

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(pdfUrl);
  }, [jsonData]);
  return (
    <>
      {pdfUrl && (
        <iframe
          src={pdfUrl}
          width={"100%"}
          height={"100%"}
          style={{ border: "none", marginTop: "1em", height: "100dvh" }}
        ></iframe>
      )}
    </>
  );
}

export default Document00;
