# 🎓 Kit de IA para Docentes de Formación Profesional (FP + IA)
### *Marco TCREI para la Creación de Recursos Didácticos y Prácticas de Taller con Inteligencia Artificial*

![Versión](https://img.shields.io/badge/Versión-2.1.0-blue.svg)
![Tecnologías](https://img.shields.io/badge/Tecnologías-HTML5%20|%20TailwindCSS%20|%20JavaScript%20ES6+-emerald.svg)
![Diseño](https://img.shields.io/badge/UI/UX-Glassmorphism%20&%20Dark%20Glow-purple.svg)
![Enfoque](https://img.shields.io/badge/Enfoque-Formación%20Profesional%20y%20Adultos-orange.svg)
![Licencia](https://img.shields.io/badge/Licencia-Educativa%20Abierta-purple.svg)

---

## 📌 Descripción General

El **Kit de IA para Docentes de Formación Profesional** es una plataforma web interactiva de última generación (*single-file application*) concebida como entorno integral de capacitación y herramienta práctica de trabajo para el profesorado de FP y formación de adultos.

Su meta principal es transformar la manera en que los docentes interactúan con modelos de lenguaje e inteligencias artificiales generativas (ChatGPT, Claude, Microsoft Copilot, Gemini, DeepSeek, etc.), dotándolos de un método sistemático denominado **Marco TCREI** (*Tarea, Contexto, Referencias, Evaluar, Iterar*). Este método permite superar el principio **GIGO** (*Garbage In, Garbage Out*) para generar borradores de alta fidelidad: simulaciones de averías en taller, hojas de proceso y despiece, casos clínicos y rúbricas analíticas listas para el aula técnica.

---

## 🎯 Público Objetivo

Este kit ha sido diseñado específicamente para:

1. **Docentes de Formación Profesional Reglada y para el Empleo:**
   - Formación Profesional Básica (FPB).
   - Ciclos Formativos de Grado Medio (CFGM).
   - Ciclos Formativos de Grado Superior (CFGS).
   - Cursos de Especialización y Másteres de FP.
   - Certificados de Profesionalidad y Formación para el Empleo.
2. **Equipos Directivos y Jefaturas de Departamento:** Para homogeneizar estándares de calidad y compartir bancos de prompts validados y versionados.
3. **Formadores de Formadores / Ponentes de Centros de Profesorado (CEP/CPR/CRIF/Cefire):** Para impartir talleres prácticos de 60 minutos con diapositivas, cronómetro integrado y notas para el ponente.

---

## 🚀 Objetivos del Proyecto

- **Optimización del Tiempo Docente:** Reducir hasta en un **60% el tiempo administrativo** en el diseño de situaciones de aprendizaje y actividades de taller.
- **Calidad y Rigor Técnico:** Proporcionar instrucciones precisas contextualizadas al entorno de taller real sin depender de respuestas genéricas.
- **Alineación Normativa y Curricular:** Integrar normativas técnicas y curriculares oficiales (Reales Decretos de títulos, BOE, REBT, INSST, RGPD, normativas de alérgenos, etc.).
- **Soberanía Pedagógica (Regla 80/20):** Establecer que la IA aporta el 80% del borrador inicial, pero el docente aporta el 20% crítico imprescindible (verificación técnica, contexto de aula y firma responsable).
- **Evaluación Resistente a la IA:** Fomentar el traspaso de exámenes puramente memorísticos o teóricos a pruebas de ejecución práctica en vivo, resolución de averías en taller y defensas orales (*viva voce*).

---

## 🧩 El Marco Metodológico TCREI

El núcleo pedagógico del kit reside en la metodología **TCREI**, estructurada en dos fases complementarias que combinan la precisión en el diseño del prompt con el control crítico docente (*Human-in-the-Loop*):

### 📥 Fase 1: Prompt Estructurado de Entrada (T-C-R)
| Pilar | Dimensión | Descripción | Ejemplo de Aplicación |
| :---: | :--- | :--- | :--- |
| **T** | **Tarea & Rol (Task)** | Asigna el **rol/persona experta** a la IA + verbo de acción rector + producto entregable claro y delimitado. | *"Actúa como docente especialista en Electricidad de FP. Diseña una guía de taller de 2 horas sobre localización de averías..."* |
| **C** | **Contexto (Context)** | Nivel del alumnado, titulación, conocimientos previos, duración, espacio físico y equipamiento real del taller. | *"Para alumnos de 1º de Grado Medio en su primera práctica en panel físico de taller con aparamenta real..."* |
| **R** | **Referencias (References)** | Normativa curricular oficial (RD de título, BOE), estándares INCUAL, reglamentos técnicos o manuales del fabricante. | *"Alineado con el Reglamento Electrotécnico de Baja Tensión (RD 842/2002), ITC-BT-18 e ITC-BT-25..."* |

### 🔄 Fase 2: Control Docente y Optimización (E-I)
| Pilar | Dimensión | Descripción | Ejemplo de Aplicación |
| :---: | :--- | :--- | :--- |
| **E** | **Evaluar (Evaluate)** | **Auditoría crítica del docente sobre el output:** verificar ausencia de alucinaciones, rigor en cálculos, viabilidad temporal y seguridad técnica. | *Auditoría docente: Comprobar que no alucine esquemas inexistentes, que las fórmulas de caída de tensión sean exactas y que se respeten las 5 reglas de oro.* |
| **I** | **Iterar (Iterate)** | **Bucle de refinamiento y reprompting:** enviar prompts de seguimiento para ajustar desvíos, inyectar imprevistos reales de taller o adaptar a ACNEAE. | *Prompt de 2ª iteración: "Modifica el ejercicio suponiendo que la mitad de los multímetros del taller están averiados y asigna 4 roles técnicos por equipo."* |

---

## 💻 Estructura y Módulos de la Aplicación

La aplicación se compone de 5 herramientas principales accesibles mediante la barra de navegación superior:

### 1. 🖥️ Presentación Interactiva (Slide Deck Profesional)
- **8 Diapositivas Estructuradas:** Diseñadas para una sesión formativa de 60 minutos (5 bloques temáticos).
- **Barra de Progreso Dinámica:** Indicador visual de avance en la parte superior del visor de diapositivas.
- **Navegación por Puntos (*Dots Navigation*):** Salto directo a cualquier diapositiva con un solo clic.
- **Atajos de Teclado:**
  - `←` / `→` o `Espacio`: Retroceder / Avanzar diapositiva.
  - `F`: Alternar modo Pantalla Completa (*Fullscreen*).
  - `N`: Mostrar / Ocultar notas del ponente.
- **Cronómetro Integrado:** Contador de tiempo para el ponente con inicio, pausa y reinicio.
- **Notas del Ponente (*Speaker Notes*):** Guiones detallados, preguntas dinamizadoras y recomendaciones pedagógicas sobre el ciclo TCREI.

### 2. 📊 Infografía Resumen
- Resumen visual con las metáforas centrales (*Asistente Junior*, *Principio GIGO*, *Soberanía Pedagógica*).
- Desglose interactivo de los 5 pilares TCREI con diferenciación visual de fases (*Entrada T-C-R* y *Human-in-the-Loop E-I*).
- Hoja de ruta en 3 fases para la adopción departamental en centros educativos de FP.

### 3. ✨ Diseñador Dinámico de Prompts TCREI & Banco Versionado
- **Chips de Carga Rápida (Presets):** Carga instantánea de ejemplos en 1 clic (⚡ Electricidad, 🪵 Madera, 🍽️ Hostelería, 💼 Administración, 🩺 Sanidad, 💻 Informática, 🤖 IA & Data).
- **Doble Indicador Heurístico en Tiempo Real:**
  - **Barra 1 — Entrada Estructurada (T-C-R):** Detección semántica de rol docente experto, verbos rectores, entregable, nivel de FP, entorno físico de taller y normativa oficial (RD/BOE/REBT/CTE).
  - **Barra 2 — Control Docente e Iteración (E-I):** Detección de criterios antialucinación, PRL/seguridad de taller, contingencias/averías simuladas y variantes de inclusión/DUA.
- **Auditoría Pedagógica Independiente por Fases con Modelos de IA:**
  - 🟦 **Botón "Auditoría IA (T-C-R)":** Evalúa **exclusivamente la fase de entrada inicial** (sin penalizar ni exigir las fases 4 y 5, que corresponden al control posterior *Human-in-the-Loop*).
  - 🟪 **Botón "Auditoría IA (E-I)":** Evalúa **exclusivamente la guía de auditoría docente y el reprompting** (prevención de riesgos, imprevistos simulados, detección de alucinaciones y atención a la diversidad).
  - Conexión directa (*Bring Your Own Key*) a **Google Gemini** (Gemini 2.5/3.7 Flash), **OpenAI**, **Anthropic Claude**, **DeepSeek** y **Groq** *(Ver guía detallada en [GUIA_CONFIGURACION_APIS.md](file:///home/carlos/AI/Kit_IA_Docentes/GUIA_CONFIGURACION_APIS.md))*.
  - Modal contextual con informe de fortalezas didácticas, riesgos técnicos de taller y botón **"Aplicar Entrada / Control Optimizado"** sin sobreescribir la otra fase.
- **Generadores de Meta-Prompt de Auto-Auditoría (T-C-R y E-I):** Instrucciones específicas para evaluar cada fase en interfaces web sin necesidad de API keys.
- **Botones de Copiado Independientes (Doble Fase):**
  - `Copiar Fases 1-3 (T-C-R)` para enviar la instrucción inicial al modelo de IA.
  - `Copiar Fases 4-5 (E-I)` para auditar y enviar el reprompting una vez obtenido el borrador.

#### 🗃️ Sistema Avanzado de Versionado en "Mi Banco de Prompts":
- **Arquitectura de Versionado Jerárquico (`versions: [...]`):**
  Cada prompt almacena un historial completo con número de versión (`v1`, `v2`, `v3`...), timestamp de creación y **comentario específico de versión** (registro de cambios didácticos o adaptaciones de nivel).
- **Flujo de Guardado Multinivel:**
  - **Nuevo Prompt:** Crea una tarjeta nueva con su versión inicial `v1`.
  - **Añadir Nueva Versión:** Permite seleccionar un prompt destino, filtrando automáticamente por la misma familia profesional, mostrando su identificador único (`ID: tcrei_...`) y previsualizando la versión siguiente (`v(N+1)`).
- **Pop-up Flotante de Previsualización (Hover):**
  Al pasar el ratón por la lista de selección de prompts, se despliega un panel lateral interactivo con el **100% del contenido de la versión activa** (T-C-R, E-I, comentarios y notas).
- **Selector y Recuperación Selectiva en Tarjetas:**
  - Cada tarjeta de la galería cuenta con un menú desplegable de versiones en tiempo real.
  - Botón **`Cargar vX`** para enviar cualquier versión histórica al Diseñador TCREI.
  - Botón **`Hacer Activa`** para cambiar la versión por defecto del prompt.
  - Edición rápida de notas de versión con el botón de lápiz integrado.
- **Modal de Historial de Versiones (Timeline):**
  Línea de tiempo cronológica con todas las iteraciones guardadas, permitiendo consultar cambios, restaurar versiones o eliminar versiones individuales (con protección de versión mínima).
- **Exportaciones e Importaciones con Apéndice Histórico:**
  - **Markdown (`.md`) y Texto Plano (`.txt`):** Exporta la versión activa e incluye una tabla apéndice con el registro histórico de versiones si existen múltiples revisiones.
  - **JSON (`.json`) y Google Drive Sync:** Copias de seguridad portables con soporte completo del árbol de versiones.
  - **Auto-migración transparente:** Compatibilidad retroactiva total con datos anteriores en `localStorage`.

### 4. 🗄️ Banco de Prompts por Familias de FP (28 Familias del Catálogo INCUAL)
Colección completa de plantillas probadas y estructuradas con comparativas de *Prompt Vago vs. Prompt TCREI* cubriendo el **100% de las 28 familias profesionales** oficiales del Catálogo Nacional de Estándares de Competencias Profesionales (INCUAL / Ministerio de Educación):
- **Cobertura Integral (28 Familias):** Actividades Físicas y Deportivas (AFD), Actividades Transversales (ACT), Administración y Gestión (ADG), Agraria (AGA), Artes Gráficas (ARG), Artes y Artesanías (ART), Comercio y Marketing (COM), Edificación y Obra Civil (EOC), Electricidad y Electrónica (ELE), Energía y Agua (ENA), Fabricación Mecánica (FME), Hostelería y Turismo (HOT), Imagen Personal (IMP), Imagen y Sonido (IMS), Industrias Alimentarias (INA), Industrias Extractivas (IEX), Informática y Comunicaciones (IFC), Instalación y Mantenimiento (IMA), Inteligencia Artificial y Data (IAD), Madera, Mueble y Corcho (MAM), Marítimo-Pesquera (MAP), Química (QUI), Sanidad (SAN), Seguridad y Medio Ambiente (SEA), Servicios Socioculturales y a la Comunidad (SSC), Textil, Confección y Piel (TCP), Transporte y Mantenimiento de Vehículos (TMV), Vidrio y Cerámica (VIC).
- **Buscador en Tiempo Real:** Filtrado instantáneo por código de familia (ej: `IAD`, `ELE`, `FME`), título o palabra clave.
- **Filtros por Etiquetas (Pills):** Acceso rápido con selector de familias interactivas.
- **Botón "Cargar en Generador":** Envía cualquier plantilla del banco al *Diseñador de Prompts* para personalizarla al instante.

### 5. 📋 Cheat Sheet & Checklist de Calidad / RGPD
- **Ficha de Bolsillo Recortable (*Cheat Sheet*):** Guía mnemotécnica compacta de referencia rápida del método TCREI.
- **Checklist de Auditoría Docente y RGPD:** 5 puntos clave con barra de progreso de cumplimiento (privacidad RGPD, alucinaciones técnicas, currículo, viabilidad de taller y evaluación práctica).
- **Compatibilidad con Impresión / PDF:** Estilos CSS `@media print` optimizados para generar hojas de mano limpias.

---

## 🛠️ Tecnologías y Arquitectura

El proyecto está diseñado bajo una arquitectura *Zero-Dependency Build* (sin necesidad de compiladores pesados ni dependencias complejas):

- **HTML5 Semántico:** Estructura modular, accesible y optimizada.
- **Tailwind CSS (vía CDN):** Sistema de diseño responsivo con estética *glassmorphism*, fondos con gradientes radiales e iluminación ambiental (*mesh glow*).
- **JavaScript Vanilla (ES6+):** Gestión reactiva de estado (navegación por diapositivas, motor de cálculo de completitud, versionado jerárquico de prompts, filtrado dinámico, cronómetro y notificaciones *toast*).
- **Tipografías Web:** *Plus Jakarta Sans* (encabezados), *Inter* (cuerpo de texto) y *JetBrains Mono* (código y prompts).
- **FontAwesome 6:** Iconografía técnica moderna.
- **CSS Print Optimization:** Reglas específicas para exportar a PDF o imprimir sin elementos de interfaz redundantes.

```
Kit_IA_Docentes/
├── index.html                           # Aplicación web completa interactiva (HTML5 + TailwindCSS + JS)
├── favicon.svg                          # Icono de la aplicación
├── GUIA_CONFIGURACION_APIS.md           # Guía para obtener claves gratuitas de Gemini, OpenAI, Claude, DeepSeek y Groq
├── GUIA_CONFIGURACION_GOOGLE_DRIVE.md   # Guía paso a paso para configurar Google Drive OAuth 2.0 y backup
├── GUIA_CONFIGURACION_GOOGLE_SHEETS.md  # Guía para conectar el formulario de Feedback con Google Sheets y alertas por Email
├── OPCIONES_MINIFICACION_PRODUCCION.md  # Opciones y recomendaciones para producción y empaquetado
├── README.md                            # Documentación técnica y pedagógica completa
```

---

## ⚡ Instalación y Uso

### Feedback y Mejora Continua
El kit incluye un sistema de recogida de opiniones integrado. Para centralizar las propuestas de mejora y errores reportados por los docentes, puedes conectar el formulario de contacto a una hoja de cálculo centralizada utilizando la **[GUIA_CONFIGURACION_GOOGLE_SHEETS.md](GUIA_CONFIGURACION_GOOGLE_SHEETS.md)**. Esto permite recibir notificaciones automáticas por email cada vez que un usuario comparte un prompt exitoso o sugiere una nueva funcionalidad.

### Uso Inmediato (Local)
No requiere instalación de dependencias ni servidores:
1. Clona o descarga este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/Kit_IA_Docentes.git
   ```
2. Abre directamente el archivo `index.html` en cualquier navegador web moderno (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari) o ejecútalo mediante un servidor local ligero:
   ```bash
   python3 -m http.server 8001
   ```

### Despliegue en la Web
Puede alojarse de forma gratuita e instantánea en servicios de hosting estático:
- **GitHub Pages:** Activa *Pages* en la rama `main` apuntando a la raíz `/`.
- **Vercel / Netlify:** Importa el repositorio sin comandos de compilación adicionales.

---

## 🛡️ Consideraciones Éticas y Cumplimiento RGPD

Al utilizar modelos de inteligencia artificial en el entorno educativo de Formación Profesional, este kit promueve las siguientes directrices obligatorias:

1. **Protección de Datos Personales:** Nunca introducir en herramientas de IA comerciales nombres, DNI, datos de salud de alumnos ni información confidencial de empresas de prácticas (FCT / FP Dual).
2. **Verificación de Alucinaciones:** El docente debe auditar siempre fórmulas, códigos de programación, referencias normativas y manuales antes de distribuir el material.
3. **Responsabilidad Legal:** La IA no tiene personería jurídica ni responsabilidad pedagógica; el docente es siempre el autor y garante del recurso didáctico.

---

## 📄 Licencia

Este recurso se distribuye bajo fines formativos y educativos para la comunidad docente de Formación Profesional.
