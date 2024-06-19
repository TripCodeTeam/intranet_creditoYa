const generateEmailTemplate = ({
  reqId,
  name,
  payId,
}: {
  reqId: string;
  name: string;
  payId: string;
}): string => {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Comprobante de pago</title>
      </head>
      <body>
        <h1>Comprobante de Pago</h1>
        <p></p>
        <h3>Gracias por tu pago ${name}. Valoramos tu compromiso y confianza en nuestros servicios.</h3>
        <a href="https://creditoya.vercel.app/req/${reqId}/payments">Ingresa a la aplicacion web y verifica tu pago</a>

        <h5>Id prestamo</h5>
        <p>${reqId}</p>

        <h5>Cantidad pagada</h5>
        

        <!-- Asegúrate de reemplazar 'url_de_tu_imagen' con la URL real de tu imagen -->
        <img src="url_de_tu_imagen" alt="Descripción de la imagen" />
      </body>
      </html>
    `;
};

export default generateEmailTemplate;
