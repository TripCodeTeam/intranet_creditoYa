import { useEffect, useState } from "react";
import skeletonPdf from "@/components/Jsons/card01.json";
import { Document01Type } from "@/types/PDFs";
import jsPDF from "jspdf";

interface pdfViewProps {
  numberDocument: string;
  signature: string;
  name: string;
}

function Document03({ numberDocument, signature, name }: pdfViewProps) {
  const [jsonData, setJsonData] = useState<Document01Type>(skeletonPdf);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const updateJsonData = { ...skeletonPdf };
  }, []);

  useEffect(() => {
    const doc = new jsPDF();

    doc.setFontSize(10);
    let y = 15;

    doc.text(jsonData.firstParagraph, 10, y, {
      maxWidth: 190,
    });
    y += 90;

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(pdfUrl);
  }, [jsonData]);
}

export default Document03;
