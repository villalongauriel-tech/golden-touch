# 🍏 Guía para Activar el Bot de WhatsApp en tu Mac (Golden Touch)

Esta herramienta automatiza por completo las cotizaciones diarias de tus proveedores:
1. Le manda un mensaje al **Proveedor 1** todas las mañanas a las 10:00 AM pidiéndole la lista.
2. Lee la respuesta del Proveedor 1 y la lista del **Canal de Difusión (Proveedor 2)**.
3. Compara cuál es el precio más barato entre ambos para cada modelo de iPhone.
4. Le suma tu margen de ganancia habitual (entre $70 y $80 USD).
5. Actualiza tu página web y te manda un mensaje de WhatsApp avisándote: *"✅ Precios de hoy actualizados en vivo"*.

---

## 📋 Pasos para activarlo en tu Mac (Se hace una sola vez)

### 1. Requisito previo (Solo si no lo tenés)
Tenés que tener instalado **Node.js** en tu Mac.  
Si no lo tenés, descargalo gratis en 1 minuto desde 👉 **[nodejs.org](https://nodejs.org/)** (elegí la versión que dice **LTS** e instalala como cualquier app).

### 2. Configurar el número de tu Proveedor 1
Abrí el archivo `bot-whatsapp/config.json` con cualquier editor de texto o el Bloc de notas de Mac:
* En `"numeroTelefono"`, poné el número de WhatsApp de tu Proveedor 1 con código de país y área (ej: `"54911xxxxxxxx"`).
* Guardá el archivo.

### 3. Iniciar el Bot (Doble Clic)
1. En Finder, andá a la carpeta `bot-whatsapp/`.
2. Hacé **doble clic en el archivo `iniciar_mac.command`**.
   *(Si tu Mac te dice "No se puede abrir porque proviene de un desarrollador no identificado", hacé clic derecho sobre el archivo ➡️ seleccioná **Abrir** ➡️ y confirmá en **Abrir**)*.
3. Se abrirá una ventana negra (la Terminal) y verás un **código QR**.

### 4. Vincular tu WhatsApp
1. Abrí WhatsApp en tu iPhone.
2. Andá a **Ajustes ➡️ Dispositivos vinculados ➡️ Vincular un dispositivo**.
3. Apuntá la cámara de tu teléfono al código QR de la pantalla de tu Mac.
4. ¡Listo! Te saldrá el mensaje:  
   `✅ WHATSAPP CONECTADO CORRECTAMENTE (Golden Touch)`.

---

## 🎯 ¿Cómo funciona a partir de ahí?

* **Todos los días a las 10:00 AM:** El bot se despierta solo, le escribe a tu Proveedor 1, lee el canal de difusión, compara los precios, actualiza tu web y te avisa a tu celular.
* **Comando manual:** Si en cualquier momento del día querés forzar una actualización sin esperar a las 10:00 AM, podés mandarte un WhatsApp a vos mismo diciendo: `actualizar web`, y el bot procesa todo en el acto.
