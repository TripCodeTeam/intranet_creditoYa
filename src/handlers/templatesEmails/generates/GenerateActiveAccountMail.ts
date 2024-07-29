export const ActiveAccountMail = ({
  completeName,
  mail,
  password,
}: {
  completeName: string;
  mail: string;
  password: string;
}) => {
  return `
    <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body {
        background: transparent;
      }
    </style>
  </head>
  <body>
    <main>
      <div style="justify-content: flex-start">
        <img
          style="width: 200px; height: auto"
          src="https://res.cloudinary.com/dvquomppa/image/upload/v1717654334/credito_ya/cirm9vbdngqyxymcpfad.png"
        />
      </div>
      <h4 style="margin-top: 1em">
        ${completeName}, Bienvenido a la intranet de Credito Ya.
      </h4>

      <h4>Pasos a seguir para activar tu cuenta</h4>
      <ul>
        <li>
          Ingresa a la Intranet desde la
          <a href="https://intranet-creditoya.vercel.app/">pagina web</a>
        </li>
        <li>
          Ingresa tus crendenciales:
          <ul>
            <li>Correo electronico: ${mail}</li>
            <li>Contraseña (Temporal): ${password}</li>
          </ul>
        </li>
        <li>
          Una vez ingresado, cambia tu contraseña por una propia que tu
          recuerdes
        </li>
      </ul>

      <h5 style="margin-top: 10px">¡Por seguridad no compartas este correo!</h5>

      <h5 style="margin-top: 2em; color: #6c6c6c; margin: 0px">Saludos,</h5>
      <h4 style="margin: 0px;">Equipo de Credito Ya</h4>
    </main>
  </body>
</html>
    `;
};
