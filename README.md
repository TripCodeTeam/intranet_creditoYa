![Logo Credito Ya](https://res.cloudinary.com/dvquomppa/image/upload/v1717654334/credito_ya/cirm9vbdngqyxymcpfad.png)


## Intranet Loan Management System
La **Intranet Loan Management System** es una aplicación de administración de préstamos diseñada para ser utilizada por los empleados y administradores de la empresa. Permite gestionar solicitudes de préstamos, revisar documentos, administrar usuarios, y configurar los términos y condiciones de los préstamos.

## Requisitos Previos
- Node.js (versión 20 o superior)
- MongoDB (versión 4.4 o superior)
- Prisma CLI

## Tecnologías
La aplicación está creada con las siguientes tecnologías:
- React.js
- TypeScript
- Next.js [app Router v13]
- MongoDB
- Prisma CLI

## Configuración

primero clona el repositorio desde tu terminal
```bash
git clone https://github.com/tu_usuario/intranet_creditoYa.git
```
Ingresa a la carpeta
```bash 
cd intranet_creditoYa
```
Instalacion de dependencias
```bash 
npm install
```

## Configuración del Entorno
Crear un archivo .env en la raíz del proyecto con el siguiente contenido:

- ENDPOINT_WS=" Direccion del websocket "
- MONGODB_URI=" Uri de mongo desplegado "
- GOOGLE_EMAIL=" email de donde saldran los correos "
- GOOGLE_APP_KEY=" Generada en Panel de google "
- JWT_SECRET=" Generada en Panel de google "

## Generar cliente de prisma
```bash
npx prisma generate --schema=./src/prisma/schema.prisma
```

## Ejecucion
```bash 
npm run dev
```

## Estructura del proyecto
```bash
├── public              # archivos publicos desde produccion
│   ├── ...    
├── src
│   ├── app      
│   ├── assets          # Carpeta de recursos multimedia
│   ├── classes         # clases para gestionar peticiones a mongo
│   ├── components      # componenentes en react
│   ├── context         # datos disponibles globalmente
│   ├── handlers        # Utilidades y helpers
│   └── lib             # Configuración principal de la aplicación
│   ├── prisma          # Definición del esquema de la base de datos
│       ├── schema.prisma 
|   ├── types           # Definición del tipado
│       ├── schema.prisma
├── .env.local           # Archivo para guardar datos sensibles
├── package.json         # Configuración de NPM
├── README.md            # Documentación de la aplicación
├── tsconfig.json        # Configuracion de ts del proyecto

```
