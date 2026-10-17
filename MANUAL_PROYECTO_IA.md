# 📱 Guía Oficial del Proyecto · Golden Touch (Para IA y Desarrolladores)

> **Instrucción para la IA:** Este documento describe la arquitectura, las reglas de negocio, el diseño y la configuración de la landing page de **Golden Touch**. Usalo como referencia para cualquier modificación sin romper la estética ni la funcionalidad.
> El estado vivo de las tareas, las decisiones aprobadas y la bitácora del equipo IA están en [`ESTADO_EQUIPO.md`](./ESTADO_EQUIPO.md). Las reglas para agentes están en [`AGENTS.md`](./AGENTS.md) y [`CLAUDE.md`](./CLAUDE.md).
> Última actualización: 17/10/2026 (commit `a2af4d3`).

---

## 1. Información General del Emprendimiento

* **Marca:** Golden Touch
* **Rubro:** iPhones nuevos sellados, seminuevos seleccionados y open box, más un servicio de **Plan Canje**. El catálogo también incluye Apple Watch, Mac, iPad, AirPods, PlayStation y accesorios.
* **Ubicación operativa:** Canning, Ezeiza y Zona Sur (Buenos Aires, Argentina). *No tiene local a la calle: las entregas se pactan en puntos comerciales y seguros.*
* **Canal de venta principal:** WhatsApp (línea oficial **+54 9 11 2559-1488**, `5491125591488`) e Instagram.
* **Sitio:** [https://golden-touch-five.vercel.app](https://golden-touch-five.vercel.app)
* **Repositorio:** [https://github.com/villalongauriel-tech/golden-touch](https://github.com/villalongauriel-tech/golden-touch)

---

## 2. Arquitectura Técnica

Sitio estático, sin compilación ni bundlers:

| Archivo / Carpeta | Propósito |
|---|---|
| `index.html` | Toda la landing: marcado semántico, estilos base, configuración de Tailwind y la lógica JavaScript. |
| `assets/catalogo.js` | Catálogo público en `window.GOLDEN_TOUCH_CATALOG`: `groups` (`sellados`, `seminuevos`, `openbox`) y `families` (`watch`, `mac`, `ipad`, `audio`, `gaming`, `accesorios`). **Lo genera la carpeta interna `Gestion de precios`; no editarlo a mano.** |
| `assets/liquid-glass.css` | Acabado de vidrio: header flotante, selector de familias, simulador de Plan Canje, botón flotante de WhatsApp y *rim light* de las fotos. Incluye los modos de transparencia reducida, contraste alto y movimiento reducido. |
| `assets/productos/` | Fotos de producto por modelo y color (en su mayoría JPG con fondo blanco). |
| `assets/imagenes-productos.json` | Relaciona modelo y color con su foto y su URL de origen. |
| `Logo.jpg` | Isotipo oficial (monograma GT). |
| `.vercelignore` | Deja fuera del sitio los archivos internos: precios, proveedores, bot, scripts y documentación del equipo. |

* **Estilos:** Tailwind CSS por CDN (`cdn.tailwindcss.com`), con paleta propia en `tailwind.config` y variables `--gt-*` en `index.html`.
* **Tipografía:** [Manrope](https://fonts.google.com/specimen/Manrope) vía Google Fonts.
* **JavaScript:** Vanilla JS (ES6+) dentro de un IIFE al final de `index.html`.
* **Hosting:** Vercel, conectado a la rama `main` de GitHub. Cada push a `main` se publica automáticamente.
* **Interno, no publicado:** `precios.json`, `actualizar_precios.js`, `proveedor*.txt` y `bot-whatsapp/` usan un esquema anterior y **no alimentan la web**. No usarlos hasta adaptarlos (ver `README.md`).

---

## 3. Identidad Visual

* **Base clara:** marfil `#F8F8F6` con texto negro `#07080B`.
* **Acento dorado:** `#D7AA4A`. Sobre fondos claros, el texto dorado usa un tono más oscuro (`--gt-accent: 121 89 28`) para mantener el contraste.
* **Secciones oscuras:** Plan Canje y el footer usan grafito `#171A20` con la clase `theme-dark`, que redefine las variables `--gt-*`.
* **Vidrio (*Liquid Glass*):** transparencias, desenfoque y reflejos en la navegación, los controles y el simulador. Las tarjetas mantienen fondos legibles.
* **Fotos de producto:** van sobre un escenario `.product-stage` con luz cálida inferior y `mix-blend-mode: multiply`, que funde el fondo blanco de los JPG.
* **Accesibilidad:** WAI-ARIA (pestañas, acordeón, grupo de radio en las píldoras, `aria-live` en precios y simulador), objetivos táctiles de al menos 44 px y modos de transparencia y movimiento reducidos. El contraste AA del simulador se midió en el QA de Antigravity del 17/10/2026.

---

## 4. Guía de Modificación Rápida

Todo está en el `<script>` final de `index.html`, salvo el catálogo.

### A. Teléfono, Instagram y horarios
Bloque `CONFIG`:
```javascript
const CONFIG = {
  WHATSAPP_NUMBER: '5491125591488', // Nunca reemplazarlo por otro número.
  INSTAGRAM_URL: 'https://www.instagram.com/goldentouch.ar…',
  HORARIOS: 'Lunes a sábado · 10 a 20 h'
};
```
El número visible del footer (`+54 9 11 2559-1488`) está escrito en el HTML.

### B. Catálogo y precios
* Los modelos, variantes, colores, fotos, precios y disponibilidad salen de `assets/catalogo.js`, generado por el proceso interno. **Los precios de venta no se escriben en `index.html`.** La única excepción son los rangos de toma del simulador (`TRADE_IN`, ver C).
* `renderCatalogCard` arma cada tarjeta:
  * **Píldoras por variante:** capacidad, batería y SIM arriba, precio abajo. Las listas de batería se muestran como rango («87–89%»). Si dos variantes coinciden en etiqueta y precio, se agrega «Opción N».
  * **Círculos de color:** tocar uno cambia la foto, el precio y la disponibilidad. Los colores tachados están agotados o no figuran en la lista para esa variante: se puede ver su foto, pero el botón de consulta se deshabilita.
  * **Un único botón «Cotizar por WhatsApp»:** el mensaje lleva modelo, condición, capacidad, batería, SIM, color, precio de referencia y la referencia pública `GT-…`.

### C. Simulador de Plan Canje (`#simulador-canje`)
* Rangos de toma en la constante `TRADE_IN` (USD, aprobados el 16/10/2026). Para cambiarlos, editar ahí y registrar la decisión en `ESTADO_EQUIPO.md`.
* El precio del equipo nuevo es el «desde» del catálogo: la oferta no agotada más barata del modelo.
* Diferencia = precio desde del nuevo − máximo de toma, con un mínimo de 0. **Nunca se promete un valor cerrado ni un saldo a favor.**
* Los textos del resultado, la leyenda legal y el mensaje de WhatsApp son literales aprobados: no reformularlos sin autorización.

### D. Botón flotante de WhatsApp (`#wa-float`)
* Ícono de WhatsApp más el texto fijo «Dejanos tu consulta» (decisión del 17/10/2026: sin horario, sin «Canning» y sin emojis). En pantallas de menos de 380 px queda solo el ícono.
* El enlace usa `data-wa="general"`, así que el mensaje inicial sale de `MESSAGES.general`.

### E. Mensajes predefinidos de WhatsApp
Objeto `MESSAGES` (`general`, `canje`, `modelo`), aplicado a todo enlace con `data-wa="…"`.

---

## 5. Estructura de Secciones de la Landing

1. **Header flotante:** logo, navegación de anclaje y botón «Cotizar por WhatsApp».
2. **Presentación (`#inicio`):** propuesta de valor, insignias de confianza e imagen del iPhone 16 Pro Max.
3. **Catálogo (`#catalogo`):** selector de familias fijo al hacer scroll; pestañas Nuevos sellados / Seminuevos / Open box; buscador; tarjetas con píldoras.
4. **Plan Canje (`#plan-canje`, oscura):** proceso en 3 pasos y simulador interactivo.
5. **Transparencia y garantía (`#garantia`):** protocolo de 6 puntos de control y la garantía legal.
6. **Entregas y seguridad (`#zona`):** 4 pilares logísticos. *(La Tarea 3, zona de entrega, está en pausa hasta que Elías confirme si se mencionan barrios privados.)*
7. **Preguntas frecuentes (`#faq`):** acordeón.
8. **Footer (oscuro):** contacto, navegación y avisos legales.
9. **Botón flotante de WhatsApp:** fijo abajo a la derecha en toda la página.

---

## 6. Reglas Legales y Comerciales

1. **Ley 24.240 (Defensa del Consumidor):** garantía mínima de 3 meses en seminuevos y 6 meses en sellados.
2. **Precios:** son referencias de contado en USD; la disponibilidad se confirma al cotizar. Nunca usar «cuotas sin interés»: se habla de «hasta 4 cuotas» o «planes a medida», informando el costo financiero al cotizar.
3. **Plan Canje:** siempre rangos orientativos, con la leyenda de que el valor final se ratifica en la inspección física en mano.
4. **Stock rotativo:** venta principalmente por pedido.
5. **Independencia de marca:** Golden Touch comercializa equipos Apple originales de forma independiente; el disclaimer está en el footer.
6. **Datos internos:** nunca exponer costos, márgenes ni nombres de proveedores en archivos públicos.

---

## 7. Cómo Publicar Cambios

1. Probar en local (por ejemplo, `python -m http.server 5173` y abrir `http://127.0.0.1:5173`).
2. Revisión: Codex revisa el diff y Antigravity hace el QA visual (ver `ESTADO_EQUIPO.md`).
3. **Solo con el OK explícito del usuario o de Elías**, Antigravity hace el commit (agregando los archivos por nombre, nunca con `git add .`) y el push a `main`.
4. Vercel publica en menos de un minuto. Verificar el sitio en vivo y registrar el resultado en la bitácora.

Elías también puede publicar desde su Mac con `guardar_cambios.command`. Ese script hace `git add .`, así que antes conviene revisar que no haya archivos internos nuevos sin ignorar.
