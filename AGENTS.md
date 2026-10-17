# Instrucciones para agentes (Codex, Antigravity y otros)

Antes de actuar en este repositorio, leé en este orden:

1. `CLAUDE.md`: contexto del negocio, estructura de archivos, hoja de ruta y roles.
2. `ESTADO_EQUIPO.md`: estado actual de cada tarea, decisiones aprobadas, qué modelo usar en cada momento y bitácora.

Al terminar una tarea, agregá una línea en la sección **Bitácora** de `ESTADO_EQUIPO.md`. Si te pidieron solo una revisión (sin editar), devolvé tu informe y no modifiques archivos.

Reglas clave (el detalle está en `ESTADO_EQUIPO.md` §1):
- WhatsApp oficial: `5491125591488`. Nunca otro número.
- No hacer push a `main` sin el OK explícito del usuario.
- No tocar `bot-whatsapp/`, `precios.json`, `actualizar_precios.js` ni `proveedor*.txt`.
- No editar `assets/catalogo.js` a mano (lo genera un proceso interno).
- Nunca exponer costos, márgenes ni nombres de proveedores en archivos públicos.
