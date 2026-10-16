# 🌟 Golden Touch · Apple & Plan Canje

Landing page oficial de alta conversión para **Golden Touch**, especialistas en venta de iPhones (Nuevos Sellados y Seminuevos Seleccionados) y Plan Canje en Canning y Zona Sur (Buenos Aires, Argentina).

* 🌐 **Sitio Web en Vivo:** [https://golden-touch-five.vercel.app](https://golden-touch-five.vercel.app)
* 📋 **Guía Completa para IA y Desarrolladores:** [MANUAL_PROYECTO_IA.md](./MANUAL_PROYECTO_IA.md)

---

## 🚀 Arquitectura

* **Stack:** HTML5 Semántico + Tailwind CSS (Play CDN) + Vanilla JavaScript (ES6+).
* **Tipografía:** [Manrope](https://fonts.google.com/specimen/Manrope) (Google Fonts).
* **Hosting:** Vercel (CI/CD automático vinculado a la rama `main`).
* **Diseño:** Dirección visual *Apple Dark Cinematic* con renders oficiales de Apple en [`assets/`](./assets/) y selectores cromáticos interactivos.

---

## 🛠️ Cómo Editar el Proyecto

1. Abrir [`index.html`](./index.html).
2. Para cambiar teléfono, horarios o Instagram, editar el bloque `CONFIG` (línea ~715).
3. Para modificar precios, modelos, cuotas o colores, editar el objeto `CATALOG` (línea ~728).
4. Guardar los cambios y subir a GitHub:
   ```bash
   git add .
   git commit -m "Actualizar datos"
   git push origin main
   ```
## 🔄 Actualización Diaria de Precios de Proveedores (WhatsApp)

El proyecto incluye un motor automatizado que lee los mensajes de WhatsApp de los dos proveedores, compara sus costos, elige el más barato, le suma el margen de Golden Touch y actualiza la web:

1. Pegá el texto del Proveedor 1 en `proveedor1.txt`.
2. Pegá el texto del Canal de Difusión en `proveedor2.txt`.
3. Ejecutá:
   ```bash
   node actualizar_precios.js --push
   ```
4. El script compara los precios en una tabla, actualiza `precios.json`, lo sube a GitHub y Vercel publica la web en 20 segundos.

Consulta el documento [MANUAL_PROYECTO_IA.md](./MANUAL_PROYECTO_IA.md) para detalles completos de diseño, reglas legales de la Ley 24.240 y estructura de mensajes.
