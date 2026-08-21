# 🔑 Guía Paso a Paso: Configuración de APIs de IA para Docentes de FP

Esta guía explica de forma clara, sencilla y orientada a docentes cómo obtener y configurar una **clave de API (API Key)** para conectar modelos de inteligencia artificial avanzados (**Google Gemini**, **OpenAI / ChatGPT**, **Anthropic Claude**, **DeepSeek**, **Microsoft Copilot / Azure** y **Groq**) con el **Diseñador de Prompts TCREI** de este kit.

---

## 🛡️ 1. Seguridad y Privacidad Primero (RGPD)

Antes de empezar, es importante conocer cómo gestiona esta aplicación tu clave de API:

- 🔒 **Almacenamiento 100% Local:** Tu API Key se guarda únicamente en la memoria de tu navegador (`localStorage`).
- 🚫 **Sin Servidores Intermedios:** Las peticiones viajan cifradas directamente desde tu navegador a los servidores oficiales del proveedor de IA. Ningún tercero ni creador de este kit puede ver ni almacenar tus claves ni tus prompts.
- 🗑️ **Purgado Inmediato:** Puedes eliminar tu clave en cualquier momento haciendo clic en el botón *"Borrar Claves"* dentro del panel de configuración.

---

## 🌐 2. Google Gemini (Google AI Studio) — ⭐ *Opción Recomendada (Gratuita)*

Google ofrece una **capa gratuita muy generosa** en *Google AI Studio* para su familia de modelos **Gemini 3** (**Gemini 3.7 Flash**, **Gemini 3.6 Flash**, **Gemini 3.5 Flash**, **Gemini 3.5 Flash-Lite** y **Gemini 3.1 Flash-Lite**), ideal para uso docente sin coste.

### Pasos para obtener tu clave:
1. Accede a **[Google AI Studio](https://aistudio.google.com/)**.
2. Inicia sesión con tu cuenta de Google (personal o educativa de Google Workspace).
3. En el menú lateral izquierdo o superior, haz clic en **"Get API key"** (Obtener clave de API).
4. Haz clic en el botón azul **"Create API key"** (Crear clave de API).
5. Selecciona o crea un proyecto de Google Cloud (se crea automáticamente en 1 clic de forma gratuita).
6. Copia la clave generada (empieza por `AIzaSy...`).
7. En el **Diseñador TCREI**, abre el panel **"Configurar API"**, selecciona el proveedor **Google Gemini**, pega tu clave y haz clic en **"Guardar Configuración"** (puedes verificarla con el botón **"Probar Conexión"**).

> 💡 **Modelo recomendado:** `gemini-3.7-flash` (el modelo más capaz y reciente para análisis de código, pedagogía y ejecución de múltiples pasos en Google AI Studio).

---

## 🤖 3. OpenAI (ChatGPT / GPT-4o / GPT-4o-mini)

OpenAI permite conectar modelos como **GPT-4o** y **GPT-4o-mini** mediante su plataforma para desarrolladores.

### Pasos para obtener tu clave:
1. Entra en **[OpenAI Platform](https://platform.openai.com/)**.
2. Regístrate o inicia sesión con tu cuenta de OpenAI/ChatGPT.
3. En el menú de navegación izquierdo, dirígete a **"API keys"** (o accede directamente a `https://platform.openai.com/api-keys`).
4. Haz clic en **"+ Create new secret key"**.
5. Asigna un nombre identificativo (ej: `Kit-IA-Docentes`) y haz clic en **"Create secret key"**.
6. **Copia la clave inmediatamente** (empieza por `sk-proj-...`), ya que OpenAI no volverá a mostrarla por motivos de seguridad.
7. *(Nota de saldo)*: Las cuentas nuevas suelen incluir saldo de prueba. Para uso continuo, OpenAI requiere añadir un saldo prepago mínimo (ej: 5 USD duran miles de auditorías con `gpt-4o-mini`).
8. En el kit, selecciona **OpenAI**, pega la clave y guarda.

> 💡 **Modelo recomendado:** `gpt-4o-mini` (coste ínfimo, excelente rigor de evaluación y gran velocidad).

---

## 🧠 4. Anthropic Claude (Claude 3.5 Sonnet / Claude 3.5 Haiku)

Los modelos de Anthropic destacan por su exquisita calidad de redacción y comprensión de matices pedagógicos complejos.

### Pasos para obtener tu clave:
1. Dirígete a la **[Consola de Anthropic](https://console.anthropic.com/)**.
2. Crea tu cuenta o inicia sesión.
3. En la pantalla principal, haz clic en **"Get API Keys"** o navega a la pestaña de configuración de claves.
4. Haz clic en **"Create Key"**, asigna un nombre (ej: `Kit-Docente-FP`) y pulsa en generar.
5. Copia la clave secreta (empieza por `sk-ant-api03-...`).
6. En el kit, selecciona **Anthropic Claude**, pega tu clave y guarda.

> 💡 **Modelo recomendado:** `claude-3-5-haiku` (rápido y económico) o `claude-3-5-sonnet` (máxima profundidad analítica).

---

## ⚡ 5. DeepSeek (DeepSeek-V3 / DeepSeek-R1)

DeepSeek ofrece modelos de razonamiento lógico y generación de código/texto a precios sumamente asequibles con un rendimiento técnico puntero.

### Pasos para obtener tu clave:
1. Accede a **[DeepSeek Open Platform](https://platform.deepseek.com/)**.
2. Regístrate con tu correo electrónico o cuenta de GitHub/Google.
3. En el panel lateral, accede a la sección **"API Keys"**.
4. Haz clic en **"Create API Key"**, asigna un nombre descriptivo y pulsa en crear.
5. Copia la clave secreta generada (empieza por `sk-...`).
6. En el kit, selecciona **DeepSeek**, pega la clave y guarda.

> 💡 **Modelos disponibles:**
> - `deepseek-chat` (DeepSeek-V3): Modelo general ultra-rápido para análisis de prompts.
> - `deepseek-reasoner` (DeepSeek-R1): Modelo de cadena de pensamiento para auditorías críticas complejas.

---

## 💼 6. Microsoft Copilot / Azure OpenAI

Si tu centro educativo dispone de una suscripción institucional a **Microsoft 365 Educación** o convenio con **Azure for Education**:

### Opciones de acceso:
1. **Azure OpenAI Service:** Si el administrador TIC de tu centro o comunidad autónoma ha desplegado un recurso en Azure OpenAI, solicítale el *Endpoint URL* y la *API Key*.
2. **Uso sin API (Copiar Meta-Prompt):** Si utilizas la versión web de **Microsoft Copilot con protección de datos comerciales** (iniciando sesión con tu cuenta corporativa `@educa...` o `@centro...`):
   - No necesitas configurar ninguna API key.
   - Pulsa el botón **`📋 Copiar Meta-Prompt de Auditoría`** en el Diseñador TCREI.
   - Pégalo directamente en el chat de Copilot en modo *"Preciso"* o *"Equilibrado"*.

---

## 🚀 7. Groq (Llama 3.3 70B) — *Opción Gratuita de Ultra-Alta Velocidad*

Groq ofrece acceso a modelos de código abierto (como **Llama 3.3 70B** de Meta) ejecutados en chips LPU de altísima velocidad, con un plan gratuito muy accesible.

### Pasos para obtener tu clave:
1. Accede a **[Groq Console](https://console.groq.com/)**.
2. Inicia sesión con tu cuenta de Google o GitHub.
3. Dirígete a **"API Keys"** y haz clic en **"Create API Key"**.
4. Copia la clave (`gsk_...`), selecciona **Groq** en el kit y guárdala.

---

## 📊 Tabla Comparativa de Proveedores para Docentes

| Proveedor | Modelo Recomendado | Capa Gratuita | Idoneidad en FP |
| :--- | :--- | :---: | :--- |
| 🌐 **Google Gemini** | `gemini-1.5-flash` | ✅ Sí (Muy generosa) | ⭐⭐⭐⭐⭐ Ideal para empezar sin coste. |
| 🤖 **OpenAI** | `gpt-4o-mini` | ⚠️ Saldo inicial de prueba | ⭐⭐⭐⭐⭐ Gran estándar de evaluación. |
| 🧠 **Anthropic** | `claude-3-5-haiku` | ⚠️ Saldo inicial de prueba | ⭐⭐⭐⭐⭐ Extraordinaria precisión pedagógica. |
| ⚡ **DeepSeek** | `deepseek-chat` | ⚠️ Saldo inicial económico | ⭐⭐⭐⭐ Gran análisis lógico a mínimo coste. |
| 🚀 **Groq** | `llama-3.3-70b-versatile` | ✅ Sí (Con límites por minuto) | ⭐⭐⭐⭐⭐ Respuestas casi instantáneas. |

---

## 💡 ¿No dispones de API Key? Usa el "Meta-Prompt de Auto-Auditoría"

Si no deseas crear cuentas de desarrollador ni configurar claves de API, el Diseñador TCREI incluye el botón:

👉 **`📋 Copiar Meta-Prompt de Auditoría`**

Al hacer clic, se generará una instrucción preconfigurada con la rúbrica de evaluación metodológica y el contenido de tus campos, lista para ser pegada en la versión web gratuita de **ChatGPT**, **Claude.ai**, **Gemini** o **Copilot**.
