## Documentación: Script Automatizado de Commits en Git

## Introducción

Este script `.bat` está diseñado para automatizar la creación de commits en proyectos manejados con Git. Sigue la convención **Conventional Commits** para mantener un historial de cambios consistente y legible.

### Características Principales
- Estructura de commits basada en **Conventional Commits**.
- Automatización del proceso de añadir archivos (`git add`).
- Opciones de commit para nuevas funcionalidades, correcciones de errores, cambios en la documentación, entre otros.
- Posibilidad de especificar el alcance del cambio.
- Opción para hacer `git push` después del commit.

## Requisitos
- Tener instalado **Git** en tu sistema.
- Tener un proyecto ya inicializado como repositorio Git (`git init`).
- Sistema operativo: **Windows**.

## Estructura del Commit

El script sigue la estructura de **Conventional Commits**, la cual se compone de tres partes:
```bash 
tipo>(<alcance>): <mensaje breve>

<descripción opcional>

Refs: #<número de issue>
```
### Componentes del Commit:
1. **Tipo**: Define la naturaleza del commit. Los tipos disponibles en este script son:
   - `feat`: Para nuevas funcionalidades.
   - `fix`: Para corregir errores o bugs.
   - `docs`: Cambios en la documentación.
   - `style`: Cambios que no afectan la lógica del código (formato, estilo).
   - `refactor`: Refactorización del código sin cambios en su comportamiento.
   - `test`: Cambios relacionados con pruebas.
   - `chore`: Tareas menores como mantenimiento, configuración, etc.

2. **Alcance** (opcional): Describe qué parte del código o módulo está siendo afectado (ej. `auth`, `UI`, `database`).

3. **Mensaje Breve**: Un resumen claro y conciso del cambio que se está realizando.

---

## Instalación

1. **Descargar el Script**: 
   Crea un archivo `.bat` en la raíz de tu proyecto. Puedes nombrarlo, por ejemplo, `auto_commit.bat`.

2. **Código del Script**:
   Copia y pega el siguiente código en el archivo `.bat`:

```bash 
@echo off
:: script para automatizar la creacion de commits

:: Comprobar si hay cambios en el repositorio
git status --porcelain > null
IF %ERRORLEVEL% == 0 (
    echo No cambios para crear commits.
    exit /b
)

:: Añadir todos los archivos modificados
git add .

:: Solicitar mensaje de commit
set /p commit_message="Introduce el mensaje del commit: "

:: Selección del tipo de commit (feat, fix, docs, etc.)
echo Selecciona el tipo de commit:
echo 1. feat (nueva funcionalidad)
echo 2. fix (arreglo de errores)
echo 3. docs (cambio en documentación)
echo 4. style (cambio en formato o estilo)
echo 5. refactor (refactorización de código)
echo 6. test (añadir o modificar pruebas)
echo 7. chore (tareas menores)
set /p commit_type="Selecciona una opción (1-7): "

if %commit_type% == 1 set type="feat"
if %commit_type% == 2 set type="fix"
if %commit_type% == 3 set type="docs"
if %commit_type% == 4 set type="style"
if %commit_type% == 5 set type="refactor"
if %commit_type% == 6 set type="test"
if %commit_type% == 7 set type="chore"

:: Solicitar el alcance (opcional)
set /p scope="Introduce el alcance del cambio (opcional): "

:: Solicitar mensaje breve del commit
set /p commit_message="Introduce el mensaje del commit: "

:: Construir el mensaje final del commit
if "%scope%"=="" (
    set full_message=%type%: %commit_message%
) else (
    set full_message=%type%(%scope%): %commit_message%
)

:: Crear el commit
git commit -m "%full_message%"

:: Preguntar si se desea empujar los cambios
set /p push_response="¿Deseas empujar los cambios al repositorio remoto? (y/n): "
if /i "%push_response%"=="y" (
    git push
    echo Cambios empujados al repositorio remoto.
) else (
    echo Cambios cometidos pero no empujados.
)

pause
```

## Uso

1. Ejecutar el Script: Abre una ventana de Símbolo del Sistema o PowerShell en la raíz del proyecto y ejecuta el script:
```bash 
./auto_commit.bat
```

2. Selección del Tipo de Commit: El script te pedirá seleccionar el tipo de commit con un número entre 1 y 7. Por ejemplo:
    -   Si estás añadiendo una nueva funcionalidad, selecciona `1` para `feat`. 
    -   Si estás corrigiendo un error, selecciona `2` para `fix`.

3. Alcance del Cambio (opcional): El script solicitará que ingreses el alcance del cambio. Por ejemplo, si el cambio afecta al sistema de autenticación, puedes escribir auth. Si no deseas especificar el alcance, puedes dejarlo vacío.

4. Mensaje del Commit: Luego, el script te pedirá que ingreses un mensaje breve y descriptivo del cambio. Este será el contenido principal del commit.

5. Push Opcional: Al final, el script te preguntará si deseas hacer un git push para enviar los cambios al repositorio remoto. Responde y para confirmar o n para omitir.