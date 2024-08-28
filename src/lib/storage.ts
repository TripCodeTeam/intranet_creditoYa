import { Storage } from "@google-cloud/storage";
import crediental from "@/components/Jsons/cloud.json";
import DecryptJson from "@/handlers/decryptJson";

export interface PropsUpload {
  file: File;
  userId: string;
  name: string;
  upId: string;
}

export interface PropsDelete {
  type: string;
  userId: string;
  upId: string;
}

export const UploadToGcs = async ({
  file,
  userId,
  name,
  upId,
}: PropsUpload) => {
  try {
    if (!file) throw new Error("No file provided");
    if (file.size < 1) throw new Error("File is empty");

    const EnCredential = crediental.k;
    const EnCrypt = DecryptJson({
      encryptedData: EnCredential,
      password: process.env.KEY_DECRYPT as string,
    });

    const buffer = await file.arrayBuffer();
    const storage = new Storage({
      projectId: process.env.PROJECT_ID_GOOGLE,
      credentials: EnCrypt,
    });
    // console.log(Buffer.from(buffer));

    const fileName = `${name}-${userId}-${upId}.pdf`;

    const bucketName = process.env.NAME_BUCKET_GOOGLE_STORAGE as string;

    await storage
      .bucket(bucketName)
      .file(fileName)
      .save(Buffer.from(buffer))
      .catch((error) => {
        throw new Error(error.message);
      });

    return {
      success: true,
      public_name: fileName,
    };
  } catch (error) {
    console.log(error);
  }
};

export const DeleteFileGcs = async ({ type, userId, upId }: PropsDelete) => {
  try {
    const EnCredential = crediental.k;
    const EnCrypt = DecryptJson({
      encryptedData: EnCredential,
      password: process.env.KEY_DECRYPT as string,
    });

    const storage = new Storage({
      projectId: process.env.PROJECT_ID_GOOGLE,
      credentials: EnCrypt,
    });

    const bucketName = process.env.NAME_BUCKET_GOOGLE_STORAGE as string;

    // Forma el nombre del archivo
    const fileName = `${type}-${userId}-${upId}.pdf`;

    // Obtén una referencia al archivo
    const file = storage.bucket(bucketName).file(fileName);

    // Elimina el archivo
    await file.delete();

    return {
      success: true,
      message: `Archivo ${fileName} eliminado con éxito.`,
    };
  } catch (error) {
    console.error("Error al eliminar el archivo:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
};
