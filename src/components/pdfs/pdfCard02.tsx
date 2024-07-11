"use client";

import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import skeletonPdf from "@/components/Jsons/promissory.json";
import { DocumentTypes04 } from "@/types/PDFs";

interface PdfViewProps {
  name: string;
  numberDocument: string;
  signature?: string;
}

function Document02({ name, numberDocument, signature }: PdfViewProps) {
  const [jsonData, setJsonData] = useState<DocumentTypes04>(skeletonPdf);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const updatedJsonData = { ...skeletonPdf };

    updatedJsonData.firstParagraph.namePerson = name;
    updatedJsonData.firstParagraph.numberDocument = numberDocument;
    updatedJsonData.signature = signature as string;
    updatedJsonData.numberDocument = numberDocument;

    setJsonData(updatedJsonData);
  }, [name, numberDocument, signature]);

  useEffect(() => {
    const doc = new jsPDF();

    doc.setFontSize(10);
    let y = 8;

    const imgLogo = new Image();
    imgLogo.src = jsonData.logoHeader;

    imgLogo.onload = () => {
      const imgWidth = 70; // Ancho de la imagen en el PDF
      const imgHeight = (imgLogo.height * imgWidth) / imgLogo.width; // Mantener la proporción de la imagen

      // Agregar la imagen de la firma
      doc.addImage(imgLogo, "PNG", 10, y, imgWidth, imgHeight);
      y += 28;

      doc.text(jsonData.numero_pagare.publicText + ` _________________`, 10, y);
      y += 10;

      doc.text(
        jsonData.fecha_vencimiento.publicText + `_________________`,
        10,
        y
      );
      y += 10;

      const firstParagraph = `${jsonData.firstParagraph.namePerson} ${jsonData.firstParagraph.publicfirstText} ${jsonData.firstParagraph.numberDocument} ${jsonData.firstParagraph.publicSecondText}_________________ ${jsonData.firstParagraph.publicFiveText}_________________`;

      doc.text(firstParagraph, 10, y, { maxWidth: 190 });
      y += 15;

      doc.text(jsonData.secondParagraph, 10, y, { maxWidth: 180 });
      y += 68;

      doc.text(jsonData.threeParagraph, 10, y, { maxWidth: 180 });
      y += 25;

      doc.text(jsonData.fourParagraph, 10, y, { maxWidth: 180 });
      y += 85;

      const fiveParagraph = `${jsonData.fiveParagraph.publicFirstText} ${jsonData.fiveParagraph.publicSecondText}_________________`;

      doc.text(fiveParagraph, 10, y, { maxWidth: 190 });
      y += 10;

      const img = new Image();
      img.src = jsonData.signature;

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

        doc.text(`${jsonData.numberDocument}`, docX, docY);

        // Línea de separación debajo del número de documento
        doc.line(docX, docY + 2, docX + 40, docY + 2); // Línea debajo del número de documento
        doc.text("C.C.", docX, docY + 6); // Texto debajo de la línea

        const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(pdfUrl);
      };
    };
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

export default Document02;
