#!/bin/bash

echo "=========================================="
echo "  SISTEMA POS PAPELERIA POOL OROPEZA"
echo "  Iniciando para presentacion..."
echo "=========================================="
echo ""

echo "[1/3] Verificando MySQL..."
if ! pgrep -x "mysqld" > /dev/null; then
    echo "ERROR: MySQL no esta corriendo"
    echo "Por favor inicia MySQL primero"
    exit 1
fi

echo "[2/3] Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js no esta instalado"
    exit 1
fi

echo "[3/3] Iniciando servidor de desarrollo..."
echo ""
echo "Abriendo en: http://localhost:3000"
echo ""
echo "CTRL+C para detener el servidor"
echo ""

# Abrir navegador (funciona en macOS/Linux)
if command -v open &> /dev/null; then
    open http://localhost:3000
elif command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000
fi

npm run dev