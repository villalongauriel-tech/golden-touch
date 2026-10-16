#!/bin/bash
cd "$(dirname "$0")"

echo "======================================================"
echo "    INICIANDO BOT DE WHATSAPP · GOLDEN TOUCH (MAC)    "
echo "======================================================"
echo ""

# Verificar si node está instalado
if ! command -v node &> /dev/null
then
    echo "❌ Node.js no está instalado en tu Mac."
    echo "Instalalo gratis en: https://nodejs.org/ (descargá la versión LTS)"
    echo "Presioná Enter para salir..."
    read
    exit 1
fi

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando componentes por primera vez..."
    npm install
fi

echo "🚀 Iniciando bot de Golden Touch..."
node bot.js
