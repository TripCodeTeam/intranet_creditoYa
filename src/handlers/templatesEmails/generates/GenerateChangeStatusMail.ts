export const generateMailChangeStatus = ({
  newStatus,
  employeeName,
  loanId,
}: {
  newStatus: string;
  employeeName: string;
  loanId: string;
}) => {
  return `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");
      * {
        margin: 0;
        font-family: "Roboto", sans-serif;
        font-weight: 400;
        font-style: normal;
      }
    </style>
  </head>
  <body>
    <main style="width: 90%; margin-left: 5%">
      <div style="justify-content: flex-start">
        <img
          style="width: 200px; height: auto"
          src="https://res.cloudinary.com/dvquomppa/image/upload/v1717654334/credito_ya/cirm9vbdngqyxymcpfad.png"
        />
      </div>
      <p style="margin-top: 1em">
        Queremos informarte que el estado de tu solicitud de préstamo ha
        cambiado.
      </p>
      <p style="margin-top: 1em">
        <strong style="font-weight: 500; color: #414141">Nuevo estado: </strong
        >${newStatus}
      </p>
      <p style="margin-bottom: 1em">
        <strong style="font-weight: 500; color: #414141">Aprobado por: </strong
        >${employeeName}
      </p>

      <p>
        Para más detalles, por favor accede aqui a tu
        <a
          style="text-decoration: none; color: #6c6c6c"
          href="https://creditoya.vercel.app/req/${loanId}"
          >cuenta</a
        >
      </p>

      <h5 style="margin-top: 2em; color: #6c6c6c">Saludos,</h5>
      <h4>Equipo de Credito Ya</h4>
    </main>
  </body>
</html>

    `;
};
