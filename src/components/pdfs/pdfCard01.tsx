import { useEffect, useState } from "react";
import skeletonPdf from "@/components/Jsons/card01.json";
import { Document01Type } from "@/types/PDFs";
import jsPDF from "jspdf";

interface pdfViewProps {
  numberDocument: string;
  signature: string;
  name: string;
}

export function Document01({ numberDocument, signature, name }: pdfViewProps) {
  const [jsonData, setJsonData] = useState<Document01Type>(skeletonPdf);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const doc = new jsPDF();

    const generatePdf = () => {
      doc.setFontSize(10);
      let y = 15; // Posición Y inicial

      // Primera página
      doc.text(jsonData.firstParagraph, 10, y, { maxWidth: 190 });
      y += 95;

      doc.text(
        jsonData.firstText +
          `__________________________________________,` +
          jsonData.secondText +
          `______________________, ` +
          jsonData.secondParagraph,
        10,
        y,
        { maxWidth: 190 }
      );
      y += 40;

      doc.text(jsonData.inst01, 20, y, { maxWidth: 180 });
      y += 15;

      doc.text(jsonData.inst02, 20, y, { maxWidth: 180 });
      y += 30;

      doc.text(jsonData.inst03, 20, y, { maxWidth: 180 });
      y += 15;

      doc.text(jsonData.inst04, 20, y, { maxWidth: 180 });
      y += 15;

      doc.text(jsonData.inst05, 20, y, { maxWidth: 180 });
      y += 15;

      doc.text(jsonData.finalSecondParagraph, 10, y, { maxWidth: 180 });
      y += 10;

      const img1 = new Image();
      img1.src = signature as string;

      img1.onload = () => {
        const imgWidth = 50;
        const imgHeight = (img1.height * imgWidth) / img1.width;

        doc.addImage(img1, "PNG", 10, y, imgWidth, imgHeight);
        const lineY = y + imgHeight + 2;
        doc.line(10, lineY, 10 + imgWidth, lineY);
        doc.text("Firma del solicitante", 10, lineY + 6);
        doc.text("Nombre: " + name, 10, lineY + 11);
        doc.text("Identificación: " + numberDocument, 10, lineY + 16);

        // Segunda página
        doc.addPage();
        let y2 = 15; // Reiniciar posición Y para la segunda página

        doc.text(jsonData.threeParagraph, 10, y2, { maxWidth: 190 });
        y2 += 35;

        doc.text(jsonData.fourParagraph, 10, y2, { maxWidth: 190 });
        y2 += 15;

        const img2 = new Image();
        img2.src = signature as string;

        img2.onload = () => {
          const img2Width = 50;
          const img2Height = (img2.height * img2Width) / img2.width;

          doc.addImage(img2, "PNG", 10, y2, img2Width, img2Height); // Ajustar posición x aquí
          const lineY2 = y2 + img2Height + 2;
          doc.line(10, lineY2, 10 + img2Width, lineY2); // Ajustar posición x aquí
          doc.text("Firma del solicitante", 10, lineY2 + 6); // Ajustar posición x aquí

          const lineY3 = lineY2 + 15; // Ajustar para ubicar todo el bloque más arriba
          doc.text(numberDocument, 75, lineY2 - 4, { maxWidth: 190 }); // Posicionar encima de la línea
          doc.line(75, 86, 75 + img2Width, 86);
          doc.text("C.C", 75, 86 + 6);

          const pdfBlob = doc.output("blob");
          const pdfUrl = URL.createObjectURL(pdfBlob);
          setPdfUrl(pdfUrl);
        };
      };
    };

    generatePdf();
  }, [jsonData, numberDocument, name, signature]);

  return (
    <>
      {pdfUrl && (
        <iframe
          src={pdfUrl}
          width={"100%"}
          height={"100%"}
          style={{ border: "none", marginTop: "1em", height: "100vh" }}
        ></iframe>
      )}
    </>
  );
}
