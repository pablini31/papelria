@echo off
echo ==========================================
echo   SISTEMA POS PAPELERIA POOL OROPEZA
echo   Iniciando para presentacion...
echo ==========================================
echo.

echo [1/3] Verificando MySQL...
net start mysql80
if %errorlevel% neq 0 (
    echo ERROR: MySQL no esta iniciado
    echo Por favor inicia MySQL manualmente
    pause
    exit
)

echo [2/3] Verificando Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado
    pause
    exit
)

echo [3/3] Iniciando servidor de desarrollo...
echo.
echo Abriendo en: http://localhost:3000
echo.
echo CTRL+C para detener el servidor
echo.

start http://localhost:3000
npm run dev