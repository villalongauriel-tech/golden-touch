#!/bin/bash
cd "$(dirname "$0")"

echo "======================================================"
echo "    SUBIENDO CAMBIOS A LA WEB · GOLDEN TOUCH (MAC)    "
echo "======================================================"
echo ""

# Verificar si git está instalado
if ! command -v git &> /dev/null
then
    echo "❌ Git no está disponible en este momento."
    read -n 1 -s -p "Presioná una tecla para salir..."
    exit 1
fi

echo "📦 Guardando modificaciones..."
git add .

# Hacer commit con fecha y hora actual
FECHA=$(date "+%d/%m/%Y %H:%M")
git commit -m "Actualización desde Mac ($FECHA)" || echo "No había cambios nuevos pendientes."

echo "🚀 Subiendo a GitHub..."
git push origin main

echo ""
echo "======================================================"
echo "✅ ¡LISTO! Cambios subidos con éxito a GitHub."
echo "🚀 La página web se actualiza sola en 20 segundos en:"
echo "👉 https://golden-touch-five.vercel.app"
echo "======================================================"
echo ""
read -n 1 -s -p "Presioná cualquier tecla para cerrar..."
