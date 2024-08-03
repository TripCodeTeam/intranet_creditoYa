"use client";

import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import skeletonPdf from "@/components/Jsons/card02.json";
import sub_skeletonPdf from "@/components/Jsons/card02-sub.json";

interface PdfViewProps {
  name: string;
  numberDocument: string;
  signature?: string;
}

function Document02({ name, numberDocument, signature }: PdfViewProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const doc = new jsPDF();

    doc.setFontSize(10);
    let y = 8;

    doc.text(skeletonPdf.title, 10, y, { maxWidth: 190 });
    y += 8;

    doc.text(skeletonPdf.firstParagraph + " ______________________", 10, y, {
      maxWidth: 190,
    });
    y += 5;

    doc.text(skeletonPdf.subFirstParagraph, 10, y, {
      maxWidth: 190,
    });
    y += 50;

    doc.text(skeletonPdf.secondParagraph, 10, y, {
      maxWidth: 190,
    });
    (y += 30),
      doc.text(skeletonPdf.thirdParagraph, 10, y, {
        maxWidth: 190,
      });
    (y += 49),
      doc.text(
        skeletonPdf.footer +
          " _________________ a los ___________ dias del mes de ___________ de _____________.",
        10,
        y,
        {
          maxWidth: 190,
        }
      );
    y += 20;

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

      doc.addPage();

      let y2 = 8;

      doc.text(sub_skeletonPdf.title, 10, y2, {
        maxWidth: 190,
      });
      y2 += 10;

      doc.text(
        sub_skeletonPdf.firstParagraph + " ______________________",
        10,
        y2,
        { maxWidth: 190 }
      );
      y2 += 4;

      doc.text(
        sub_skeletonPdf.subFirstParagraph +
          " $ ____________________LETRAS (___________________) " +
          sub_skeletonPdf.TwoSubFirstParagraph +
          "____" +
          sub_skeletonPdf.ThreeSubFirstParagraph +
          " $____________________LETRAS(____________________________________) " +
          sub_skeletonPdf.FourSubFirstParagraph +
          "______" +
          sub_skeletonPdf.FiveSubFirstParagraph,
        10,
        y2,
        { maxWidth: 190 }
      );
      y2 += 53;

      doc.text(sub_skeletonPdf.secondParagraph, 10, y2, { maxWidth: 190 });
      y2 += 30;

      doc.text(sub_skeletonPdf.thirdParagraph, 10, y2, {
        maxWidth: 190,
      });
      y2 += 53;

      doc.text(
        sub_skeletonPdf.footer +
          " ________________ a los _____________________ dias del mes de ______________________ de ____________",
        10,
        y2,
        {
          maxWidth: 190,
        }
      );
      y2 += 20;

      const secondImg = new Image();
      secondImg.src = signature as string;

      secondImg.onload = () => {
        const imgWidth = 50; // Ancho de la imagen en el PDF
        const imgHeight = (img.height * imgWidth) / img.width; // Mantener la proporción de la imagen

        // Agregar la imagen de la firma
        doc.addImage(img, "PNG", 10, y2, imgWidth, imgHeight);

        // Línea de separación debajo de la firma
        const lineY = y2 + imgHeight + 2; // Posición Y de la línea debajo de la firma
        doc.line(10, lineY, 10 + imgWidth, lineY); // Línea debajo de la firma
        doc.text("Firma del solicitante", 10, lineY + 6); // Texto debajo de la línea

        // Agregar el número de documento junto a la firma
        const docX = 70; // Posición x del número de documento junto a la firma
        const docY = y2 + imgHeight / 1; // Centrar verticalmente el número de documento respecto a la firma

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
    };

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(pdfUrl);
  }, [numberDocument, signature]);

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
