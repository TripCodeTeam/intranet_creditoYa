import { xlsxTojson } from "@/handlers/ExceltoJson";
import formidable from "formidable";
import { NextResponse } from "next/server";
import { WorkBook, read } from "xlsx";

export async function POST(req: Request) {
  try {
    const data = await req.formData();

    console.log(data);

    if (!data.get("workbook")) throw new Error("No se cargo el archivo");

    if (data.get("workbook")) {
      const file = data.get("workbook");
    //   console.log(file);

      if (!file || typeof file !== "object" || !("arrayBuffer" in file)) {
        throw new Error("File not found in form data");
      }

      const workbookBuffer = await file.arrayBuffer();
      const workbook: WorkBook = read(workbookBuffer, { type: "buffer" });

    //   console.log(workbook);

      if (!workbook) {
        throw new Error("Ingresa un workbook de excel");
      }
      const jsonBook = xlsxTojson(workbook);
    //   console.log(jsonBook);
      return NextResponse.json({ success: true, data: jsonBook });
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
