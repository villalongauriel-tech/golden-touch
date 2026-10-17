# 🌟 Golden Touch · Apple & Plan Canje

Landing page oficial de alta conversión para **Golden Touch**, especialistas en venta de iPhones (Nuevos Sellados y Seminuevos Seleccionados) y Plan Canje en Canning y Zona Sur (Buenos Aires, Argentina).

* 🌐 **Sitio Web en Vivo:** [https://golden-touch-five.vercel.app](https://golden-touch-five.vercel.app)
* 📋 **Guía Completa para IA y Desarrolladores:** [MANUAL_PROYECTO_IA.md](./MANUAL_PROYECTO_IA.md)

---

## 🚀 Arquitectura

* **Stack:** HTML5 Semántico + Tailwind CSS (Play CDN) + Vanilla JavaScript (ES6+).
* **Tipografía:** [Manrope](https://fonts.google.com/specimen/Manrope) (Google Fonts).
* **Hosting:** Vercel (CI/CD automático vinculado a la rama `main`).
* **Diseño:** Base marfil `#F8F8F6`, texto negro `#07080B` y acentos dorados `#D7AA4A`. Plan Canje y el pie usan grafito `#171A20`. Los textos dorados sobre fondos claros usan un tono más oscuro para facilitar la lectura. Se conservan las imágenes de [`assets/`](./assets/) y los selectores cromáticos interactivos.
* **Tema:** Los colores de texto, superficie y borde se definen con variables `--gt-*` en `index.html`; la clase `theme-dark` los adapta para las secciones oscuras. El catálogo aparece inmediatamente después de la presentación. La descripción visual y el orden de secciones de `MANUAL_PROYECTO_IA.md` corresponden al diseño anterior.
* **Logo en la página:** `brand-lockup` combina el monograma GT con el nombre en texto. `brand-symbol` muestra una ventana del `Logo.jpg` original, sin su marco circular; el archivo de imagen se conserva intacto para el icono del sitio y las vistas compartidas. Si se reemplaza la imagen, habrá que ajustar esa ventana.

---

## 🛠️ Cómo Editar el Proyecto

1. Abrir [`index.html`](./index.html).
2. Para cambiar teléfono, horarios o Instagram, editar el bloque `CONFIG` de `index.html`.
3. Los modelos y precios de venta están en [`assets/catalogo.js`](./assets/catalogo.js), separados del diseño. Cada variante conserva capacidad, batería declarada, colores, SIM cuando se informó y precio de contado en USD. Las condiciones de financiación requieren una confirmación aparte; no se calculan a partir de estos precios.
4. Revisar la versión local. **Solo con una instrucción expresa de Elías para publicar**, guardar los cambios en Git y subir a GitHub:
   ```bash
   git add .
   git commit -m "Actualizar datos"
   git push origin main
   ```
## Integración de los cambios remotos del 16 de octubre de 2026

Se conservan los scripts `actualizar_precios.js`, `guardar_cambios.command` y la carpeta `bot-whatsapp` incorporados en GitHub. No se ejecutaron ni se activó el bot durante esta integración.

El actualizador remoto trabaja con el esquema anterior `precios.json`; no actualiza el catálogo actual `assets/catalogo.js`. Está pendiente adaptar su comparación por condición, capacidad, batería, SIM y color, y aplicar la política aprobada en la carpeta interna. No usarlo para actualizar esta versión de la web. El bot también requiere esa adaptación antes de automatizar precios.

La página conserva el catálogo por variantes y no carga `precios.json`, que incluye costos y márgenes internos. Este archivo, las listas de proveedores y los scripts quedan excluidos del despliegue en Vercel. Esta exclusión no elimina archivos ni historial del repositorio de GitHub.

## Actualizaciones de precios

La carpeta hermana `Gestion de precios` es interna y está fuera de este repositorio. Allí se guardan las listas de proveedores, la regla confirmada y el generador de precios de venta. Nunca copiar costos, ganancias ni nombres de proveedores a `assets/`, al HTML o a archivos enviados a Vercel.

El catálogo ofrece categorías de sellados, seminuevos y open box, un buscador, un selector de variantes y colores por variante. WhatsApp recibe modelo, condición, capacidad, batería informada, SIM informada, color elegido y precio de referencia. Los tonos de los botones de color son orientativos.

## Fotos y familias de productos

Las fotos locales están en `assets/productos/`. `assets/imagenes-productos.json` relaciona cada modelo y color del proveedor con su foto y conserva la URL de origen de Apple o PlayStation. El generador de precios usa ese archivo para incorporar la foto por color a `assets/catalogo.js`; actualizar precios no elimina estas asociaciones.

Al cambiar la configuración se prioriza un color disponible y luego uno a confirmar. Los colores del modelo con fotos registradas permanecen visibles aunque no haya una oferta para esa configuración. Al elegir un color cambian la foto, el precio de ese color y la referencia de proveedor de la consulta. Un color agotado se puede visualizar; se muestra tachado y las consultas de esa selección se deshabilitan. Un color no listado se indica como «Sin disponibilidad confirmada», sin inventar agotamiento. La opción «Consultar colores» permite volver a la consulta general cuando el proveedor no informó colores.

Las imágenes son ilustrativas, no fotos del estado de una unidad seminueva. Si falta una imagen o falla su carga, se muestra un aviso sin sustituirla por otro equipo o color.

El generador compara ofertas equivalentes por color y configuración. Los mensajes «Consultar por este equipo» y «Consultar stock de esta opción» incluyen una referencia pública opaca. La correspondencia con proveedores y precios históricos se conserva exclusivamente en la carpeta interna `Gestion de precios`, fuera del repositorio. Los precios pueden variar entre colores.

Apple Watch, Mac, iPad, AirPods, PlayStation y Accesorios tienen accesos dentro de la misma página. El renderizador admite sus modelos en `GOLDEN_TOUCH_CATALOG.families`. Los 32 modelos de las nuevas categorías ya cuentan con imágenes locales y tarjetas. Mientras las ganancias y fuentes de precios estén pendientes de aprobación, muestran «Precio a consultar» y no incluyen costos ni precios propuestos. El generador conserva estas tarjetas visuales al actualizar los iPhone. CPO se distingue de nuevo sellado. No se importan las promociones ni condiciones comerciales de los proveedores.

La disponibilidad se registra por proveedor y oferta antes de consolidar el catálogo. «Disponible por pedido» requiere confirmación del proveedor, con fecha. No hay sincronización automática con WhatsApp ni publicación automática desde el generador.

La fecha del catálogo corresponde a su actualización, no a una comprobación de stock. La vigencia de las listas y disponibilidad deben confirmarse al cotizar. Las indicaciones del manual del repositorio sobre el antiguo objeto `CATALOG` ya no describen el archivo de precios actual. Las afirmaciones comerciales y legales preexistentes fuera del catálogo siguen pendientes de revisión con Elías.

Las fotos de Watch muestran el color de caja; la correa y el tamaño se confirman según la configuración. El joystick utiliza una foto de referencia de DualSense con una aclaración visible, porque la lista no precisó su versión exacta.

Los selectores muestran solo el círculo y el nombre de cada color. Si la lista declara colores, los demás colores con foto del modelo aparecen cruzados para esa configuración; siguen permitiendo ver la foto, pero no consultar esa selección como oferta. Esto no se etiqueta como agotamiento confirmado. Si el proveedor no declaró colores, se muestra una sola nota «Colores a confirmar» y los colores se pueden elegir como preferencia, sin tacharlos por falta de datos. WhatsApp aclara que esa preferencia está sujeta a confirmación.

## Acabado de vidrio y publicación del 16 de octubre de 2026

Elías autorizó publicar los cambios acumulados de esta sesión. El acabado visual está en `assets/liquid-glass.css`, inspirado en los [materiales de Apple](https://developer.apple.com/design/human-interface-guidelines/materials), adaptado a HTML/CSS. No es el material nativo de iOS: usa transparencias, desenfoque del fondo, reflejos y sombras. Se aplica principalmente a navegación y controles; las tarjetas mantienen fondos legibles y no usan desenfoque por producto.

La navegación flota sobre la página; el selector de familias queda visible dentro del catálogo y se desplaza horizontalmente en pantallas pequeñas. Las transiciones de paneles y entrada de títulos son breves, sin alterar el desplazamiento nativo. Se respeta reducir movimiento y se ofrecen fondos sólidos con contraste aumentado, transparencia reducida o navegadores sin soporte de desenfoque.

Los precios de nuevas categorías siguen como «Precio a consultar» hasta aprobar la ganancia y las fuentes pendientes. Esta publicación no activa mensajes automáticos a proveedores. No se ejecutaron pruebas funcionales.
