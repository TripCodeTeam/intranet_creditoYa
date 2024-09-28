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