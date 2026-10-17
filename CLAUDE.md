# Golden Touch · Instrucciones de Arquitectura para Claude Code (Main Developer)

Bienvenido, Claude Code. Sos el **Desarrollador Principal (Main Lead)** de este proyecto.
Antigravity y OpenAI Codex actúan como tu **equipo de soporte, revisión técnica, búsqueda de especificaciones y control de calidad**.

---

## 1. Contexto del Proyecto y Reglas Invariables

- **Negocio:** Golden Touch · Venta de iPhones nuevos sellados, seminuevos seleccionados y Plan Canje en Canning, Ezeiza y Zona Sur.
- **Producción en vivo:** https://golden-touch-five.vercel.app (desplegado vía Vercel CI/CD en branch `main`).
- **Repositorio:** https://github.com/villalongauriel-tech/golden-touch
- **Línea Oficial Exclusiva de WhatsApp:** `+54 9 11 2559-1488` (`5491125591488`).
  > ⚠️ **CRÍTICO:** Nunca reemplazar este número por otro ni usar números personales en ningún enlace ni archivo de configuración.

---

## 2. Estructura de Archivos del Proyecto

- `index.html`: Landing page principal (Tailwind CSS, diseño Apple Dark / Liquid Glass, WAI-ARIA accesible).
- `assets/catalogo.js`: Catálogo oficial estructurado en `window.GOLDEN_TOUCH_CATALOG` con grupos (`sellados`, `seminuevos`, `openbox`) y familias (`watch`, `mac`, `ipad`, `audio`, `gaming`, `accesorios`).
- `assets/liquid-glass.css`: Estilos de acabado de vidrio esmerilado, header flotante y ambient lighting.
- `assets/productos/`: Catálogo de 63+ imágenes oficiales de productos.
- `precios.json`: Fuente de precios desacoplada para actualización diaria.
- `actualizar_precios.js`: Comparador de costos entre proveedores y cálculo de márgenes.
- `guardar_cambios.command`: Script de un clic para que Elías (el dueño, en su Mac) suba cambios a GitHub.
- `bot-whatsapp/`: Bot de Baileys para cotizaciones diarias automatizadas por WhatsApp.

---

## 3. Hoja de Ruta Inmediata (Tareas Aprobadas)

### ✅ Tarea 1: Tarjetas de Catálogo Estilo Apple Store (en `index.html` -> `renderCatalogCard`)
1. Reemplazar el menú desplegable `<select>` de capacidades por **Píldoras Interactivas** (`[ 128 GB ]`, `[ 256 GB ]`, `[ 512 GB ]`).
2. Al tocar una píldora, actualizar dinámicamente el precio, la foto del equipo y la disponibilidad de colores.
3. Círculos de colores (*swatches*) con tamaño táctil mejorado y aro dorado (`ring-2 ring-accent`) al estar seleccionados.
4. Unificar la acción en un **único botón principal** `.btn-gold` que diga: **"Cotizar por WhatsApp"**, con mensaje pre-cargado que detalle modelo, capacidad y color elegido.

### ✅ Tarea 2: Simulador Interactivo de Plan Canje (en `index.html` -> `#plan-canje`)
1. Crear una calculadora interactiva con diseño Liquid Glass:
   - Selector de equipo actual (iPhone 11 hasta iPhone 15 Pro Max).
   - Selector de equipo al que quiere subir.
   - Cálculo en tiempo real de valor estimado de toma, costo del nuevo y diferencia a abonar.
2. Botón de acción: *"Validar cotización por WhatsApp"* enviando los datos de la simulación al chat oficial.

### ⏸️ Tarea 3: Zona de Entrega (EN PAUSA)
- En pausa a la espera de confirmación de Elías sobre menciones explícitas de barrios privados.

### ✅ Tarea 4: Botón Flotante de WhatsApp & Pulido Visual
1. Botón flotante permanente (fixed `bottom-6 right-6 z-50`) con ícono de WhatsApp, badge *"En línea · Canning"* y enlace a la línea comercial oficial.
2. Pulido de *ambient rim light* en `assets/liquid-glass.css` para realzar las imágenes de los productos.

---

> 📋 El estado vivo de cada tarea, las decisiones aprobadas, los modelos de cada agente y la bitácora están en **`ESTADO_EQUIPO.md`**. ✅ significa «aprobada para hacer», no «terminada».

## 4. División de Roles del Equipo

- **Claude Code (Vos):** Edición de código, diseño de componentes en `index.html`, maquetado CSS y JavaScript.
- **Antigravity (IDE Agent):** Verificación de builds, control de calidad, diffs de git, soporte de terminal, push a GitHub y monitoreo de Vercel.
- **Codex CLI (`gpt-6.1-sol`):** Análisis de código, sugerencias de algoritmos, refactorización y segunda opinión técnica.
