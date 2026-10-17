/**
 * =========================================================================
 * GOLDEN TOUCH · MOTOR DE ACTUALIZACIÓN INTELIGENTE DE PRECIOS
 * =========================================================================
 * Compara las listas de WhatsApp de 2 proveedores, elige el costo más bajo,
 * aplica el margen de ganancia de Golden Touch y actualiza `precios.json`.
 *
 * Uso:
 *   node actualizar_precios.js              (lee proveedor1.txt y proveedor2.txt)
 *   node actualizar_precios.js --push       (actualiza y sube a GitHub/Vercel)
 * =========================================================================
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PRECIOS_PATH = path.resolve(__dirname, 'precios.json');
const PROV1_PATH = path.resolve(__dirname, 'proveedor1.txt');
const PROV2_PATH = path.resolve(__dirname, 'proveedor2.txt');

// Márgenes de ganancia oficiales de Golden Touch según manual (USD)
const DEFAULT_MARGINS = {
  'iPhone 16 Pro Max': 80,
  'iPhone 16': 80,
  'iPhone 15 Pro': 80,
  'iPhone 15': 70,
  'iPhone 14': 70,
  'iPhone 13': 70
};

// Modelos monitoreados en la web
const MODELS_MAP = [
  { key: 'iPhone 16 Pro Max', type: 'sellados', patterns: [/16\s*pro\s*max/i, /16\s*pm/i] },
  { key: 'iPhone 16', type: 'sellados', patterns: [/16\s*(plus|normal|regular)?(?!\s*pro)/i] },
  { key: 'iPhone 15', type: 'sellados', patterns: [/15\s*(normal|regular)?(?!\s*pro)/i] },
  { key: 'iPhone 15 Pro', type: 'seminuevos', patterns: [/15\s*pro(?!\s*max)/i] },
  { key: 'iPhone 15', type: 'seminuevos', patterns: [/15\s*(normal|regular|used|usado)?(?!\s*pro)/i] },
  { key: 'iPhone 14', type: 'seminuevos', patterns: [/14\s*(normal|regular)?(?!\s*pro)/i] },
  { key: 'iPhone 13', type: 'seminuevos', patterns: [/13\s*(normal|regular)?(?!\s*pro)/i] }
];

/**
 * Parsea el texto informal de WhatsApp de un proveedor
 */
function parseSupplierList(text, supplierName) {
  const results = {};
  if (!text || !text.trim()) return results;

  const lines = text.split('\n');
  for (const line of lines) {
    const cleanLine = line.trim();
    if (!cleanLine || cleanLine.length < 4) continue;

    for (const modelDef of MODELS_MAP) {
      const matches = modelDef.patterns.some(p => p.test(cleanLine));
      if (!matches) continue;

      // Buscar número de precio (ej: 1250, $1250, USD 1250, 450)
      const priceMatches = cleanLine.match(/(?:usd|\$)?\s*([3-9]\d{2}|1[0-9]{3})(?!\d)/gi);
      if (priceMatches && priceMatches.length > 0) {
        // Tomar el número limpio más razonable para un iPhone (300 a 2000)
        for (const rawPrice of priceMatches) {
          const num = parseInt(rawPrice.replace(/[^\d]/g, ''), 10);
          if (num >= 300 && num <= 2200) {
            // Si ya existe, nos quedamos con el más bajo de esa misma lista
            if (!results[modelDef.key] || num < results[modelDef.key].price) {
              results[modelDef.key] = {
                price: num,
                rawLine: cleanLine,
                supplier: supplierName
              };
            }
          }
        }
      }
    }
  }

  return results;
}

function formatUSD(num) {
  return 'USD ' + num.toLocaleString('es-AR');
}

async function main() {
  console.log('\n======================================================');
  console.log('   GOLDEN TOUCH · ACTUALIZADOR INTELIGENTE DE PRECIOS');
  console.log('======================================================\n');

  // Asegurar que existan los archivos de entrada
  if (!fs.existsSync(PROV1_PATH)) {
    fs.writeFileSync(PROV1_PATH, '# Pegá acá el mensaje de WhatsApp del Proveedor 1\n# Ejemplo:\n16 Pro Max 256 Desert 1270\n16 128 Black 870\n15 128 Blue 740\n14 128 Midnight 510\n13 128 Green 380\n', 'utf8');
  }
  if (!fs.existsSync(PROV2_PATH)) {
    fs.writeFileSync(PROV2_PATH, '# Pegá acá el mensaje del Canal de Difusión del Proveedor 2\n# Ejemplo:\nIPHONE 16 PRO MAX 1260\nIPHONE 16 128 860\nIPHONE 15 PRO 810\nIPHONE 13 370\n', 'utf8');
  }

  const raw1 = fs.readFileSync(PROV1_PATH, 'utf8');
  const raw2 = fs.readFileSync(PROV2_PATH, 'utf8');

  console.log('📖 Leyendo listas de WhatsApp de ambos proveedores...');
  const p1Data = parseSupplierList(raw1, 'Proveedor 1');
  const p2Data = parseSupplierList(raw2, 'Canal Difusión');

  const p1Found = Object.keys(p1Data).length;
  const p2Found = Object.keys(p2Data).length;

  console.log(`✓ Proveedor 1: ${p1Found} modelos identificados`);
  console.log(`✓ Canal Difusión: ${p2Found} modelos identificados\n`);

  // Cargar precios actuales
  let currentPrecios = {};
  if (fs.existsSync(PRECIOS_PATH)) {
    currentPrecios = JSON.parse(fs.readFileSync(PRECIOS_PATH, 'utf8'));
  } else {
    currentPrecios = { sellados: {}, seminuevos: {} };
  }

  currentPrecios.updatedAt = new Date().toISOString();
  currentPrecios.sellados = currentPrecios.sellados || {};
  currentPrecios.seminuevos = currentPrecios.seminuevos || {};

  console.log('----------------------------------------------------------------------------------------');
  console.log(' MODELO                | PROV 1  | CANAL DIF. | ELEGIDO     | COSTO   | MARGEN | VENTA WEB');
  console.log('----------------------------------------------------------------------------------------');

  const updatedList = [];

  for (const modelDef of MODELS_MAP) {
    const key = modelDef.key;
    const type = modelDef.type;
    const p1 = p1Data[key];
    const p2 = p2Data[key];

    let best = null;
    if (p1 && p2) {
      best = p1.price <= p2.price ? p1 : p2;
    } else if (p1) {
      best = p1;
    } else if (p2) {
      best = p2;
    }

    const margin = DEFAULT_MARGINS[key] || 80;

    let costStr = '-';
    let p1Str = p1 ? `$${p1.price}` : '-';
    let p2Str = p2 ? `$${p2.price}` : '-';
    let chosenStr = '-';
    let finalSaleStr = '-';

    if (best) {
      const finalPrice = best.price + margin;
      currentPrecios[type][key] = {
        costoProveedor: best.price,
        proveedorElegido: best.supplier,
        margenUSD: margin,
        precioFinalUSD: finalPrice,
        precioTexto: `Desde ${formatUSD(finalPrice)}`,
        cuotasTexto: 'o en hasta 4 cuotas fijadas'
      };

      costStr = `$${best.price}`;
      chosenStr = best.supplier;
      finalSaleStr = `Desde ${formatUSD(finalPrice)}`;

      updatedList.push({ key, cost: best.price, margin, finalPrice, supplier: best.supplier });
    }

    console.log(
      ` ${key.padEnd(21)} | ${p1Str.padEnd(7)} | ${p2Str.padEnd(10)} | ${chosenStr.padEnd(11)} | ${costStr.padEnd(7)} | +$${margin.toString().padEnd(4)} | ${finalSaleStr}`
    );
  }

  console.log('----------------------------------------------------------------------------------------\n');

  // Guardar archivo precios.json
  fs.writeFileSync(PRECIOS_PATH, JSON.stringify(currentPrecios, null, 2), 'utf8');
  console.log('💾 Archivo `precios.json` actualizado con éxito.');

  // Si se pasó la bandera --push o el usuario quiere desplegar
  const shouldPush = process.argv.includes('--push');
  if (shouldPush) {
    console.log('\n🚀 Subiendo actualización a GitHub y Vercel...');
    try {
      execSync('git add precios.json index.html', { stdio: 'inherit' });
      execSync('git commit -m "precios: actualizar cotizaciones del dia"', { stdio: 'inherit' });
      execSync('git push origin main', { stdio: 'inherit' });
      console.log('\n✅ ¡Listo! Vercel detectó el cambio. La web estará actualizada en 20 segundos.');
      console.log('👉 Ver en vivo: https://golden-touch-five.vercel.app\n');
    } catch (err) {
      console.error('Error al hacer push:', err.message);
    }
  } else {
    console.log('ℹ️ Para publicar estos precios automáticamente a la web, ejecutá:');
    console.log('   node actualizar_precios.js --push\n');
  }
}

main().catch(console.error);
