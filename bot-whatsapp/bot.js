/**
 * =========================================================================
 * GOLDEN TOUCH · BOT AUTÓNOMO DE WHATSAPP PARA MAC
 * =========================================================================
 * - Se conecta al WhatsApp personal mediante código QR (se escanea una sola vez).
 * - A las 10:00 AM le escribe automáticamente al Proveedor 1 pidiendo la lista.
 * - Escucha la respuesta del Proveedor 1 y las publicaciones del Proveedor 2.
 * - Compara los precios más baratos, aplica el margen de ganancia de Golden Touch.
 * - Actualiza `precios.json`, hace push a GitHub y Vercel publica la web en 20s.
 * =========================================================================
 */

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const AUTH_DIR = path.resolve(__dirname, 'auth_info_baileys');
const CONFIG_PATH = path.resolve(__dirname, 'config.json');
const PRECIOS_PATH = path.resolve(__dirname, '..', 'precios.json');

// Cargar configuración
let config = {
  horario: { hora: '10', minuto: '00', dias: '1-6' },
  proveedor1: { numeroTelefono: '', mensajeSaliente: 'Hola buen día! ¿Me pasás la lista de precios y cotizaciones de hoy por favor?' },
  proveedor2: { nombreCanalOIdentificador: 'Canal de Difusión' },
  margenesUSD: { defecto: 80 }
};

if (fs.existsSync(CONFIG_PATH)) {
  try {
    config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch (e) {
    console.error('Error al leer config.json:', e.message);
  }
}

// Almacén temporal de mensajes del día
const dailyMessages = {
  date: new Date().toDateString(),
  proveedor1Text: '',
  proveedor2Text: '',
  processed: false
};

const MODELS_MAP = [
  { key: 'iPhone 16 Pro Max', type: 'sellados', patterns: [/16\s*pro\s*max/i, /16\s*pm/i] },
  { key: 'iPhone 16', type: 'sellados', patterns: [/16\s*(plus|normal|regular)?(?!\s*pro)/i] },
  { key: 'iPhone 15', type: 'sellados', patterns: [/15\s*(normal|regular)?(?!\s*pro)/i] },
  { key: 'iPhone 15 Pro', type: 'seminuevos', patterns: [/15\s*pro(?!\s*max)/i] },
  { key: 'iPhone 15', type: 'seminuevos', patterns: [/15\s*(normal|regular|used|usado)?(?!\s*pro)/i] },
  { key: 'iPhone 14', type: 'seminuevos', patterns: [/14\s*(normal|regular)?(?!\s*pro)/i] },
  { key: 'iPhone 13', type: 'seminuevos', patterns: [/13\s*(normal|regular)?(?!\s*pro)/i] }
];

function parseSupplierText(text, supplierName) {
  const results = {};
  if (!text) return results;
  const lines = text.split('\n');
  for (const line of lines) {
    const cleanLine = line.trim();
    if (!cleanLine || cleanLine.length < 4) continue;
    for (const modelDef of MODELS_MAP) {
      if (modelDef.patterns.some(p => p.test(cleanLine))) {
        const priceMatches = cleanLine.match(/(?:usd|\$)?\s*([3-9]\d{2}|1[0-9]{3})(?!\d)/gi);
        if (priceMatches) {
          for (const rawPrice of priceMatches) {
            const num = parseInt(rawPrice.replace(/[^\d]/g, ''), 10);
            if (num >= 300 && num <= 2200) {
              if (!results[modelDef.key] || num < results[modelDef.key].price) {
                results[modelDef.key] = { price: num, supplier: supplierName };
              }
            }
          }
        }
      }
    }
  }
  return results;
}

function updatePricesAndDeploy(sock, userJid) {
  console.log('\n🔄 Procesando cotizaciones recibidas...');
  const p1 = parseSupplierText(dailyMessages.proveedor1Text, 'Proveedor 1');
  const p2 = parseSupplierText(dailyMessages.proveedor2Text, 'Canal Difusión');

  let currentPrecios = { sellados: {}, seminuevos: {} };
  if (fs.existsSync(PRECIOS_PATH)) {
    try { currentPrecios = JSON.parse(fs.readFileSync(PRECIOS_PATH, 'utf8')); } catch (e) {}
  }

  currentPrecios.updatedAt = new Date().toISOString();
  currentPrecios.sellados = currentPrecios.sellados || {};
  currentPrecios.seminuevos = currentPrecios.seminuevos || {};

  let summaryReport = '📱 *Golden Touch · Precios Actualizados Hoy*\n\n';

  for (const modelDef of MODELS_MAP) {
    const key = modelDef.key;
    const type = modelDef.type;
    const d1 = p1[key];
    const d2 = p2[key];
    let best = null;
    if (d1 && d2) best = d1.price <= d2.price ? d1 : d2;
    else if (d1) best = d1;
    else if (d2) best = d2;

    const margin = config.margenesUSD[key] || config.margenesUSD.defecto || 80;

    if (best) {
      const finalPrice = best.price + margin;
      currentPrecios[type][key] = {
        costoProveedor: best.price,
        proveedorElegido: best.supplier,
        margenUSD: margin,
        precioFinalUSD: finalPrice,
        precioTexto: `Desde USD ${finalPrice.toLocaleString('es-AR')}`,
        cuotasTexto: 'o en hasta 4 cuotas fijadas'
      };
      summaryReport += `• *${key}*: USD ${finalPrice} (Costo $${best.price} de ${best.supplier})\n`;
    }
  }

  fs.writeFileSync(PRECIOS_PATH, JSON.stringify(currentPrecios, null, 2), 'utf8');
  console.log('💾 Archivo `precios.json` actualizado.');

  // Push a GitHub
  try {
    const rootDir = path.resolve(__dirname, '..');
    execSync('git add precios.json', { cwd: rootDir });
    execSync('git commit -m "precios: actualizados automaticamente via WhatsApp"', { cwd: rootDir });
    execSync('git push origin main', { cwd: rootDir });
    console.log('🚀 Actualización subida a GitHub y Vercel en vivo.');

    summaryReport += '\n✅ *Publicado en vivo en:* https://golden-touch-five.vercel.app';
    if (sock && userJid) {
      sock.sendMessage(userJid, { text: summaryReport }).catch(() => {});
    }
  } catch (err) {
    console.error('Error al hacer push a GitHub:', err.message);
  }

  dailyMessages.processed = true;
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('\n📲 ESCANEÁ ESTE CÓDIGO QR CON TU WHATSAPP (Solo se hace una vez):\n');
      qrcode.generate(qr, { small: true });
      console.log('Abrí WhatsApp en tu iPhone -> Ajustes -> Dispositivos vinculados -> Vincular un dispositivo\n');
    }

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Conexión cerrada. Reconectando...', shouldReconnect);
      if (shouldReconnect) startBot();
    } else if (connection === 'open') {
      console.log('\n======================================================');
      console.log('✅ WHATSAPP CONECTADO CORRECTAMENTE (Golden Touch)');
      console.log('======================================================');
      console.log(`⏰ Programado para escribirle al Proveedor 1 a las ${config.horario.hora}:${config.horario.minuto} hs.`);
      console.log('👂 Escuchando automáticamente respuestas y canales...');

      // Programar tarea diaria de lunes a sábado a las 10:00 AM
      const cronPattern = `${config.horario.minuto} ${config.horario.hora} * * ${config.horario.dias}`;
      cron.schedule(cronPattern, async () => {
        console.log('\n⏰ 10:00 AM: Disparando pedido diario de cotizaciones...');
        dailyMessages.date = new Date().toDateString();
        dailyMessages.proveedor1Text = '';
        dailyMessages.proveedor2Text = '';
        dailyMessages.processed = false;

        const p1Number = config.proveedor1.numeroTelefono.replace(/[^\d]/g, '');
        if (p1Number && p1Number.length > 8) {
          const p1Jid = `${p1Number}@s.whatsapp.net`;
          await sock.sendMessage(p1Jid, { text: config.proveedor1.mensajeSaliente });
          console.log(`📤 Mensaje enviado al Proveedor 1 (${p1Number}).`);
        } else {
          console.log('⚠️ Número de Proveedor 1 no configurado en config.json');
        }
      });
    }
  });

  sock.ev.on('creds.update', saveCreds);

  // Escuchar mensajes entrantes
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const msg of messages) {
      if (!msg.message) continue;
      const remoteJid = msg.key.remoteJid || '';
      const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

      if (!text) continue;

      const p1Number = config.proveedor1.numeroTelefono.replace(/[^\d]/g, '');

      // 1. Mensaje del Proveedor 1
      if (p1Number && remoteJid.includes(p1Number)) {
        console.log('📩 Respuesta recibida del Proveedor 1!');
        dailyMessages.proveedor1Text = text;
        if (dailyMessages.proveedor2Text && !dailyMessages.processed) {
          updatePricesAndDeploy(sock, remoteJid);
        }
      }

      // 2. Mensaje del Canal o Grupo de Difusión
      if (remoteJid.includes('broadcast') || remoteJid.includes('@g.us') || remoteJid.includes(config.proveedor2.nombreCanalOIdentificador)) {
        // Verificar si contiene palabras clave de iPhones y precios
        if (/iphone|16|15|14|13/i.test(text) && /\d{3,4}/.test(text)) {
          console.log('📢 Cotización detectada en Canal/Grupo de Proveedor 2!');
          dailyMessages.proveedor2Text = text;
          if (dailyMessages.proveedor1Text && !dailyMessages.processed) {
            updatePricesAndDeploy(sock, remoteJid);
          }
        }
      }

      // 3. Comando manual: tu amigo se manda "actualizar web" a sí mismo
      if (msg.key.fromMe && text.toLowerCase().includes('actualizar web')) {
        console.log('⚡ Comando manual recibido: actualizando web...');
        updatePricesAndDeploy(sock, remoteJid);
      }
    }
  });
}

startBot().catch(console.error);
