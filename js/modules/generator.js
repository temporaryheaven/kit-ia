/**
 * =============================================================================
 * KIT IA DOCENTES FP - DISEÑADOR DE PROMPTS Y MOTOR TCREI (v1.3.0)
 * =============================================================================
 */

import { state } from '../core/state.js';
import { showToast } from '../core/toast.js';
import { switchTab } from './ui-helpers.js';

export function onPhase1Input() {
    if (state.aiAuditResults.phase1) {
        state.aiAuditResults.phase1 = null;
    }
    buildPrompt();
}

export function onPhase2Input() {
    if (state.aiAuditResults.phase2) {
        state.aiAuditResults.phase2 = null;
    }
    buildPrompt();
}

export function evaluatePromptHeuristics(task, context, ref, evalCriteria, iter) {
    // --- FASE 1: ENTRADA ESTRUCTURADA (T-C-R) ---
    const hasRole = /act[úu]a\s+como|experto\s+en|especialista\s+en|docente|profesor|asistente|tutor|ingenier|t[ée]cnico/i.test(task);
    const hasVerb = /dise[ñn]a|elabora|crea|redacta|genera|desarrolla|estructura|plantea|construye/i.test(task);
    const hasDeliverable = /gu[íi]a|r[úu]brica|caso|tabla|examen|cuestionario|despiece|ejercicio|simulaci[óo]n|pr[áa]ctica|ficha|ticket/i.test(task);
    const hasLevel = /grado\s+medio|grado\s+superior|fp\s+b[áa]sica|1[ºº]|2[ºº]|alumn|ciclo|curso|estudiante/i.test(context);
    const hasEnv = /taller|laboratorio|aula|panel|maquinaria|herramienta|horas?|minutos?|sesi[óo]n|instalaci[óo]n/i.test(context);
    const hasNorm = /rd\s*\d+|real\s+decreto|boe|decreto|curr[íi]culo|incual|norma|une|iso|rebt|cte|itc|reglamento|art[íi]culo/i.test(ref);

    let p1Score = 0;
    if (task.length > 5) p1Score += 10;
    if (hasRole) p1Score += 20;
    if (hasVerb && hasDeliverable) p1Score += 20;
    if (context.length > 5) p1Score += 10;
    if (hasLevel) p1Score += 15;
    if (hasEnv) p1Score += 10;
    if (ref.length > 5) p1Score += 5;
    if (hasNorm) p1Score += 10;
    p1Score = Math.min(100, p1Score);

    const p1BadgesEl = document.getElementById('p1-badges');
    if (p1BadgesEl) {
        p1BadgesEl.innerHTML = `
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full border ${hasRole ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'}">${hasRole ? '✓ Rol Experto' : '○ Sin Rol'}</span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full border ${hasVerb && hasDeliverable ? 'bg-teal-500/20 text-teal-300 border-teal-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'}">${hasVerb && hasDeliverable ? '✓ Verbo & Entregable' : '○ Entregable impreciso'}</span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full border ${hasLevel ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'}">${hasLevel ? '✓ Nivel FP' : '○ Sin nivel FP'}</span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full border ${hasEnv ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'}">${hasEnv ? '✓ Taller/Tiempo' : '○ Sin entorno'}</span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full border ${hasNorm ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'}">${hasNorm ? '✓ Normativa Oficial' : '○ Sin RD/BOE'}</span>
        `;
    }

    const p1Bar = document.getElementById('p1-score-bar');
    const p1Badge = document.getElementById('p1-score-badge');
    const p1Tip = document.getElementById('p1-tip');

    if (p1Bar && p1Badge && p1Tip) {
        if (state.aiAuditResults.phase1) {
            const ai = state.aiAuditResults.phase1;
            p1Bar.style.width = `${ai.score}%`;
            p1Bar.className = 'h-full bg-sky-500 transition-all duration-300 shadow-md shadow-sky-500/40';
            p1Badge.className = 'font-mono font-bold px-2 py-0.5 rounded text-[11px] bg-sky-500/20 text-sky-300 border border-sky-500/40 flex items-center gap-1';
            p1Badge.innerHTML = `<i class="fa-solid fa-robot text-[10px]"></i> ${ai.score}% • IA ${ai.label}`;
            p1Tip.innerHTML = `<span class="text-sky-300 font-semibold"><i class="fa-solid fa-wand-magic-sparkles text-xs mr-1"></i>Auditoría IA (${ai.model}):</span> ${ai.tip}`;
        } else {
            p1Bar.style.width = `${p1Score}%`;
            if (p1Score === 0) {
                p1Bar.className = 'h-full bg-slate-700 transition-all duration-300';
                p1Badge.className = 'font-mono font-bold px-2 py-0.5 rounded text-[11px] bg-slate-900 text-slate-500 border border-slate-800';
                p1Badge.innerText = '0% • Incompleto';
                p1Tip.innerText = 'Especifica el rol docente experto, verbo rector y anclaje normativo.';
            } else if (p1Score < 50) {
                p1Bar.className = 'h-full bg-rose-500 transition-all duration-300';
                p1Badge.className = 'font-mono font-bold px-2 py-0.5 rounded text-[11px] bg-rose-500/20 text-rose-300 border border-rose-500/40';
                p1Badge.innerText = `${p1Score}% • Básico`;
                p1Tip.innerText = 'Sugerencia: Asigna un rol docente claro (ej: "Actúa como...") y detalla el entregable.';
            } else if (p1Score < 85) {
                p1Bar.className = 'h-full bg-amber-500 transition-all duration-300';
                p1Badge.className = 'font-mono font-bold px-2 py-0.5 rounded text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/40';
                p1Badge.innerText = `${p1Score}% • Bueno`;
                p1Tip.innerText = !hasNorm ? 'Sugerencia: Cita un Real Decreto (RD) o manual técnico para anclar la respuesta.' : '¡Buen trabajo! Refina el contexto de taller y conocimientos previos.';
            } else {
                p1Bar.className = 'h-full bg-emerald-500 transition-all duration-300';
                p1Badge.className = 'font-mono font-bold px-2 py-0.5 rounded text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
                p1Badge.innerText = `${p1Score}% • Sólido`;
                p1Tip.innerText = 'Excelente entrada estructurada: rol delimitado, contexto técnico y normativa presentes.';
            }
        }
    }

    // --- FASE 2: CONTROL DOCENTE E ITERACIÓN (E-I) ---
    const hasAudit = /verificar|comprobar|auditar|revisar|exactitud|f[óo]rmula|c[áa]lculo|alucinaci[óo]n|rigor|fuente|tolerancia/i.test(evalCriteria);
    const hasSafety = /seguridad|epi|prevenci[óo]n|prl|riesgo|tiempo\s+real|viabilidad|par[áa]metro|normativa/i.test(evalCriteria);
    const hasContingency = /aver[íi]a|imprevisto|fallo|defecto|incompatibilidad|falta\s+de|error\s+oculto|dificultad|rotura/i.test(iter);
    const hasDiversity = /acneae|dua|inclusi[óo]n|roles|equipo|variante|adaptaci[óo]n|nivel|grupos|parejas/i.test(iter);

    let p2Score = 0;
    if (evalCriteria.length > 5) p2Score += 15;
    if (hasAudit) p2Score += 25;
    if (hasSafety) p2Score += 15;
    if (iter.length > 5) p2Score += 15;
    if (hasContingency) p2Score += 20;
    if (hasDiversity) p2Score += 10;
    p2Score = Math.min(100, p2Score);

    const p2BadgesEl = document.getElementById('p2-badges');
    if (p2BadgesEl) {
        p2BadgesEl.innerHTML = `
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full border ${hasAudit ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'}">${hasAudit ? '✓ Auditoría Antialucinación' : '○ Sin verificación'}</span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full border ${hasSafety ? 'bg-orange-500/20 text-orange-300 border-orange-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'}">${hasSafety ? '✓ Seguridad/EPIs' : '○ Sin pauta PRL'}</span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full border ${hasContingency ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'}">${hasContingency ? '✓ Imprevisto Taller' : '○ Sin avería simulada'}</span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full border ${hasDiversity ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'}">${hasDiversity ? '✓ Inclusión / Roles' : '○ Sin variante DUA'}</span>
        `;
    }

    const p2Bar = document.getElementById('p2-score-bar');
    const p2Badge = document.getElementById('p2-score-badge');
    const p2Tip = document.getElementById('p2-tip');

    if (p2Bar && p2Badge && p2Tip) {
        if (state.aiAuditResults.phase2) {
            const ai = state.aiAuditResults.phase2;
            p2Bar.style.width = `${ai.score}%`;
            p2Bar.className = 'h-full bg-amber-500 transition-all duration-300 shadow-md shadow-amber-500/40';
            p2Badge.className = 'font-mono font-bold px-2 py-0.5 rounded text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1';
            p2Badge.innerHTML = `<i class="fa-solid fa-robot text-[10px]"></i> ${ai.score}% • IA ${ai.label}`;
            p2Tip.innerHTML = `<span class="text-amber-300 font-semibold"><i class="fa-solid fa-wand-magic-sparkles text-xs mr-1"></i>Auditoría IA (${ai.model}):</span> ${ai.tip}`;
        } else {
            p2Bar.style.width = `${p2Score}%`;
            if (p2Score === 0) {
                p2Bar.className = 'h-full bg-slate-700 transition-all duration-300';
                p2Badge.className = 'font-mono font-bold px-2 py-0.5 rounded text-[11px] bg-slate-900 text-slate-500 border border-slate-800';
                p2Badge.innerText = '0% • Sin Control';
                p2Tip.innerText = 'Añade pautas de auditoría técnica (fórmulas, seguridad) e imprevistos de taller.';
            } else if (p2Score < 50) {
                p2Bar.className = 'h-full bg-rose-500 transition-all duration-300';
                p2Badge.className = 'font-mono font-bold px-2 py-0.5 rounded text-[11px] bg-rose-500/20 text-rose-300 border border-rose-500/40';
                p2Badge.innerText = `${p2Score}% • Básico`;
                p2Tip.innerText = 'Sugerencia: Define qué fórmulas, tolerancias o normativas de seguridad verificarás en la salida.';
            } else if (p2Score < 85) {
                p2Bar.className = 'h-full bg-amber-500 transition-all duration-300';
                p2Badge.className = 'font-mono font-bold px-2 py-0.5 rounded text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/40';
                p2Badge.innerText = `${p2Score}% • Bueno`;
                p2Tip.innerText = !hasContingency ? 'Sugerencia: Introduce una avería simulada o falta de material en la 2ª iteración.' : 'Casi completo. Considera añadir adaptación a diversidad o reparto de roles.';
            } else {
                p2Bar.className = 'h-full bg-emerald-500 transition-all duration-300';
                p2Badge.className = 'font-mono font-bold px-2 py-0.5 rounded text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
                p2Badge.innerText = `${p2Score}% • Crítico`;
                p2Tip.innerText = 'Control docente óptimo: criterios de verificación técnica y reprompting dinámico preparados.';
            }
        }
    }
}

export function buildPrompt() {
    const taskInput = document.getElementById('gen-task');
    if (!taskInput) return;

    const task = taskInput.value.trim();
    const context = document.getElementById('gen-context').value.trim();
    const ref = document.getElementById('gen-ref').value.trim();
    const evalCriteria = document.getElementById('gen-eval').value.trim();
    const iter = document.getElementById('gen-iter').value.trim();

    evaluatePromptHeuristics(task, context, ref, evalCriteria, iter);

    const box = document.getElementById('generated-prompt-box');
    if (!box) return;

    box.innerHTML = `
        <div class="text-slate-400 font-mono text-[11px] pb-2 border-b border-slate-800 flex justify-between items-center">
            <span class="text-brand-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <i class="fa-solid fa-arrow-right-to-bracket"></i> # FASES 1-3: ENTRADA (T-C-R)
            </span>
            <button onclick="copyPromptPhase1()" title="Copiar solo Fase de Entrada" class="text-[10px] bg-brand-500/20 hover:bg-brand-500 text-brand-300 hover:text-white px-2.5 py-1 rounded-lg border border-brand-500/40 transition flex items-center gap-1 active:scale-95">
                <i class="fa-regular fa-copy"></i> Copiar T-C-R
            </button>
        </div>

        <div class="space-y-2.5">
            <div class="p-3 rounded-xl bg-sky-950/30 border border-sky-500/30">
                <span class="text-sky-400 font-bold block text-xs">[TAREA & ROL (TASK)]:</span>
                <span class="text-slate-200 text-xs sm:text-sm">${task || '<span class="text-slate-600 italic">// Especifica el rol experto y el producto entregable</span>'}</span>
            </div>

            <div class="p-3 rounded-xl bg-teal-950/30 border border-teal-500/30">
                <span class="text-teal-400 font-bold block text-xs">[CONTEXTO (CONTEXT)]:</span>
                <span class="text-slate-200 text-xs sm:text-sm">${context || '<span class="text-slate-600 italic">// Describe tu alumnado, nivel y taller</span>'}</span>
            </div>

            <div class="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30">
                <span class="text-indigo-400 font-bold block text-xs">[REFERENCIAS & RESTRICCIONES (REFERENCES)]:</span>
                <span class="text-slate-200 text-xs sm:text-sm">${ref || '<span class="text-slate-600 italic">// Cita RD, BOE, REBT o manual</span>'}</span>
            </div>
        </div>

        <div class="text-slate-400 font-mono text-[11px] pt-4 pb-2 border-b border-slate-800 flex justify-between items-center">
            <span class="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <i class="fa-solid fa-arrows-rotate"></i> # FASES 4-5: CONTROL & ITERACIÓN (E-I)
            </span>
            <button onclick="copyPromptPhase2()" title="Copiar solo Fase de Iteración" class="text-[10px] bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-white px-2.5 py-1 rounded-lg border border-amber-500/40 transition flex items-center gap-1 active:scale-95">
                <i class="fa-regular fa-copy"></i> Copiar E-I
            </button>
        </div>

        <div class="space-y-2.5">
            <div class="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30">
                <span class="text-amber-400 font-bold block text-xs">[EVALUACIÓN DEL OUTPUT (EVALUATE)]:</span>
                <span class="text-slate-200 text-xs sm:text-sm">${evalCriteria || '<span class="text-slate-600 italic">// Criterios de auditoría crítica que aplicará el docente al borrador</span>'}</span>
            </div>

            <div class="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30">
                <span class="text-purple-400 font-bold block text-xs">[GUÍA DE ITERACIÓN / REPROMPTING (ITERATE)]:</span>
                <span class="text-slate-200 text-xs sm:text-sm">${iter || '<span class="text-slate-600 italic">// Prompt de seguimiento para refinar, adaptar o corregir</span>'}</span>
            </div>
        </div>
    `;

    if (window.FontAwesome && window.FontAwesome.dom) {
        window.FontAwesome.dom.i2svg();
    }
}

export function getPlainPromptPhase1() {
    const task = document.getElementById('gen-task')?.value.trim() || '[Tarea y Rol asignado]';
    const context = document.getElementById('gen-context')?.value.trim() || '[Contexto del alumnado y taller]';
    const ref = document.getElementById('gen-ref')?.value.trim() || '[Referencias normativas y técnicas]';

    return `# PROMPT ESTRUCTURADO (MARCO TCREI - FASE 1: ENTRADA)
[TAREA & ROL (TASK)]:
${task}

[CONTEXTO (CONTEXT)]:
${context}

[REFERENCIAS & RESTRICCIONES (REFERENCES)]:
${ref}`;
}

export function getPlainPromptPhase2() {
    const evalCriteria = document.getElementById('gen-eval')?.value.trim() || '[Criterios de auditoría crítica del output]';
    const iter = document.getElementById('gen-iter')?.value.trim() || '[Prompt de 2ª iteración / Reprompting]';

    return `# GUÍA DOCENTE Y REPROMPTING (MARCO TCREI - FASE 2: HUMAN-IN-THE-LOOP)
[EVALUACIÓN CRÍTICA DEL OUTPUT (EVALUATE)]:
${evalCriteria}

[PROMPT DE 2ª ITERACIÓN / REPROMPTING (ITERATE)]:
${iter}`;
}

export function getPlainGeneratedPrompt() {
    return `${getPlainPromptPhase1()}

---
${getPlainPromptPhase2()}`;
}

export function copyPromptPhase1() {
    const text = getPlainPromptPhase1();
    navigator.clipboard.writeText(text).then(() => {
        showToast("¡Fases 1 a 3 Copiadas (T-C-R)!", "Pégalo en el modelo de IA para generar el borrador inicial.", "check");
    });
}

export function copyPromptPhase2() {
    const text = getPlainPromptPhase2();
    navigator.clipboard.writeText(text).then(() => {
        showToast("¡Fases 4 y 5 Copiadas (E-I)!", "Pégalo como 2ª instrucción para evaluar y afinar el resultado.", "bolt");
    });
}

export function copyGeneratedPrompt() {
    copyPromptPhase1();
}

export function downloadPromptMd() {
    const text = getPlainGeneratedPrompt();
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "prompt_tcrei_fp.md";
    link.click();
    showToast("Archivo Descargado", "Se ha guardado prompt_tcrei_fp.md con ambas fases.", "download");
}

export function loadPreset(presetKey) {
    state.aiAuditResults.phase1 = null;
    state.aiAuditResults.phase2 = null;
    const p = state.PRESETS[presetKey];
    if (!p) return;

    const genTask = document.getElementById('gen-task');
    if (genTask) genTask.value = p.task;
    const genContext = document.getElementById('gen-context');
    if (genContext) genContext.value = p.context;
    const genRef = document.getElementById('gen-ref');
    if (genRef) genRef.value = p.ref;
    const genEval = document.getElementById('gen-eval');
    if (genEval) genEval.value = p.eval;
    const genIter = document.getElementById('gen-iter');
    if (genIter) genIter.value = p.iter;

    buildPrompt();
    showToast("Plantilla Cargada", `Se cargó el preset de ${presetKey}`, "bolt");
}

export function resetGeneratorForm() {
    state.aiAuditResults.phase1 = null;
    state.aiAuditResults.phase2 = null;
    
    const genTask = document.getElementById('gen-task');
    if (genTask) genTask.value = '';
    const genContext = document.getElementById('gen-context');
    if (genContext) genContext.value = '';
    const genRef = document.getElementById('gen-ref');
    if (genRef) genRef.value = '';
    const genEval = document.getElementById('gen-eval');
    if (genEval) genEval.value = '';
    const genIter = document.getElementById('gen-iter');
    if (genIter) genIter.value = '';

    buildPrompt();
    showToast("Formulario Limpio", "Todos los campos se han reiniciado.", "trash");
}

export function loadTemplateToGenerator(presetKey) {
    loadPreset(presetKey);
    switchTab('generator');
}
