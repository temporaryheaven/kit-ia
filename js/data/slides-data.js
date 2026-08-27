/**
 * =============================================================================
 * DIAPOSITIVAS Y CONTENIDO PEDAGÓGICO DE LA PRESENTACIÓN (v1.3.0)
 * =============================================================================
 */

export         const slides = [
            {
                title: "El Poder del Prompting: IA Aplicada a la FP",
                subtitle: "Dominando el Marco TCREI para Transformar tu Práctica Docente",
                timeTag: "Bloque 1 • 00:00 - 00:10 (10 Min)",
                badge: "Introducción y Mentalidad",
                vectorSvg: `
                    <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-64 h-64 text-sky-400">
                        <path d="M 120 40 C 80 40 50 70 50 110 C 50 140 70 165 95 175 L 95 195 L 145 195 L 145 175 C 170 165 190 140 190 110 C 190 70 160 40 120 40 Z" stroke="currentColor" stroke-width="2" fill="#0284c7" fill-opacity="0.1"/>
                        <circle cx="120" cy="110" r="25" stroke="#f59e0b" stroke-width="2"/>
                        <line x1="120" y1="85" x2="120" y2="135" stroke="#f59e0b" stroke-width="1.5"/>
                        <line x1="95" y1="110" x2="145" y2="110" stroke="#f59e0b" stroke-width="1.5"/>
                        <circle cx="120" cy="30" r="3" fill="#38bdf8"/>
                    </svg>
                `,
                content: `
                    <div class="grid lg:grid-cols-12 gap-8 items-center h-full">
                        <div class="lg:col-span-7 space-y-5">
                            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white leading-tight">
                                Uso Efectivo de Inteligencia Artificial en Formación Profesional
                            </h2>
                            <p class="text-slate-300 text-sm sm:text-base leading-relaxed">
                                Aprende a pasar de respuestas genéricas e inútiles a generar casos prácticos de taller, rúbricas analíticas de evaluación y simulaciones técnicas reales en cuestión de segundos.
                            </p>
                            <div class="p-5 bg-gradient-to-r from-amber-950/40 to-slate-900 border-l-4 border-amber-500 rounded-2xl border border-amber-500/20 text-xs sm:text-sm text-amber-200 space-y-2">
                                <strong class="font-heading text-amber-400 block text-xs uppercase tracking-wider">🎯 Objetivos de la Sesión:</strong>
                                <ul class="list-disc list-inside space-y-1.5 text-slate-300">
                                    <li>Dominar el procedimiento sistemático <strong>TCREI</strong>.</li>
                                    <li>Reducir el tiempo de preparación administrativa hasta un <strong>60%</strong>.</li>
                                    <li>Diseñar evaluaciones prácticas resistentes al uso fraudulento de la IA.</li>
                                </ul>
                            </div>
                        </div>

                        <div class="lg:col-span-5 bg-slate-950/90 p-7 rounded-3xl border border-slate-800 shadow-2xl space-y-5">
                            <div class="text-xs sm:text-sm text-amber-400 font-mono font-bold flex items-center gap-1.5">
                                <i class="fa-solid fa-code-compare"></i> // COMPARATIVA EN VIVO
                            </div>
                            <div class="space-y-4">
                                <div class="bg-rose-950/30 p-4 rounded-2xl border border-rose-500/30 space-y-1.5">
                                    <span class="text-rose-400 font-heading font-bold text-xs sm:text-sm flex items-center gap-1">
                                        <i class="fa-solid fa-xmark"></i> Prompt Vago Tradicional
                                    </span>
                                    <p class="text-xs sm:text-sm text-slate-300 font-mono">"Haz un examen sobre redes para mis alumnos de FP."</p>
                                    <span class="text-xs text-rose-300/80 block">➔ Resultado: 5 preguntas genéricas de verdadero/falso.</span>
                                </div>

                                <div class="bg-emerald-950/30 p-4 rounded-2xl border border-emerald-500/30 space-y-1.5">
                                    <span class="text-emerald-400 font-heading font-bold text-xs sm:text-sm flex items-center gap-1">
                                        <i class="fa-solid fa-check"></i> Prompt Estructurado TCREI
                                    </span>
                                    <p class="text-xs sm:text-sm text-slate-300 font-mono">"[Rol & Tarea] + [Contexto Taller] + [Normativa] ➔ Evaluar e Iterar"</p>
                                    <span class="text-xs text-emerald-300/80 block">➔ Resultado: Caso técnico contextualizado, auditado y refinado en 2ª ronda.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `,
                notes: `
                    <p><strong>Guion de Apertura:</strong> "Buenos días a todos. ¿Cuántos habéis probado ChatGPT, habéis pedido un ejercicio para vuestro módulo y habéis pensado: 'Esto es tan genérico que no me sirve en mi taller'? Nos ha pasado a todos."</p>
                    <p><strong>Enfoque Central:</strong> No venimos a debatir si el alumnado usa la IA para copiar. Venimos a tomar el control de la IA como copiloto para ahorrar horas de burocracia y diseñar mejores prácticas de taller.</p>
                `
            },
            {
                title: "Desmitificando la IA Generativa",
                subtitle: "La Metáfora del Asistente Junior Incansable",
                timeTag: "Bloque 1 • 00:10 - 00:18 (8 Min)",
                badge: "Fundamentos Técnicos",
                vectorSvg: `
                    <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-64 h-64 text-emerald-400">
                        <rect x="70" y="50" width="100" height="90" rx="20" stroke="currentColor" stroke-width="2" fill="#10b981" fill-opacity="0.1"/>
                        <circle cx="100" cy="85" r="8" fill="#34d399"/>
                        <circle cx="140" cy="85" r="8" fill="#34d399"/>
                        <path d="M 105 115 Q 120 125 135 115" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <line x1="120" y1="50" x2="120" y2="25" stroke="currentColor" stroke-width="2"/>
                        <circle cx="120" cy="20" r="5" fill="#f59e0b"/>
                    </svg>
                `,
                content: `
                    <div class="space-y-6">
                        <div class="grid md:grid-cols-2 gap-8">
                            <div class="bg-emerald-950/30 border border-emerald-500/30 p-7 rounded-3xl space-y-3.5">
                                <h3 class="font-heading font-bold text-emerald-400 text-lg flex items-center gap-2">
                                    <i class="fa-solid fa-circle-check"></i> Lo que SÍ es la IA Generativa
                                </h3>
                                <ul class="text-xs sm:text-sm text-slate-300 space-y-2.5 list-disc list-inside leading-relaxed">
                                    <li>Un motor de reconocimiento de patrones estadísticos y lingüísticos.</li>
                                    <li>Un <strong>Asistente Junior</strong> que ha leído toda la biblioteca técnica.</li>
                                    <li>Escribe a 500 palabras por minuto y estructura datos al instante.</li>
                                    <li>Ideal para redactar borradores, variar ejercicios y generar rúbricas.</li>
                                </ul>
                            </div>

                            <div class="bg-rose-950/30 border border-rose-500/30 p-7 rounded-3xl space-y-3.5">
                                <h3 class="font-heading font-bold text-rose-400 text-lg flex items-center gap-2">
                                    <i class="fa-solid fa-circle-xmark"></i> Lo que NO es la IA Generativa
                                </h3>
                                <ul class="text-xs sm:text-sm text-slate-300 space-y-2.5 list-disc list-inside leading-relaxed">
                                    <li>NO es un buscador factual como Google.</li>
                                    <li>NO piensa, no tiene experiencia de taller ni sentido común.</li>
                                    <li>Si no conoce la respuesta, <strong>alucina datos con total seguridad</strong>.</li>
                                    <li>No conoce las limitaciones físicas de tu aula sin instrucciones previas.</li>
                                </ul>
                            </div>
                        </div>

                        <div class="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-xs sm:text-sm space-y-1.5">
                            <span class="text-amber-400 font-heading font-bold uppercase text-xs tracking-wider">💡 Idea Clave para el Aula</span>
                            <p class="text-slate-200 italic">
                                "Si contratas a un becario junior y le pides un protocolo de seguridad sin darle instrucciones detalladas, se lo inventará. Con la IA ocurre exactamente lo mismo."
                            </p>
                        </div>
                    </div>
                `,
                notes: `
                    <p><strong>Explicación:</strong> Insistir en la metáfora del Asistente Junior. Es hiperactivo y rápido, pero novato. Necesita un <em>briefing</em> estructurado para no cometer errores graves en taller.</p>
                `
            },
            {
                title: "Oportunidades, Riesgos y Soberanía Pedagógica",
                subtitle: "El Balance de Situación de la IA en Formación Profesional",
                timeTag: "Bloque 1 • 00:18 - 00:25 (7 Min)",
                badge: "Marco Ético y Legal",
                vectorSvg: `
                    <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-64 h-64 text-indigo-400">
                        <polygon points="120,20 200,60 200,160 120,220 40,160 40,60" stroke="currentColor" stroke-width="2" fill="#6366f1" fill-opacity="0.1"/>
                        <circle cx="120" cy="110" r="30" stroke="#10b981" stroke-width="2"/>
                        <path d="M 110 110 L 118 118 L 132 104" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `,
                content: `
                    <div class="grid md:grid-cols-3 gap-6">
                        <div class="bg-slate-950/80 p-7 rounded-3xl border border-slate-800 shadow-xl space-y-3">
                            <div class="w-11 h-11 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-2xl flex items-center justify-center font-bold text-lg">
                                <i class="fa-solid fa-bolt"></i>
                            </div>
                            <h3 class="font-heading font-bold text-white text-lg">Ventajas en FP</h3>
                            <p class="text-xs sm:text-sm text-slate-400 leading-relaxed">
                                Ahorro del 60% en tareas administrativas. Adaptación instantánea para ACNEAE y generación infinita de variantes de supuestos prácticos.
                            </p>
                        </div>

                        <div class="bg-slate-950/80 p-7 rounded-3xl border border-slate-800 shadow-xl space-y-3">
                            <div class="w-11 h-11 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-2xl flex items-center justify-center font-bold text-lg">
                                <i class="fa-solid fa-triangle-exclamation"></i>
                            </div>
                            <h3 class="font-heading font-bold text-white text-lg">Riesgos Técnicos</h3>
                            <p class="text-xs sm:text-sm text-slate-400 leading-relaxed">
                                Sesgo anglosajón, desconocimiento por defecto de normativas autonómicas o Reales Decretos españoles y alucinaciones en parámetros técnicos.
                            </p>
                        </div>

                        <div class="bg-gradient-to-br from-slate-950 to-emerald-950/40 p-7 rounded-3xl border border-emerald-500/40 shadow-xl space-y-3">
                            <div class="w-11 h-11 bg-emerald-500 text-white rounded-2xl flex items-center justify-center font-bold text-lg">
                                <i class="fa-solid fa-shield"></i>
                            </div>
                            <h3 class="font-heading font-bold text-emerald-400 text-lg">Soberanía Pedagógica</h3>
                            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                El docente es el único responsable y firmante del material. La excusa <em>"la IA cometió un fallo"</em> no es admisible ante el alumnado ni una inspección.
                            </p>
                        </div>
                    </div>
                `,
                notes: `
                    <p><strong>RGPD y Protección de Datos:</strong> Recordar encarecidamente que NUNCA se deben introducir nombres de alumnos, notas reales o datos confidenciales de empresas de FCT/Dual en modelos de IA públicos.</p>
                `
            },
            {
                title: "El Principio GIGO: Garbage In, Garbage Out",
                subtitle: "La Calidad del Resultado Depende de la Calidad de la Entrada",
                timeTag: "Bloque 2 • 00:25 - 00:30 (5 Min)",
                badge: "Principios de Prompting",
                vectorSvg: `
                    <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-64 h-64 text-amber-400">
                        <polygon points="40,40 200,40 140,130 140,200 100,180 100,130" stroke="currentColor" stroke-width="2" fill="#f59e0b" fill-opacity="0.1"/>
                        <circle cx="120" cy="215" r="6" fill="#10b981"/>
                    </svg>
                `,
                content: `
                    <div class="space-y-6">
                        <div class="text-center max-w-2xl mx-auto space-y-1">
                            <h3 class="text-2xl sm:text-4xl font-heading font-black text-white">Garbage In ➔ Garbage Out</h3>
                            <p class="text-xs sm:text-base text-slate-400">Si metes órdenes genéricas ("Basura"), obtendrás respuestas estériles ("Basura").</p>
                        </div>

                        <div class="grid md:grid-cols-2 gap-8">
                            <div class="bg-rose-950/30 border-2 border-rose-500/30 p-7 rounded-3xl space-y-3">
                                <span class="bg-rose-600 text-white text-xs font-heading font-bold px-3 py-0.5 rounded-full uppercase">Entrada Ineficaz</span>
                                <p class="text-xs sm:text-sm font-mono text-slate-200 bg-slate-950 p-4 rounded-xl border border-rose-500/20">
                                    "Escribe una práctica para un recepcionista de hotel."
                                </p>
                                <div class="text-xs sm:text-sm text-rose-300 space-y-1">
                                    <p><strong>Resultado Obtenido:</strong> Una descripción genérica de atención al cliente sin protocolos hoteleros, sin incidencias reales y sin criterios de evaluación.</p>
                                </div>
                            </div>

                            <div class="bg-emerald-950/30 border-2 border-emerald-500/30 p-7 rounded-3xl space-y-3">
                                <span class="bg-emerald-600 text-white text-xs font-heading font-bold px-3 py-0.5 rounded-full uppercase">Entrada Estructurada (TCREI)</span>
                                <p class="text-xs sm:text-sm font-mono text-slate-200 bg-slate-950 p-4 rounded-xl border border-emerald-500/20">
                                    "[Tarea & Rol: Docente de Hostelería y Turismo + Simulación de Check-in conflictivo por overbooking] + [Contexto: Aula de simulación / Front-Desk, 2h, 1º GS Gestión de Alojamientos Turísticos] + [Ref: Protocolo de Calidad Hotelera y Normativa de Reclamaciones] ➔ Luego Evalúa e Itera con reprompting."
                                </p>
                                <div class="text-xs sm:text-sm text-emerald-300 space-y-1">
                                    <p><strong>Resultado Obtenido:</strong> Simulación de recepción con guion de cliente difícil, protocolo de resolución de conflictos y rúbrica técnica de evaluación, auditada y optimizada en 2ª ronda.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `,
                notes: `
                    <p><strong>Demostración:</strong> Mostrar la diferencia visual. Explicar que la IA no necesita mayor potencia computacional, sino que el docente actúe como diseñador pedagógico en el prompt.</p>
                `
            },
            {
                title: "Desglosando el Marco Metodológico TCREI",
                subtitle: "Los 5 Pilares de la Interacción Efectiva con la IA",
                timeTag: "Bloque 2 • 00:30 - 00:40 (10 Min)",
                badge: "Marco Metodológico",
                vectorSvg: `
                    <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-64 h-64 text-brand-400">
                        <polygon points="120,30 205,92 173,190 67,190 35,92" stroke="currentColor" stroke-width="2" fill="#0284c7" fill-opacity="0.1"/>
                        <circle cx="120" cy="120" r="12" fill="#f59e0b"/>
                    </svg>
                `,
                content: `
                    <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div class="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-2.5 text-center">
                            <span class="w-12 h-12 bg-sky-500/20 text-sky-400 border border-sky-500/40 rounded-xl flex items-center justify-center font-heading font-black text-xl mx-auto">T</span>
                            <h4 class="font-heading font-bold text-white text-sm">Tarea & Rol</h4>
                            <p class="text-xs text-slate-400">Rol asignado + Verbo rector + Entregable delimitado.</p>
                        </div>
                        <div class="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-2.5 text-center">
                            <span class="w-12 h-12 bg-teal-500/20 text-teal-400 border border-teal-500/40 rounded-xl flex items-center justify-center font-heading font-black text-xl mx-auto">C</span>
                            <h4 class="font-heading font-bold text-white text-sm">Contexto</h4>
                            <p class="text-xs text-slate-400">Nivel de Alumnado, perfil del grupo, tiempo y equipamiento.</p>
                        </div>
                        <div class="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-2.5 text-center">
                            <span class="w-12 h-12 bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 rounded-xl flex items-center justify-center font-heading font-black text-xl mx-auto">R</span>
                            <h4 class="font-heading font-bold text-white text-sm">Referencias</h4>
                            <p class="text-xs text-slate-400">Normativa oficial (RD/BOE), estándares INCUAL o manuales.</p>
                        </div>
                        <div class="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-2.5 text-center">
                            <span class="w-12 h-12 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-xl flex items-center justify-center font-heading font-black text-xl mx-auto">E</span>
                            <h4 class="font-heading font-bold text-white text-sm">Evaluar</h4>
                            <p class="text-xs text-slate-400">Auditoría del docente: verificar alucinaciones y rigor técnico.</p>
                        </div>
                        <div class="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-2.5 text-center col-span-2 md:col-span-1">
                            <span class="w-12 h-12 bg-purple-500/20 text-purple-400 border border-purple-500/40 rounded-xl flex items-center justify-center font-heading font-black text-xl mx-auto">I</span>
                            <h4 class="font-heading font-bold text-white text-sm">Iterar</h4>
                            <p class="text-xs text-slate-400">Bucle de mejora (Reprompting) hasta el resultado óptimo.</p>
                        </div>
                    </div>

                    <div class="bg-slate-950/90 p-5 rounded-2xl border border-brand-500/30 text-xs sm:text-sm space-y-1.5 mt-4">
                        <span class="text-brand-400 font-heading font-bold uppercase text-xs tracking-wider">💡 El Ciclo Completo TCREI</span>
                        <p class="text-slate-300"><strong>Fase 1 (Prompt de Entrada):</strong> Construye tu instrucción con <strong>T</strong> (incluyendo el Rol), <strong>C</strong> y <strong>R</strong>.<br><strong>Fase 2 (Human-in-the-Loop):</strong> <strong>E</strong>valúa críticamente la respuesta del LLM e <strong>I</strong>tera mediante reprompting para perfeccionar el borrador.</p>
                    </div>
                `,
                notes: `
                    <p><strong>Paso a paso:</strong> Explicar que T-C-R forman el prompt inicial, mientras que E e I son la intervención crítica del docente: evaluar el borrador de la IA (no aceptar a ciegas) e iterar con reprompting para afinar el resultado.</p>
                `
            },
            {
                title: "Actividad 1: Transformación de Prompts en Vivo",
                subtitle: "Dinámica Grupal en Parejas (10 Minutos)",
                timeTag: "Bloque 3 • 00:40 - 00:50 (10 Min)",
                badge: "Taller Práctico",
                vectorSvg: `
                    <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-64 h-64 text-amber-400">
                        <circle cx="80" cy="80" r="30" stroke="currentColor" stroke-width="2" fill="#f59e0b" fill-opacity="0.1"/>
                        <circle cx="160" cy="80" r="30" stroke="currentColor" stroke-width="2" fill="#f59e0b" fill-opacity="0.1"/>
                    </svg>
                `,
                content: `
                    <div class="space-y-6">
                        <div class="bg-amber-950/30 border border-amber-500/30 p-5 rounded-2xl text-xs sm:text-sm text-amber-200 flex flex-wrap justify-between items-center gap-3">
                            <span class="text-sm font-medium"><strong>Instrucciones:</strong> Elige un prompt vago de tu área profesional y redáctalo en parejas usando la plantilla TCREI.</span>
                            <span class="bg-amber-500/20 border border-amber-500/40 text-amber-300 px-4 py-1.5 rounded-full font-mono font-bold text-xs">Tiempo: 3 Minutos</span>
                        </div>

                        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm">
                            <div class="bg-slate-950/90 p-5 rounded-2xl border border-slate-800 space-y-2 shadow-lg">
                                <span class="font-heading font-bold text-sky-400 text-sm block">⚡ Opción A: Industrial</span>
                                <p class="text-xs text-slate-300 italic">"Haz una lista de prácticas para el taller eléctrico."</p>
                                <span class="text-[10px] text-slate-500 block pt-2 border-t border-slate-800">Transformar con REBT + Taller 2h</span>
                            </div>
                            <div class="bg-slate-950/90 p-5 rounded-2xl border border-slate-800 space-y-2 shadow-lg">
                                <span class="font-heading font-bold text-purple-400 text-sm block">🩺 Opción B: Sanidad</span>
                                <p class="text-xs text-slate-300 italic">"Dame un caso práctico de enfermería."</p>
                                <span class="text-[10px] text-slate-500 block pt-2 border-t border-slate-800">Transformar con Braden + TCAE</span>
                            </div>
                            <div class="bg-slate-950/90 p-5 rounded-2xl border border-slate-800 space-y-2 shadow-lg">
                                <span class="font-heading font-bold text-orange-400 text-sm block">🍽️ Opción C: Hostelería</span>
                                <p class="text-xs text-slate-300 italic">"Escribe una queja de cliente en restaurante."</p>
                                <span class="text-[10px] text-slate-500 block pt-2 border-t border-slate-800">Transformar con Alérgenos + Roleplay</span>
                            </div>
                            <div class="bg-slate-950/90 p-5 rounded-2xl border border-slate-800 space-y-2 shadow-lg">
                                <span class="font-heading font-bold text-emerald-400 text-sm block">💼 Opción D: Admin/IT</span>
                                <p class="text-xs text-slate-300 italic">"Haz un examen tipo test sobre facturas."</p>
                                <span class="text-[10px] text-slate-500 block pt-2 border-t border-slate-800">Transformar con Auditoría + RD 1619</span>
                            </div>
                        </div>

                        <div class="bg-gradient-to-r from-slate-950 to-brand-950 p-5 rounded-2xl border border-brand-500/30 text-xs sm:text-sm text-center space-y-1.5">
                            <p class="text-amber-400 font-heading font-bold text-sm">Esta Actividad es la base para la actividad siguiente en la que optimizaremos el prompt con el Diseñador TCREI.</p>
                        </div>
                    </div>
                `,
                notes: `
                    <p><strong>Pausa de 3 minutos:</strong> Moverse por las mesas. Elegir a un voluntario de una familia profesional representativa y pegar su prompt en el generador interactivo proyectado.</p>
                `
            },
            {
                title: "Actividad 2: Optimización e Iteración en Vivo",
                subtitle: "Fase 1 (TCR: Construcción del Prompt) y Fase 2 (EI: Evaluación e Iteración)",
                timeTag: "Bloque 4 • 00:50 - 00:55 (5 Min)",
                badge: "Taller Práctico • Continuación",
                vectorSvg: `
                    <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-64 h-64 text-purple-400">
                        <circle cx="120" cy="120" r="80" stroke="currentColor" stroke-width="2" stroke-dasharray="6 6"/>
                    </svg>
                `,
                content: `
                    <div class="space-y-5">
                        <div class="bg-amber-950/30 border border-amber-500/30 p-4 rounded-2xl text-xs sm:text-sm text-amber-200 flex items-center justify-between gap-3">
                            <span><strong>Dinámica:</strong> Llevamos el caso de la Actividad 1 al <strong>Diseñador TCREI</strong> para completar el ciclo de optimización en dos fases consecutivas.</span>
                            <span class="bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3.5 py-1 rounded-full font-mono font-bold text-xs shrink-0">Ciclo TCREI</span>
                        </div>

                        <div class="grid md:grid-cols-2 gap-5">
                            <!-- FASE 1: TCR -->
                            <div class="bg-slate-950/90 p-5 sm:p-6 rounded-3xl border border-sky-500/30 space-y-3.5 shadow-xl">
                                <div class="flex items-center gap-2 text-sky-400 font-heading font-bold text-sm sm:text-base border-b border-slate-800 pb-2">
                                    <span class="w-7 h-7 rounded-xl bg-sky-500/20 flex items-center justify-center text-xs font-black">1</span>
                                    <span>Fase 1: Entrada Estructurada (TCR)</span>
                                </div>
                                <ul class="text-xs sm:text-sm text-slate-300 space-y-2.5 leading-relaxed">
                                    <li><strong class="text-sky-300">T (Tarea & Rol):</strong> Asigna el rol experto docente y define con precisión el entregable técnico.</li>
                                    <li><strong class="text-teal-300">C (Contexto):</strong> Especifica el nivel del alumnado, los tiempos de sesión y los recursos reales disponibles.</li>
                                    <li><strong class="text-indigo-300">R (Referencias):</strong> Ancla la respuesta a normativa oficial, manual de calidad o catálogo INCUAL.</li>
                                </ul>
                                <div class="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 italic">
                                    ➔ Genera el primer borrador estructurado en el Diseñador TCREI.
                                </div>
                            </div>

                            <!-- FASE 2: EI -->
                            <div class="bg-slate-950/90 p-5 sm:p-6 rounded-3xl border border-purple-500/30 space-y-3.5 shadow-xl">
                                <div class="flex items-center gap-2 text-purple-400 font-heading font-bold text-sm sm:text-base border-b border-slate-800 pb-2">
                                    <span class="w-7 h-7 rounded-xl bg-purple-500/20 flex items-center justify-center text-xs font-black">2</span>
                                    <span>Fase 2: Refinamiento Crítico (EI)</span>
                                </div>
                                <ul class="text-xs sm:text-sm text-slate-300 space-y-2.5 leading-relaxed">
                                    <li><strong class="text-amber-300">E (Evaluar):</strong> El docente audita el resultado identificando alucinaciones, vacíos o falta de realismo en taller.</li>
                                    <li><strong class="text-purple-300">I (Iterar - Reprompting):</strong> Prueba de esfuerzo inyectando un imprevisto real (avería, falta de material o adaptación grupal).</li>
                                </ul>
                                <div class="bg-purple-950/30 p-3 rounded-xl border border-purple-500/20 text-[11px] text-purple-300 italic font-mono">
                                    "Excelente propuesta. Ahora adáptala si surge un imprevisto y faltan recursos..."
                                </div>
                            </div>
                        </div>

                        <div class="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl text-xs sm:text-sm text-emerald-300 font-medium flex items-center gap-3">
                            <i class="fa-solid fa-lightbulb text-emerald-400 text-lg shrink-0"></i>
                            <span><strong>Clave Docente:</strong> TCR te da el 80% de calidad inicial en segundos; la Evaluación e Iteración (EI) aporta tu criterio pedagógico experto.</span>
                        </div>
                    </div>
                `,
                notes: `
                    <p><strong>Demostración en vivo:</strong> Cargar el prompt TCR en el Diseñador. Mostrar la salida obtenida, revisarla en voz alta (E) y enviar una segunda orden de iteración (I) ante un imprevisto didáctico.</p>
                `
            },
            {
                title: "Hoja de Ruta y Próximos Pasos para Docentes",
                subtitle: "Plan de Acción Inmediato tras la Sesión Formativa",
                timeTag: "Bloque 5 • 00:55 - 01:00 (5 Min)",
                badge: "Cierre y Herramientas",
                vectorSvg: `
                    <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-64 h-64 text-brand-400">
                        <path d="M 40 200 L 120 40 L 200 200 Z" stroke="currentColor" stroke-width="2" fill="#0284c7" fill-opacity="0.1"/>
                    </svg>
                `,
                content: `
                    <div class="grid md:grid-cols-3 gap-6">
                        <div class="bg-slate-950/80 p-7 rounded-3xl border border-slate-800 shadow-xl space-y-2.5 text-center">
                            <div class="w-12 h-12 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold mx-auto text-base">1</div>
                            <h3 class="font-heading font-bold text-white text-base">Banco de Prompts (28 Familias)</h3>
                            <p class="text-xs sm:text-sm text-slate-400">Crea tu propia carpeta personal de prompts TCREI probados para tus módulos formativos.</p>
                        </div>

                        <div class="bg-slate-950/80 p-7 rounded-3xl border border-slate-800 shadow-xl space-y-2.5 text-center">
                            <div class="w-12 h-12 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold mx-auto text-base">2</div>
                            <h3 class="font-heading font-bold text-white text-base">Evoluciona la Evaluación</h3>
                            <p class="text-xs sm:text-sm text-slate-400">Pasa de exámenes teóricos escritos a ejecuciones prácticas en taller y defensas orales.</p>
                        </div>

                        <div class="bg-slate-950/80 p-7 rounded-3xl border border-slate-800 shadow-xl space-y-2.5 text-center">
                            <div class="w-12 h-12 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold mx-auto text-base">3</div>
                            <h3 class="font-heading font-bold text-white text-base">Diseñador TCREI</h3>
                            <p class="text-xs sm:text-sm text-slate-400">Utiliza el diseñador para tener tu propio banco de prompts almacenados en la nube.</p>
                        </div>
                    </div>

                    <div class="bg-gradient-to-r from-brand-950 via-slate-950 to-purple-950 text-white p-7 rounded-3xl text-center space-y-3 mt-4 border border-brand-500/30 shadow-2xl">
                        <h3 class="font-heading font-bold text-amber-400 text-lg">¡Descarga tus Herramientas de Taller!</h3>
                        <p class="text-xs sm:text-sm text-slate-300">
                            Utiliza las pestañas superiores de este panel para acceder al <strong>Diseñador de Prompts</strong>, la <strong>Ficha Cheat Sheet</strong> y el <strong>Banco por Familias</strong>.
                        </p>
                    </div>
                `,
                notes: `
                    <p><strong>Agradecimiento final:</strong> Abrir el turno de preguntas de 5 minutos y animar a usar la pestaña 'Generador TCREI' inmediatamente en su próximo grupo de clase.</p>
                `
            }
        ];

