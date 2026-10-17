# Golden Touch · Estado del Equipo IA

> Bitácora compartida entre **Claude Code** (desarrollador principal), **Codex CLI** (análisis y segunda opinión) y **Antigravity** (QA, git y publicación).
> Cada agente lee este archivo antes de actuar y agrega su entrada en la **Bitácora** al terminar.
> Este archivo es interno: no se publica en Vercel (`.vercelignore`).

---

## 1. Reglas comunes (no negociables)

- WhatsApp oficial: `5491125591488` (+54 9 11 2559-1488). Nunca otro número.
- **No hacer push a `main` sin el OK explícito del usuario o de Elías.** Antigravity hace el push solo después de su QA y de esa confirmación.
- Por ahora no tocar `bot-whatsapp/`, `actualizar_precios.js`, `precios.json` ni `proveedor*.txt`. El trabajo se concentra en `index.html` y `assets/liquid-glass.css`.
- Nunca copiar costos, márgenes ni nombres de proveedores a archivos públicos (`assets/`, `index.html`).
- Precios del Plan Canje: siempre **rangos orientativos**, nunca un valor cerrado.
- `assets/catalogo.js` lo genera la carpeta interna `Gestion de precios`; no editarlo a mano.

## 2. Modelos por rol

| Momento | Agente | Modelo | Por qué |
|---|---|---|---|
| Implementación de componentes, HTML/CSS/JS | Claude Code | Opus 5.5 | Desarrollador principal |
| Revisión de diff / bugs de lógica | Codex | `gpt-6.1-sol` · effort `high` | Modelo de trabajo actual; equilibrio costo/profundidad |
| Algoritmos delicados (p. ej. cálculo del simulador) o segunda opinión cuando hay desacuerdo | Codex | `gpt-6-astra` · effort `high` | El modelo más fuerte; usarlo solo cuando hace falta |
| Chequeos rápidos (grep, sintaxis, preguntas puntuales) | Codex | `gpt-6-luna` | Rápido y barato |
| QA visual: layout desktop/mobile, capturas, consola | Antigravity | `gemini-4-argon-high` | Hace falta criterio visual |
| Tareas mecánicas: `git diff`, commit, push, monitoreo de Vercel | Antigravity | `gemini-3.8-flash-high` (su default) | Rápido y suficiente |

Invocación desde la terminal:
- Codex (solo lectura): `codex exec -m gpt-6.1-sol -c model_reasoning_effort="high" -s read-only -C <repo> "<prompt>"`
- Antigravity: `agy -p "<prompt>" --model gemini-4-argon-high --print-timeout 1800s`
  - `--mode auto` no está disponible en esta cuenta; corre en el modo por defecto.
  - Los QA visuales completos tardan más de 15 min: usar un timeout de 30 min o dividir el QA en encargos más chicos. Pedirle que escriba el informe a medida que avanza, no solo al final.

## 3. Hoja de ruta

| Tarea | Estado | Responsable actual |
|---|---|---|
| 1 · Tarjetas estilo Apple Store (píldoras, swatches, CTA único) | 🟢 Publicada (`a2af4d3`) | — |
| 2 · Simulador Plan Canje | 🟢 Publicada (`a2af4d3`) | — |
| 3 · Zona de entrega | ⏸️ En pausa (esperando a Elías) | — |
| 4 · Botón flotante WhatsApp + rim light | 🟢 Publicada (`a2af4d3`) | — |
| Publicación (push a `main`) | 🟢 Publicada · commit `a2af4d3` (2026-10-17) · verificada por Antigravity y Claude | — |

## 4. Decisiones aprobadas por el usuario (16/10/2026)

**Tarea 1 · Píldoras**
- Una píldora por variante. Sellados: `[ 128 GB ]`. Seminuevos: `[ 128 GB · 89% ]`. Con SIM física: `[ 128 GB · 89% · SIM ]`.
- Agregado por Claude (por los datos reales): cada píldora muestra el precio en una segunda línea, porque varios modelos tienen variantes con la misma etiqueta y distinto precio. Si coinciden la etiqueta y el precio, se agrega «Opción N».
- Las listas de batería se muestran como rango: «87%,88%,89%» queda «87–89%».

**Tarea 2 · Simulador Plan Canje**
- Valores de toma (USD, rango según condición y batería):
  - iPhone 11: 180–230 · 11 Pro/Pro Max: 240–300
  - iPhone 12: 260–320 · 12 Pro/Pro Max: 340–420
  - iPhone 13: 370–440 · 13 Pro/Pro Max: 470–580
  - iPhone 14: 440–510 · 14 Pro/Pro Max: 590–720
  - iPhone 15: 530–630 · 15 Pro/Pro Max: 710–890
- El precio del equipo nuevo se toma de `assets/catalogo.js`.
- Texto del resultado: «Valor estimado de toma: entre USD [Min] y USD [Max]» y «Diferencia estimada a abonar: desde USD [Diferencia]».
- Leyenda obligatoria: «* Cotización preliminar orientativa según batería y estado estético. El valor final se ratifica tras la inspección física en mano.»
- Mensaje de WhatsApp: «Hola Golden Touch! Hice la simulación de Plan Canje en la web entregando mi [Modelo Actual] por un [Modelo Nuevo]. La diferencia estimada fue de aprox. USD [Diferencia]. ¿Me confirman cotización para coordinar?»

**Tarea 4 · Badge del botón flotante (hora argentina, UTC−3)**
- De lunes a sábado, de 10:00 a 20:00: `🟢 En línea · Canning`.
- Fuera de ese horario y los domingos: `🌙 Dejanos tu consulta · Canning`.

**Otros**
- Los costos en `precios.json` dentro del historial de git se limpiarán más adelante; por ahora no se tocan.

## 5. Pendientes y observaciones abiertas

- Tarea 3 (zona de entrega): en pausa hasta que Elías confirme si se mencionan barrios privados.
- Más adelante: limpiar del historial de git los costos de `precios.json` (decisión del usuario, sin fecha).

## 6. Bitácora

Formato: `AAAA-MM-DD · Agente (modelo) · qué se hizo · resultado / próximo paso`.

- 2026-10-16 · Claude Code (Opus 5.5) · Tarea 1 en `index.html` (`renderCatalogCard`): `<select>` reemplazado por píldoras con rol de radio y navegación con flechas; círculos de color de 28 a 36px con aro `ring-2 ring-accent ring-offset-2`; un único botón `.btn-gold` «Cotizar por WhatsApp» (se quitó «Consultar stock»); precio y botón alineados al pie de la tarjeta. Probado en Chrome desktop en `http://127.0.0.1:5173`: 31 tarjetas de iPhone y las familias funcionan, sin errores de consola. Falta: QA en mobile (Antigravity) y review del diff (Codex). Sin commit.
- 2026-10-16 · Codex (gpt-6.1-sol, high, solo lectura) · Review de la Tarea 1: 63 productos y 167 variantes probados con DOM simulado. Un hallazgo P2: tocar la píldora activa reiniciaba el color elegido (y con él el precio y el mensaje de WhatsApp). Sin otras regresiones.
- 2026-10-16 · Claude Code (Opus 5.5) · Corregido el P2 de Codex: `selectVariant` ignora el índice ya activo (`variantIndex` arranca en −1). Verificado con jsdom: iPhone 15 · 128 GB · Rosa · USD 790 se mantiene al volver a tocar la píldora. Esperando el QA visual de Antigravity.
- 2026-10-16 · Antigravity (gemini-4-argon-high) · QA visual de la Tarea 1 en 390, 768 y 1440 px: OK. Las píldoras hacen wrap sin overflow, el aro dorado se ve, los botones quedan alineados al pie y no hay errores de consola ni de red. Dos observaciones menores pendientes: (a) el resumen de batería muestra el texto crudo («91%,92%») en lugar del rango de la píldora; (b) en las tarjetas Mac sin colores aparece «Elegí un color» sin ningún círculo. Próximo paso: Claude corrige (a) y (b) y sigue con la Tarea 2.
- 2026-10-17 · Claude Code (Opus 5.5) · Revisión de sesión: los dos agentes habían terminado bien (los informes están arriba); solo se había caído el servidor local, que se volvió a levantar en `http://127.0.0.1:5173`. Corregidas las observaciones (a) y (b): el resumen y el mensaje de WhatsApp usan el rango de batería, y «Elegí un color» se oculta cuando no hay círculos.
- 2026-10-17 · Claude Code (Opus 5.5) · Tarea 2 implementada en `#plan-canje`. El simulador `#simulador-canje` reemplaza la caja «¿Querés saber cuánto vale tu iPhone hoy?» y mantiene un enlace `data-wa="canje"` para modelos fuera de la lista. Equipo actual: 15 modelos del 11 al 15 Pro Max (cada Pro y Pro Max comparten rango). Equipo nuevo: 31 modelos de iPhone de `catalogo.js` agrupados por condición, con precio «desde» igual a la oferta no agotada más barata. Diferencia = precio desde del nuevo − máximo de toma. Si da ≤ 0, se muestra «A confirmar» y el mensaje de WhatsApp dice que el equipo podría cubrir el valor, sin prometer saldo a favor. Estilo `.trade-sim` / `.trade-result` en `liquid-glass.css`, con modo de transparencia reducida. Verificado con jsdom: estados vacío, parcial y completo, mensaje con el número oficial, sin errores. Pendiente: review de Codex y QA visual de Antigravity.
- 2026-10-17 · Codex (gpt-6.1-sol, high) · Review de la Tarea 2: rangos, leyenda, precios mínimos (31 de 31) y accesibilidad correctos; sin regresiones en la Tarea 1. Un hallazgo P2: con diferencia ≤ 0 (104 de 465 combinaciones) se alteraban los textos aprobados («A confirmar» y otro mensaje de WhatsApp).
- 2026-10-17 · Antigravity (gemini-4-argon-high) · QA visual de la Tarea 2 en 390, 768 y 1440 px: OK. Sin overflow, selects legibles en tema oscuro, contraste AA (dorado 5.2–6.7:1, atenuado 7.9–11:1), 0 errores. La Tarea 1 sigue OK.
- 2026-10-17 · Claude Code (Opus 5.5) · Aplicado el P2 de Codex: la diferencia se limita a 0 y se muestra «desde USD 0» con el mensaje de WhatsApp literal aprobado, más una nota aclaratoria («Tu equipo podría cubrir el valor del nuevo…»). Verificado con jsdom. Tarea 2 cerrada; sigue la Tarea 4.
- 2026-10-17 · Claude Code (Opus 5.5) · Tarea 4 implementada. (1) Botón flotante `#wa-float` (`fixed bottom-6 right-6 z-50`, respeta el safe-area) con `data-wa="general"`, vidrio claro e ícono en verde WhatsApp. El badge se calcula con `Intl` y la zona `America/Argentina/Buenos_Aires`, se recalcula cada minuto y actualiza también el `aria-label`. En pantallas de menos de 380 px queda solo el ícono. Verificados los límites del horario: sábado 9:59 cerrado, 10:00 abierto, 19:59 abierto, 20:00 cerrado, domingo cerrado. (2) Rim light: clase `.product-stage` en el marco de foto de `renderCatalogCard`, con luz cálida inferior y borde de luz interior; `mix-blend-mode: multiply` porque 87 de 100 fotos son JPG con fondo blanco; al pasar el mouse sobre la tarjeta se intensifica la luz y la foto escala 3%. Incluye modos de transparencia reducida y movimiento reducido. Pendiente: review de Codex y QA visual de Antigravity.
- 2026-10-17 · Codex (gpt-6.1-sol, high) · Review previa a publicar (Tarea 4 + diff completo): horario (336 casos), textos, número oficial, rim light, modos reducidos y ajuste de USD 0 correctos; no hay costos ni proveedores expuestos. Dos P2: (1) `CLAUDE.md`, `README.md` y `MANUAL_PROYECTO_IA.md` siguen sin excluirse en `.vercelignore` (decide el usuario); (2) `.wa-float:hover` tapaba el aro de foco del teclado.
- 2026-10-17 · Claude Code (Opus 5.5) · Corregido el P2 (2): `body .wa-float:focus-visible` con outline dorado propio.
- 2026-10-17 · Antigravity (gemini-4-argon-high) · El primer QA de la Tarea 4 se cortó por timeout (15 min) sin informe; no modificó el repo. Aviso: `--mode auto` no está disponible en esta cuenta y corre en el modo por defecto. Se retomó la conversación (`agy -c`) para cerrar el informe.
- 2026-10-17 · Antigravity (gemini-4-argon-high) · La segunda corrida también se cortó por timeout (10 min) sin informe escrito, pero dejó 21 capturas en `~/.gemini/antigravity-cli/brain/5a6a4a65-…/scratch/`.
- 2026-10-17 · Claude Code (Opus 5.5) · Revisé esas capturas. Rim light sin rectángulos blancos en JPG ni PNG, las dos variantes del badge OK (11 h «🟢 En línea», 21 h «🌙 Dejanos tu consulta»), simulador OK. Dos problemas en 390 px, ya corregidos: (1) el botón flotante tapaba la última línea del aviso legal del footer → `padding-bottom: 7.5rem` en el footer; (2) el texto de «Validar cotización por WhatsApp» quedaba alineado a la izquierda al partirse → `text-center`. Verificado con puppeteer: el botón queda 38 px por debajo del último texto, outline de foco `solid 3px`, 0 errores de consola. Tarea 4 cerrada. Las Tareas 1, 2 y 4 están listas para el push cuando el usuario lo apruebe.
- 2026-10-17 · Usuario · Aprobó el push a `main` y excluir `CLAUDE.md`, `README.md` y `MANUAL_PROYECTO_IA.md` del despliegue. Claude agregó los tres a `.vercelignore` (siguen en GitHub; solo dejan de servirse en el sitio). El commit y el push quedan a cargo de Antigravity (`gemini-3.8-flash-high`).
- 2026-10-17 · Antigravity (gemini-3.8-flash-high) · Commit a2af4d3 y push a `main`. Deploy verificado en producción (https://golden-touch-five.vercel.app/): 'simulador-canje' y 'wa-float' presentes (200 OK); /CLAUDE.md y /ESTADO_EQUIPO.md protegidos (404 Not Found).
- 2026-10-17 · Claude Code (Opus 5.5) · Documentación sincronizada con lo publicado: `MANUAL_PROYECTO_IA.md` reescrito (arquitectura actual, identidad marfil/dorado/grafito, cómo modificar el catálogo, el simulador y el badge, orden de secciones y flujo de publicación); en `CLAUDE.md`, la descripción del diseño corregida y las Tareas 1, 2 y 4 marcadas como 🟢 publicadas; en `README.md`, eliminadas las referencias a la UI y al manual anteriores. Ninguno de estos archivos se publica en el sitio (`.vercelignore`). Sin commit: esperando el OK del usuario.
- 2026-10-17 · Codex (gpt-6-luna, medium) · Chequeo de la documentación contra el código: nombres, IDs, orden de secciones y exclusiones OK. Encontró 6 imprecisiones; Claude corrigió 4 (precios en `index.html`, colores tachados, alcance del contraste AA, «referencia de proveedor» en el README). Las 2 de `CLAUDE.md` (líneas 35 y 44) son el texto original de la hoja de ruta aprobada y se dejan como están. Sin commit: esperando el OK del usuario.
- 2026-10-17 · Usuario · Aprobó el commit y el push de la documentación. Tarea 3: Elías todavía no respondió sobre los barrios privados; sigue en pausa.
