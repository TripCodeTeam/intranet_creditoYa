export async function handleImageUpload(imageFile: any) {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onloadend = () => {
      resolve(reader.result); // El resultado es la imagen en base64
    };
    reader.onerror = reject;
    reader.readAsDataURL(imageFile); // Convertir a base64
  });
}
