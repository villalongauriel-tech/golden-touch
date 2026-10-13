# 📱 Guía Oficial del Proyecto · Golden Touch (Para IA y Desarrolladores)

> **Instrucción para la IA:** Este documento describe la arquitectura, reglas de negocio, diseño y configuración de la landing page de **Golden Touch**. Usalo como contexto de referencia para realizar cualquier modificación, adición de modelos, cambio de precios o ajuste de diseño sin romper la estética ni la funcionalidad existente.

---

## 1. Información General del Emprendimiento

* **Marca:** Golden Touch
* **Rubro:** Comercialización de iPhones (Nuevos Sellados de Fábrica y Seminuevos Seleccionados) y servicio de **Plan Canje**.
* **Ubicación operativa:** Canning y Zona Sur (Buenos Aires, Argentina). *Nota: No cuenta con local físico a la calle; opera con entregas pactadas en puntos comerciales y seguros.*
* **Canal de venta principal:** WhatsApp e Instagram.
* **Canal online:** [https://golden-touch-five.vercel.app](https://golden-touch-five.vercel.app)
* **Repositorio en GitHub:** [https://github.com/villalongauriel-tech/golden-touch](https://github.com/villalongauriel-tech/golden-touch)

---

## 2. Arquitectura Técnica

El proyecto fue diseñado de manera **autocontenida, ágil y sin dependencias complejas** (sin React, sin bundlers pesados, sin necesidad de compilar):

| Archivo / Carpeta | Propósito |
|---|---|
| [`index.html`](file:///C:/Users/villa/OneDrive/Proyects/Golde_Touch/index.html) | Toda la landing page: marcado semántico HTML5, estilos CSS, configuración de Tailwind y lógica JavaScript interactiva. |
| [`Logo.jpg`](file:///C:/Users/villa/OneDrive/Proyects/Golde_Touch/Logo.jpg) | Isotipo oficial de Golden Touch (monograma GT dorado en círculo negro con manzana). |
| [`assets/`](file:///C:/Users/villa/OneDrive/Proyects/Golde_Touch/assets/) | Renders oficiales de estudio de Apple con fondo transparente (`16-pro.png`, `16.png`, `15-pro.png`, `15.png`, `14.png`, `13.png`). |
| `.gitignore` / `.vercelignore` | Excluyen archivos internos, documentación privada o `.env` para que no se suban a la web. |

* **Estilos:** Tailwind CSS mediante CDN oficial (`<script src="https://cdn.tailwindcss.com"></script>`) con paleta de colores personalizada integrada en `tailwind.config`.
* **Tipografía:** [Manrope](https://fonts.google.com/specimen/Manrope) vía Google Fonts.
* **JavaScript:** Vanilla JS moderno (ES6+), sin librerías externas.
* **Despliegue (Hosting):** Vercel conectado directamente a la rama `main` del repositorio privado de GitHub. Cada cambio que se hace en `main` se publica automáticamente en internet en segundos.

---

## 3. Identidad Visual (Estética "Apple Dark Cinematic")

* **Fondo Principal (`obsidian`):** `#07080B` (negro OLED profundo).
* **Fondo Secundario (`graphite` / `surface`):** `#111318` / `#151821`.
* **Acento Dorado (`gold`):** `#D7AA4A` (dorado champán premium).
* **Efectos:** Tarjetas con efecto cristal (*glassmorphism*) usando `backdrop-blur-xl bg-surface/50 border border-white/10`.
* **Imágenes de producto:** Renders de estudio de alta definición con fondo transparente, sin marcos blancos ni vectores planos simplistas.

---

## 4. Guía de Modificación Rápida de Datos

Todo el contenido dinámico y de configuración se encuentra dentro de la etiqueta `<script>` al final de [`index.html`](file:///C:/Users/villa/OneDrive/Proyects/Golde_Touch/index.html#L710-L850):

### A. Cambiar Teléfono, Instagram u Horarios
Buscar el bloque `CONFIG`:
```javascript
const CONFIG = {
  WHATSAPP_NUMBER: '5491125591488', // Formato internacional: 549 + código de área + número (sin espacios ni guiones)
  INSTAGRAM_URL: 'https://www.instagram.com/goldentouch.ar',
  HORARIOS: 'Lunes a sábado · 10 a 20 h'
};
```
*(Nota: En el pie de página HTML, línea ~671, también se encuentra el texto visible del teléfono: `+54 9 11 2559-1488`)*.

### B. Modificar o Agregar Modelos al Catálogo
El catálogo se organiza en dos categorías: `sellados` y `seminuevos`.
Para agregar o editar un modelo, modificar el objeto `CATALOG`:
```javascript
{
  model: 'iPhone 16 Pro Max',
  conditionBadge: 'Nuevo Sellado', // o 'Seminuevo Seleccionado'
  image: 'assets/16-pro.png',      // ruta a la imagen en assets/
  conditionDesc: 'Sellado de fábrica en caja · Garantía escrita',
  priceRef: 'Desde USD 1.350',     // precio base de referencia
  installmentRef: 'o en hasta 4 cuotas fijadas',
  storage: ['256 GB', '512 GB', '1 TB'], // capacidades disponibles
  colors: [
    { name: 'Titanio Desierto', hex: '#C4A587' },
    { name: 'Titanio Natural', hex: '#9E968D' },
    { name: 'Titanio Blanco', hex: '#E3E4E5' },
    { name: 'Titanio Negro', hex: '#3C3B37' }
  ]
}
```
* **Muestras de color interactivas:** Al hacer clic en un color dentro de la tarjeta, el botón de WhatsApp se actualiza dinámicamente para enviar la consulta con el color exacto seleccionado por el usuario.

### C. Mensajes Predefinidos de WhatsApp
En el objeto `MESSAGES`:
```javascript
const MESSAGES = {
  general: 'Hola Golden Touch! Quiero cotizar un iPhone.',
  canje: 'Hola Golden Touch! Quiero cotizar mi iPhone actual para Plan Canje. Modelo: ___ · Capacidad: ___ · Batería: ___%',
  modelo: (model, tipo, color) => `Hola Golden Touch! Quiero consultar por el ${model} (${tipo})${color ? ' en color ' + color : ''}. ¿Qué disponibilidad y cotización tienen?`
};
```

---

## 5. Estructura de Secciones de la Landing

1. **Header / Navbar:** Logo oficial, navegación de anclaje accesible y botón directo de cotización por WhatsApp (con texto responsivo "Cotizar" en móvil y "Cotizar por WhatsApp" en escritorio).
2. **Hero:** Título de alto impacto, propuesta de valor, badges de confianza e imagen destacada del iPhone 16 Pro Max.
3. **Plan Canje:** Proceso transparente en 3 pasos (1. Datos del equipo, 2. Cotización justa de mercado, 3. Revisión física y entrega con traspaso de datos).
4. **Catálogo Interactivo:** Pestañas accesibles (WAI-ARIA) para alternar entre "Nuevos Sellados" y "Seminuevos Seleccionados", con selectores de color interactivos y nota legal de stock rotativo.
5. **Transparencia y Garantía:** Protocolo de 6 puntos de control técnico (TrueTone, Face ID, cámaras, iCloud libre, procedencia legítima y comprobante) junto con la tarjeta de garantía legal (3 meses seminuevos, 6 meses sellados según Ley 24.240).
6. **Entregas y Seguridad:** 4 tarjetas con los pilares logísticos en Canning (puntos comerciales acordados, revisión conjunta, migración asistida y pagos seguros).
7. **Preguntas Frecuentes:** Acordeón con animación suave que resuelve dudas sobre compras por pedido, medios de pago, batería real, garantía y entregas.
8. **Footer Institucional:** Datos de contacto, navegación, aviso legal sobre marcas registradas de Apple Inc. y enlace a Defensa del Consumidor.

---

## 6. Reglas Legales y Comerciales de Golden Touch

1. **Cumplimiento de la Ley 24.240 (Defensa del Consumidor en Argentina):**
   * Seminuevos / usados: Garantía legal mínima obligatoria de **3 meses**.
   * Nuevos sellados: Garantía de fábrica mínima de **6 meses**.
2. **Financiación y Precios:**
   * Los precios se indican como valores de referencia en USD o ARS al tipo de cambio del día.
   * No usar frases engañosas como "cuotas fijas en pesos sin interés". Se utiliza la fórmula *"Desde X cuotas fijadas"* o *"Planes a medida"* aclarando que el costo financiero se define según el medio de pago.
3. **Modalidad de Venta:**
   * Stock rotativo y venta principalmente **por pedido**, lo que permite ofrecer cotizaciones competitivas sin sobrecostos de almacenamiento.
4. **Independencia de Marca:**
   * Golden Touch comercializa de forma independiente equipos Apple originales. En el pie de página se incluye el disclaimer legal correspondiente.

---

## 7. Cómo Publicar Cambios

Cualquier cambio realizado en los archivos se publica en producción ejecutando en la terminal:

```bash
git add .
git commit -m "Ajuste de precios y modelos"
git push origin main
```
*Vercel detecta automáticamente el push y actualiza la web en menos de 30 segundos.*
