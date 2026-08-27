/**
 * =============================================================================
 * KIT IA DOCENTES FP - AUDITORÍA Y DIAGNÓSTICO INTELIGENTE CON IA (v1.3.0)
 * =============================================================================
 */

import { state } from '../core/state.js';
import { showToast } from '../core/toast.js';
import { escapeHtml } from '../core/utils.js';
import { buildPrompt } from './generator.js';

export const PROVIDER_MODELS = {
    gemini: [
        { id: "gemini-3.7-flash", name: "Gemini 3.7 Flash (Recomendado - Más Capaz)" },
        { id: "gemini-3.6-flash", name: "Gemini 3.6 Flash (Equilibrado y Rápido)" },
        { id: "gemini-3.5-flash", name: "Gemini 3.5 Flash (Estable)" },
        { id: "gemini-3.5-flash-lite", name: "Gemini 3.5 Flash-Lite (Ultrarrápido)" },
        { id: "gemini-3.1-flash-lite", name: "Gemini 3.1 Flash-Lite (Ligero)" }
    ],
    openai: [
        { id: "gpt-4o-mini", name: "GPT-4o-mini (Económico y Rápido)" },
        { id: "gpt-4o", name: "GPT-4o (Alta Precisión)" }
    ],
    claude: [
        { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku (Rápido)" },
        { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet (Pedagógico)" }
    ],
    deepseek: [
        { id: "deepseek-chat", name: "DeepSeek-V3 (Chat General)" },
        { id: "deepseek-reasoner", name: "DeepSeek-R1 (Razonamiento Crítico)" }
    ],
    groq: [
        { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B (Groq Ultra-Rápido)" },
        { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B (Groq)" }
    ]
};

let currentAuditPhase = 'phase1';
let currentAuditOriginal = {
    task: '',
    context: '',
    ref: '',
    eval: '',
    iter: ''
};

export function openApiConfigModal() {
    const modal = document.getElementById('modal-api-config');
    loadApiKeyConfig();
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.FontAwesome && window.FontAwesome.dom) window.FontAwesome.dom.i2svg();
}

export function closeApiConfigModal() {
    const modal = document.getElementById('modal-api-config');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

export function updateModelDropdown() {
    const providerEl = document.getElementById('api-provider-select');
    if (!providerEl) return;
    const provider = providerEl.value;
    const modelSelect = document.getElementById('api-model-select');
    const models = PROVIDER_MODELS[provider] || [];

    if (modelSelect) {
        modelSelect.innerHTML = models.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
    }
}

export function toggleApiKeyVisibility() {
    const input = document.getElementById('api-key-input');
    const iconWrap = document.getElementById('eye-icon-wrap');
    if (!input) return;
    if (input.type === 'password') {
        input.type = 'text';
        if (iconWrap) iconWrap.innerHTML = '<i class="fa-regular fa-eye-slash text-xs"></i>';
    } else {
        input.type = 'password';
        if (iconWrap) iconWrap.innerHTML = '<i class="fa-regular fa-eye text-xs"></i>';
    }
    if (window.FontAwesome && window.FontAwesome.dom) window.FontAwesome.dom.i2svg();
}

export function saveApiKeyConfig() {
    const provider = document.getElementById('api-provider-select')?.value;
    const model = document.getElementById('api-model-select')?.value;
    const apiKey = document.getElementById('api-key-input')?.value.trim();

    if (!apiKey) {
        showToast("Clave Vacía", "Por favor, introduce una clave de API válida.", "trash");
        return;
    }

    const config = { provider, model, apiKey };
    localStorage.setItem('tcrei_api_config', JSON.stringify(config));
    updateApiStatusBadge();
    closeApiConfigModal();
    showToast("API Configurada", `Conectado a ${provider.toUpperCase()} (${model})`, "check");
}

export async function testApiConnection() {
    const provider = document.getElementById('api-provider-select')?.value;
    const model = document.getElementById('api-model-select')?.value;
    const apiKey = document.getElementById('api-key-input')?.value.trim().replace(/^["']|["']$/g, '');

    if (!apiKey) {
        showToast("Clave Vacía", "Introduce una clave de API para probar la conexión.", "trash");
        return;
    }

    const statusEl = document.getElementById('api-test-status');
    const testBtn = document.getElementById('btn-test-api');
    const originalBtn = testBtn ? testBtn.innerHTML : '';
    if (testBtn) {
        testBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Probando...`;
        testBtn.disabled = true;
    }
    if (statusEl) {
        statusEl.innerHTML = `<span class="text-amber-400 flex items-center gap-1.5"><i class="fa-solid fa-spinner fa-spin"></i> Conectando con ${provider.toUpperCase()} (${model})...</span>`;
    }

    try {
        if (provider === 'gemini') {
            const res = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: [{ role: 'user', content: 'Di OK' }]
                })
            });
            if (!res.ok) {
                const err = await res.json();
                const msg = (Array.isArray(err) && err[0]?.error?.message) || err.error?.message || `HTTP ${res.status}`;
                throw new Error(msg);
            }
        } else if (provider === 'deepseek') {
            const res = await fetch('https://api.deepseek.com/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: [{ role: 'user', content: 'Di OK' }]
                })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error?.message || `HTTP ${res.status}`);
            }
        } else if (provider === 'openai' || provider === 'groq') {
            const ep = provider === 'groq' ? 'https://api.groq.com/openai/v1/chat/completions' : 'https://api.openai.com/v1/chat/completions';
            const res = await fetch(ep, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: [{ role: 'user', content: 'Di OK' }]
                })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error?.message || `HTTP ${res.status}`);
            }
        } else if (provider === 'claude') {
            const res = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'dangerously-allow-browser': 'true'
                },
                body: JSON.stringify({
                    model: model,
                    max_tokens: 10,
                    messages: [{ role: 'user', content: 'Di OK' }]
                })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error?.message || `HTTP ${res.status}`);
            }
        }

        if (statusEl) {
            statusEl.innerHTML = `<span class="text-emerald-400 font-bold flex items-center gap-1.5"><i class="fa-solid fa-circle-check"></i> ¡Conexión exitosa con ${provider.toUpperCase()} (${model})!</span>`;
        }
        showToast("Conexión Exitosa", `Tu API Key de ${provider.toUpperCase()} responde correctamente.`, "check");
    } catch (err) {
        console.error("Test API Error:", err);
        if (statusEl) {
            statusEl.innerHTML = `<span class="text-rose-400 font-bold flex items-center gap-1.5"><i class="fa-solid fa-triangle-exclamation"></i> Error: ${err.message}</span>`;
        }
        showToast("Error de Conexión", err.message, "trash");
    } finally {
        if (testBtn) {
            testBtn.innerHTML = originalBtn;
            testBtn.disabled = false;
        }
        if (window.FontAwesome && window.FontAwesome.dom) window.FontAwesome.dom.i2svg();
    }
}

export function clearApiKeyConfig() {
    localStorage.removeItem('tcrei_api_config');
    const input = document.getElementById('api-key-input');
    if (input) input.value = '';
    updateApiStatusBadge();
    closeApiConfigModal();
    showToast("Clave Eliminada", "Se han borrado las credenciales locales de API.", "trash");
}

export function loadApiKeyConfig() {
    updateModelDropdown();
    const saved = localStorage.getItem('tcrei_api_config');
    if (saved) {
        try {
            const config = JSON.parse(saved);
            const providerSelect = document.getElementById('api-provider-select');
            if (providerSelect) providerSelect.value = config.provider || 'gemini';
            updateModelDropdown();
            const modelSelect = document.getElementById('api-model-select');
            if (modelSelect) {
                const hasModel = Array.from(modelSelect.options).some(o => o.value === config.model);
                if (hasModel) {
                    modelSelect.value = config.model;
                } else if (modelSelect.options.length > 0) {
                    modelSelect.selectedIndex = 0;
                    config.model = modelSelect.value;
                    localStorage.setItem('tcrei_api_config', JSON.stringify(config));
                }
            }
            const apiKeyInput = document.getElementById('api-key-input');
            if (apiKeyInput) apiKeyInput.value = config.apiKey || '';
        } catch (e) {
            console.error("Error loading API config", e);
        }
    }
    updateApiStatusBadge();
}

export function updateApiStatusBadge() {
    const badge = document.getElementById('api-status-badge');
    if (!badge) return;
    const saved = localStorage.getItem('tcrei_api_config');
    if (saved) {
        try {
            const config = JSON.parse(saved);
            badge.innerHTML = `<i class="fa-solid fa-circle text-[6px] text-emerald-400"></i> ${config.provider.toUpperCase()} (${config.model})`;
            badge.classList.remove('hidden');
        } catch (e) {
            badge.classList.add('hidden');
        }
    } else {
        badge.classList.add('hidden');
    }
    if (window.FontAwesome && window.FontAwesome.dom) window.FontAwesome.dom.i2svg();
}

export function copyAuditMetaPrompt(phase = 'phase1') {
    const task = document.getElementById('gen-task')?.value.trim() || '[Tarea no especificada]';
    const context = document.getElementById('gen-context')?.value.trim() || '[Contexto no especificado]';
    const ref = document.getElementById('gen-ref')?.value.trim() || '[Sin referencias normativas]';
    const evalCriteria = document.getElementById('gen-eval')?.value.trim() || '[Sin criterios de evaluación]';
    const iter = document.getElementById('gen-iter')?.value.trim() || '[Sin reprompting definido]';

    let metaPrompt = '';

    if (phase === 'phase1') {
        metaPrompt = `Actúa como un Auditor Metodológico y Pedagógico experto en Formación Profesional (FP) y en el marco TCREI.
Evalúa de forma crítica y rigurosa EXCLUSIVAMENTE la Fase de Entrada (Fases 1-3: Tarea/Rol, Contexto y Referencias).
IMPORTANTE: NO debes evaluar ni exigir las Fases 4 y 5 (Evaluación e Iteración), ya que pertenecen a la fase 'Human-in-the-Loop' posterior del docente.

---
# PROMPT DE ENTRADA A EVALUAR (FASES 1-3: T-C-R):
[TAREA & ROL DOCENTE (T)]: ${task}
[CONTEXTO DEL ALUMNADO Y TALLER (C)]: ${context}
[REFERENCIAS & RESTRICCIONES TÉCNICAS (R)]: ${ref}
---

INSTRUCCIONES DE AUDITORÍA:
1. Puntuación Pedagógica de la Entrada (0 a 100).
2. Fortalezas didácticas del diseño (rol docente asignado, entregable, contexto de taller).
3. Vulnerabilidades técnicas y riesgos de alucinación específicos en aula/taller de FP (seguridad, normativas REBT/CTE/INCUAL, tiempos).
4. Sugerencias de refinamiento de la entrada.
5. Versión Reescrita y Optimizada de T, C y R lista para usar.`;
        showToast("¡Meta-Prompt T-C-R Copiado!", "Pégalo en ChatGPT, Claude o Copilot para auditar solo tu entrada.", "check");
    } else {
        metaPrompt = `Actúa como un Auditor Metodológico y Pedagógico experto en Formación Profesional (FP) y en el marco TCREI.
Evalúa de forma crítica y rigurosa EXCLUSIVAMENTE la Fase de Control Docente y 'Human-in-the-Loop' (Fase 4: Criterios de Evaluación Crítica del Output y Fase 5: Guía de Iteración / Reprompting).
IMPORTANTE: NO evalúes las Fases 1 a 3 de entrada; céntrate en la capacidad del docente para auditar la salida de la IA y guiar el refinamiento.

---
# GUÍA DOCENTE DE CONTROL & REPROMPTING A EVALUAR (FASES 4-5: E-I):
[CRITERIOS DE EVALUACIÓN CRÍTICA DEL OUTPUT (E)]: ${evalCriteria}
[GUÍA DE ITERACIÓN & REPROMPTING (I)]: ${iter}
---

INSTRUCCIONES DE AUDITORÍA:
1. Puntuación de Control Docente e Iteración (0 a 100).
2. Fortalezas del protocolo de verificación y reprompting.
3. Riesgos técnicos no cubiertos (detección de alucinaciones, EPIs, comprobación de fórmulas/cálculos, averías simuladas).
4. Sugerencias de mejora metodológica.
5. Versión Reescrita y Optimizada de E e I lista para usar.`;
        showToast("¡Meta-Prompt E-I Copiado!", "Pégalo en ChatGPT, Claude o Copilot para auditar tu guía de control.", "bolt");
    }

    navigator.clipboard.writeText(metaPrompt);
}

export function computeWordDiff(textA, textB) {
    const a = (textA || '').trim();
    const b = (textB || '').trim();
    if (!a && !b) return '<span class="text-slate-500 italic">(Campo vacío)</span>';
    if (!a && b) {
        return `<ins class="bg-emerald-500/25 text-emerald-300 no-underline rounded px-1 py-0.5 font-semibold">${escapeHtml(b)}</ins>`;
    }
    if (a && !b) {
        return `<del class="bg-rose-500/25 text-rose-300 line-through rounded px-1 py-0.5 font-semibold">${escapeHtml(a)}</del>`;
    }
    if (a === b) {
        return `<span class="text-slate-300">${escapeHtml(b)}</span> <span class="text-[10px] text-slate-500 italic ml-2">(Sin modificaciones)</span>`;
    }

    const tokensA = a.match(/[\w\u00C0-\u024F]+|[^\w\s\u00C0-\u024F]+|\s+/g) || [a];
    const tokensB = b.match(/[\w\u00C0-\u024F]+|[^\w\s\u00C0-\u024F]+|\s+/g) || [b];

    const n = tokensA.length;
    const m = tokensB.length;

    const maxTokens = 600;
    if (n > maxTokens || m > maxTokens) {
        return `<div class="space-y-1"><div class="text-rose-400 text-[11px]"><span class="font-bold">Original:</span> ${escapeHtml(a)}</div><div class="text-emerald-400 text-[11px]"><span class="font-bold">Optimizado:</span> ${escapeHtml(b)}</div></div>`;
    }

    const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            if (tokensA[i] === tokensB[j]) {
                dp[i + 1][j + 1] = dp[i][j] + 1;
            } else {
                dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
            }
        }
    }

    let i = n, j = m;
    const diffPieces = [];
    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && tokensA[i - 1] === tokensB[j - 1]) {
            diffPieces.unshift({ type: 'same', val: tokensA[i - 1] });
            i--;
            j--;
        } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
            diffPieces.unshift({ type: 'ins', val: tokensB[j - 1] });
            j--;
        } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
            diffPieces.unshift({ type: 'del', val: tokensA[i - 1] });
            i--;
        }
    }

    const grouped = [];
    for (let k = 0; k < diffPieces.length; k++) {
        const item = diffPieces[k];
        if (grouped.length > 0 && grouped[grouped.length - 1].type === item.type) {
            grouped[grouped.length - 1].val += item.val;
        } else {
            grouped.push({ type: item.type, val: item.val });
        }
    }

    let html = '';
    for (let k = 0; k < grouped.length; k++) {
        const item = grouped[k];
        const val = escapeHtml(item.val);
        if (item.type === 'same') {
            html += val;
        } else if (item.type === 'ins') {
            html += `<ins class="bg-emerald-500/25 text-emerald-300 no-underline rounded px-1 py-0.5 font-semibold">${val}</ins>`;
        } else if (item.type === 'del') {
            html += `<del class="bg-rose-500/25 text-rose-300 line-through rounded px-1 py-0.5 font-semibold">${val}</del>`;
        }
    }
    return html;
}

export function switchDiagModalTab(tabKey) {
    state.activeDiagTab = tabKey;
    const btnAnalysis = document.getElementById('diag-tab-btn-analysis');
    const btnPreview = document.getElementById('diag-tab-btn-preview');
    const contentAnalysis = document.getElementById('diag-tab-content-analysis');
    const contentPreview = document.getElementById('diag-tab-content-preview');
    const btnGotoPreview = document.getElementById('diag-btn-goto-preview');

    if (tabKey === 'analysis') {
        if (btnAnalysis) {
            btnAnalysis.className = "px-4 py-2.5 text-xs font-heading font-bold rounded-t-xl transition border-b-2 border-brand-500 text-white bg-slate-800/40 flex items-center gap-2";
        }
        if (btnPreview) {
            btnPreview.className = "px-4 py-2.5 text-xs font-heading font-bold rounded-t-xl transition border-b-2 border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/20 flex items-center gap-2";
        }
        if (contentAnalysis) contentAnalysis.classList.remove('hidden');
        if (contentPreview) contentPreview.classList.add('hidden');
        if (btnGotoPreview) btnGotoPreview.classList.remove('hidden');
    } else {
        if (btnAnalysis) {
            btnAnalysis.className = "px-4 py-2.5 text-xs font-heading font-bold rounded-t-xl transition border-b-2 border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/20 flex items-center gap-2";
        }
        if (btnPreview) {
            btnPreview.className = "px-4 py-2.5 text-xs font-heading font-bold rounded-t-xl transition border-b-2 border-emerald-500 text-white bg-slate-800/40 flex items-center gap-2";
        }
        if (contentAnalysis) contentAnalysis.classList.add('hidden');
        if (contentPreview) contentPreview.classList.remove('hidden');
        if (btnGotoPreview) btnGotoPreview.classList.add('hidden');
    }

    if (window.FontAwesome && window.FontAwesome.dom) window.FontAwesome.dom.i2svg();
}

export function setDiagViewMode(mode) {
    state.currentDiffViewMode = mode;
    const splitBtn = document.getElementById('diag-viewmode-split-btn');
    const diffBtn = document.getElementById('diag-viewmode-diff-btn');

    if (mode === 'split') {
        if (splitBtn) {
            splitBtn.className = "px-3 py-1 rounded-lg transition bg-brand-600 text-white flex items-center gap-1";
        }
        if (diffBtn) {
            diffBtn.className = "px-3 py-1 rounded-lg transition text-slate-400 hover:text-slate-200 flex items-center gap-1";
        }
    } else {
        if (splitBtn) {
            splitBtn.className = "px-3 py-1 rounded-lg transition text-slate-400 hover:text-slate-200 flex items-center gap-1";
        }
        if (diffBtn) {
            diffBtn.className = "px-3 py-1 rounded-lg transition bg-brand-600 text-white flex items-center gap-1";
        }
    }

    const fields = currentAuditPhase === 'phase1' ? ['task', 'context', 'ref'] : ['eval', 'iter'];
    fields.forEach(f => {
        const splitEl = document.getElementById(`diag-split-${f}`);
        const diffWrapEl = document.getElementById(`diag-diffwrap-${f}`);
        if (splitEl && diffWrapEl) {
            if (mode === 'split') {
                splitEl.classList.remove('hidden');
                diffWrapEl.classList.add('hidden');
            } else {
                splitEl.classList.add('hidden');
                diffWrapEl.classList.remove('hidden');
                updateDiagFieldDiff(f);
            }
        }
    });

    if (window.FontAwesome && window.FontAwesome.dom) window.FontAwesome.dom.i2svg();
}

export function updateDiagFieldDiff(fieldName) {
    const orig = currentAuditOriginal[fieldName] || '';
    const editEl = document.getElementById(`diag-edit-${fieldName}`);
    const curVal = editEl ? editEl.value : '';
    const diffEl = document.getElementById(`diag-diff-${fieldName}`);
    if (diffEl) {
        diffEl.innerHTML = computeWordDiff(orig, curVal);
    }
}

export function onDiagFieldEdited(fieldName) {
    const editEl = document.getElementById(`diag-edit-${fieldName}`);
    const statusEl = document.getElementById(`diag-status-${fieldName}`);
    if (!editEl || !state.latestDiagnosis || !state.latestDiagnosis.optimizedPrompt) return;

    const opt = state.latestDiagnosis.optimizedPrompt;
    const originalAISuggestion = opt[fieldName] || '';
    const isChanged = (editEl.value.trim() !== originalAISuggestion.trim());

    if (statusEl) {
        if (isChanged) {
            statusEl.innerText = 'Modificado por ti';
            statusEl.className = "text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40";
        } else {
            statusEl.innerText = 'Sugerencia IA';
            statusEl.className = "text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40";
        }
    }

    updateDiagFieldDiff(fieldName);
}

export function resetAIOptimizationProposal() {
    if (!state.latestDiagnosis || !state.latestDiagnosis.optimizedPrompt) return;
    const opt = state.latestDiagnosis.optimizedPrompt;

    if (currentAuditPhase === 'phase1') {
        ['task', 'context', 'ref'].forEach(f => {
            const el = document.getElementById(`diag-edit-${f}`);
            if (el) el.value = opt[f] || '';
            onDiagFieldEdited(f);
        });
    } else {
        ['eval', 'iter'].forEach(f => {
            const el = document.getElementById(`diag-edit-${f}`);
            if (el) el.value = opt[f] || '';
            onDiagFieldEdited(f);
        });
    }
    showToast("Propuesta Restablecida", "Se ha recuperado la sugerencia original de la IA.", "bolt");
}

export async function runAIDiagnosis(phase = 'phase1') {
    currentAuditPhase = phase;
    const saved = localStorage.getItem('tcrei_api_config');
    if (!saved) {
        showToast("Configuración Requerida", "Por favor, introduce tu API Key para auditar con IA.", "bolt");
        openApiConfigModal();
        return;
    }

    let config;
    try {
        config = JSON.parse(saved);
    } catch (e) {
        openApiConfigModal();
        return;
    }

    const task = document.getElementById('gen-task')?.value.trim() || '';
    const context = document.getElementById('gen-context')?.value.trim() || '';
    const ref = document.getElementById('gen-ref')?.value.trim() || '';
    const evalCriteria = document.getElementById('gen-eval')?.value.trim() || '';
    const iter = document.getElementById('gen-iter')?.value.trim() || '';

    if (phase === 'phase1' && !task && !context && !ref) {
        showToast("Fase de Entrada Vacía", "Rellena al menos Tarea y Contexto antes de auditar Fases 1-3.", "trash");
        return;
    }

    if (phase === 'phase2' && !evalCriteria && !iter) {
        showToast("Fase de Control Vacía", "Rellena Criterios de Evaluación o Iteración antes de auditar Fases 4-5.", "trash");
        return;
    }

    currentAuditOriginal = {
        task,
        context,
        ref,
        eval: evalCriteria,
        iter
    };

    const btnId = phase === 'phase1' ? 'btn-run-ai-p1' : 'btn-run-ai-p2';
    const btn = document.getElementById(btnId);
    const originalBtnHtml = btn ? btn.innerHTML : '';
    if (btn) {
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Auditando...</span>`;
        btn.disabled = true;
    }

    let systemPrompt = '';
    let userContent = '';

    if (phase === 'phase1') {
        systemPrompt = `Eres un auditor pedagógico senior especialista en Formación Profesional (FP) y en el marco TCREI.
Tu labor es auditar EXCLUSIVAMENTE la Fase de Entrada (Fases 1-3: Tarea/Rol, Contexto y Referencias).
REGLA CRÍTICA: NO debes evaluar ni criticar la ausencia de las Fases 4 y 5 (Evaluación e Iteración), ya que pertenecen a la fase posterior 'Human-in-the-Loop'.
Devuelve un informe técnico-pedagógico en formato JSON estricto con esta estructura:
{
  "phase": "phase1",
  "score": 92,
  "scoreLabel": "Excelente",
  "strengths": ["Rol docente experto claro", "Contexto de taller delimitado"],
  "risks": ["Riesgo de alucinación técnica si no se cita el Real Decreto o norma UNE", "Riesgo de sobrecarga de tiempo en taller"],
  "improvements": ["Especificar tolerancias o número de alumnos"],
  "optimizedPrompt": {
    "task": "Versión mejorada de Tarea con rol docente explícito y entregable delimitado",
    "context": "Versión mejorada de Contexto de aula/taller",
    "ref": "Versión mejorada de Referencias con normativa oficial (RD, BOE, REBT, CTE, UNE)"
  }
}
Devuelve ÚNICAMENTE el bloque JSON.`;

        userContent = `Audita el siguiente prompt docente de Entrada (T-C-R):
[TAREA & ROL (T)]: ${task || '(Vacío)'}
[CONTEXTO (C)]: ${context || '(Vacío)'}
[REFERENCIAS & RESTRICCIONES (R)]: ${ref || '(Vacío)'}`;
    } else {
        systemPrompt = `Eres un auditor pedagógico senior especialista en Formación Profesional (FP) y en el marco TCREI.
Tu labor es auditar EXCLUSIVAMENTE la Fase de Control Docente y 'Human-in-the-Loop' (Fase 4: Criterios de Evaluación Crítica del Output y Fase 5: Guía de Iteración / Reprompting).
REGLA CRÍTICA: NO evalúes las Fases 1 a 3; céntrate en la capacidad del docente para auditar la salida de la IA y guiar el refinamiento.
Devuelve un informe técnico-pedagógico en formato JSON estricto con esta estructura:
{
  "phase": "phase2",
  "score": 88,
  "scoreLabel": "Sólido",
  "strengths": ["Criterio de verificación de seguridad/EPI bien planteado", "Imprevisto didáctico realista"],
  "risks": ["Falta de protocolo de comprobación de fórmulas/cálculos", "Falta de variante para atención a la diversidad (DUA)"],
  "improvements": ["Añadir avería simulada o rotura de stock en la 2ª iteración"],
  "optimizedPrompt": {
    "eval": "Versión mejorada de Criterios de Evaluación crítica del output",
    "iter": "Versión mejorada de Prompt de 2ª iteración con avería/imprevisto realista"
  }
}
Devuelve ÚNICAMENTE el bloque JSON.`;

        userContent = `Audita la siguiente Guía de Control Docente e Iteración (E-I):
[CRITERIOS DE EVALUACIÓN DEL OUTPUT (E)]: ${evalCriteria || '(Vacío)'}
[GUÍA DE ITERACIÓN & REPROMPTING (I)]: ${iter || '(Vacío)'}`;
    }

    try {
        let responseJson = null;

        if (config.provider === 'gemini') {
            const cleanKey = (config.apiKey || '').trim().replace(/^["']|["']$/g, '');
            const primaryModel = config.model || 'gemini-3.7-flash';
            let lastError = null;

            const openAiEndpoints = [
                'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
                'https://generativelanguage.googleapis.com/v1beta/chat/completions'
            ];

            for (const ep of openAiEndpoints) {
                if (responseJson) break;
                try {
                    const res = await fetch(ep, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${cleanKey}`
                        },
                        body: JSON.stringify({
                            model: primaryModel,
                            messages: [
                                { role: 'system', content: systemPrompt },
                                { role: 'user', content: userContent }
                            ]
                        })
                    });

                    if (res.ok) {
                        const data = await res.json();
                        const rawText = data.choices?.[0]?.message?.content || '';
                        const match = rawText.match(/\{[\s\S]*\}/);
                        if (match) {
                            responseJson = JSON.parse(match[0]);
                            break;
                        }
                    } else {
                        const err = await res.json();
                        const msg = (Array.isArray(err) && err[0]?.error?.message) || err.error?.message || `HTTP ${res.status}`;
                        lastError = new Error(msg);
                        if (res.status === 400 || res.status === 401 || res.status === 403 || res.status === 429) {
                            throw lastError;
                        }
                    }
                } catch (e) {
                    lastError = e;
                    if (e.message && (e.message.includes('API key not valid') || e.message.includes('pass a valid API key') || e.message.includes('quota') || e.message.includes('PERMISSION_DENIED'))) {
                        throw e;
                    }
                }
            }

            if (!responseJson) {
                try {
                    const url = `https://generativelanguage.googleapis.com/v1beta/models/${primaryModel}:generateContent?key=${encodeURIComponent(cleanKey)}`;
                    const res = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-goog-api-key': cleanKey
                        },
                        body: JSON.stringify({
                            contents: [{
                                role: "user",
                                parts: [{ text: `${systemPrompt}\n\n${userContent}` }]
                            }]
                        })
                    });

                    if (res.ok) {
                        const data = await res.json();
                        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
                        const match = rawText.match(/\{[\s\S]*\}/);
                        if (match) {
                            responseJson = JSON.parse(match[0]);
                        }
                    } else {
                        const err = await res.json();
                        throw new Error(err.error?.message || lastError?.message || `Error con Gemini API (${res.status})`);
                    }
                } catch (e) {
                    throw e.message ? e : lastError;
                }
            }

            if (!responseJson && lastError) {
                throw lastError;
            }
        } else if (config.provider === 'openai' || config.provider === 'groq' || config.provider === 'deepseek') {
            let endpoint = 'https://api.openai.com/v1/chat/completions';
            if (config.provider === 'groq') endpoint = 'https://api.groq.com/openai/v1/chat/completions';
            if (config.provider === 'deepseek') endpoint = 'https://api.deepseek.com/chat/completions';

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apiKey}`
                },
                body: JSON.stringify({
                    model: config.model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userContent }
                    ],
                    response_format: (config.provider === 'openai' || config.provider === 'groq') ? { type: "json_object" } : undefined
                })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error?.message || "Error al conectar con la API");
            }
            const data = await res.json();
            const rawText = data.choices?.[0]?.message?.content;
            const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            responseJson = JSON.parse(cleaned);
        } else if (config.provider === 'claude') {
            const res = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': config.apiKey,
                    'anthropic-version': '2023-06-01',
                    'dangerously-allow-browser': 'true'
                },
                body: JSON.stringify({
                    model: config.model || 'claude-3-5-haiku-20241022',
                    max_tokens: 1500,
                    system: systemPrompt,
                    messages: [{ role: 'user', content: userContent }]
                })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error?.message || "Error al conectar con Claude API");
            }
            const data = await res.json();
            const rawText = data.content?.[0]?.text;
            const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            responseJson = JSON.parse(cleaned);
        }

        if (responseJson) {
            state.latestDiagnosis = responseJson;
            const modelName = `${config.provider.toUpperCase()} (${config.model})`;
            const mainTip = (responseJson.improvements && responseJson.improvements[0]) || (responseJson.strengths && responseJson.strengths[0]) || 'Diagnóstico pedagógico con IA completado.';

            state.aiAuditResults[phase] = {
                score: responseJson.score || responseJson.overallScore || 90,
                label: responseJson.scoreLabel || (phase === 'phase1' ? 'Excelente' : 'Sólido'),
                tip: mainTip,
                model: modelName
            };

            buildPrompt();
            renderAIDiagnosisModal(responseJson, config, phase);
        } else {
            throw new Error("No se pudo interpretar la respuesta estructurada de la IA.");
        }

    } catch (err) {
        console.error("AI Diagnosis Error:", err);
        showToast("Error en Auditoría", err.message || "Comprueba tu clave o conexión.", "trash");
    } finally {
        if (btn) {
            btn.innerHTML = originalBtnHtml;
            btn.disabled = false;
        }
        if (window.FontAwesome && window.FontAwesome.dom) window.FontAwesome.dom.i2svg();
    }
}

export function renderAIDiagnosisModal(diag, config, phase = 'phase1') {
    const modelNameEl = document.getElementById('diag-model-name');
    if (modelNameEl) modelNameEl.innerText = `${config.provider.toUpperCase()} (${config.model})`;

    const titleEl = document.getElementById('diag-modal-title');
    if (titleEl) {
        titleEl.innerText = phase === 'phase1'
            ? 'Diagnóstico: Fase 1 (Entrada T-C-R)'
            : 'Diagnóstico: Fase 2 (Control Docente E-I)';
    }

    const pill = document.getElementById('diag-score-pill');
    const score = diag.score || diag.overallScore || 85;
    if (pill) {
        pill.innerText = `${score}/100 • ${diag.scoreLabel || 'Buen Diseño'}`;
        if (score >= 85) pill.className = "text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40";
        else if (score >= 60) pill.className = "text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40";
        else pill.className = "text-xs font-mono font-bold px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40";
    }

    const p1Card = document.getElementById('diag-card-p1');
    const p2Card = document.getElementById('diag-card-p2');
    if (p1Card && p2Card) {
        if (phase === 'phase1') {
            p1Card.classList.remove('opacity-40', 'border-slate-800');
            p1Card.classList.add('border-sky-500/40', 'bg-sky-950/40');
            p2Card.classList.add('opacity-40', 'border-slate-800');
            p2Card.classList.remove('border-amber-500/40', 'bg-amber-950/40');
        } else {
            p2Card.classList.remove('opacity-40', 'border-slate-800');
            p2Card.classList.add('border-amber-500/40', 'bg-amber-950/40');
            p1Card.classList.add('opacity-40', 'border-slate-800');
            p1Card.classList.remove('border-sky-500/40', 'bg-sky-950/40');
        }
    }

    const diagP1Score = document.getElementById('diag-p1-score');
    const diagP2Score = document.getElementById('diag-p2-score');
    if (diagP1Score) diagP1Score.innerText = phase === 'phase1' ? `${score}%` : (diag.p1Score ? `${diag.p1Score}%` : '-');
    if (diagP2Score) diagP2Score.innerText = phase === 'phase2' ? `${score}%` : (diag.p2Score ? `${diag.p2Score}%` : '-');

    const strengthsList = document.getElementById('diag-strengths-list');
    if (strengthsList) strengthsList.innerHTML = (diag.strengths || []).map(s => `<li>${s}</li>`).join('') || '<li>Estructura pedagógica adecuada.</li>';

    const risksList = document.getElementById('diag-risks-list');
    if (risksList) risksList.innerHTML = (diag.risks || []).map(r => `<li>${r}</li>`).join('') || '<li>Sin riesgos técnicos críticos detectados.</li>';

    const improvementsList = document.getElementById('diag-improvements-list');
    if (improvementsList) improvementsList.innerHTML = (diag.improvements || []).map(i => `<li>${i}</li>`).join('') || '<li>Diseño listo para ejecución.</li>';

    const applyBtn = document.getElementById('btn-apply-ai-opt');
    if (applyBtn) {
        applyBtn.innerHTML = phase === 'phase1'
            ? `<i class="fa-solid fa-bolt"></i> <span>Aplicar Entrada Optimizada (T-C-R)</span>`
            : `<i class="fa-solid fa-bolt"></i> <span>Aplicar Guía de Control Optimizada (E-I)</span>`;
    }

    const p1Container = document.getElementById('diag-p1-fields-container');
    const p2Container = document.getElementById('diag-p2-fields-container');
    const countBadge = document.getElementById('diag-preview-count-badge');

    const opt = diag.optimizedPrompt || {};

    if (phase === 'phase1') {
        if (p1Container) p1Container.classList.remove('hidden');
        if (p2Container) p2Container.classList.add('hidden');
        if (countBadge) countBadge.innerText = '3 campos (T-C-R)';

        const origTaskEl = document.getElementById('diag-orig-task');
        const editTaskEl = document.getElementById('diag-edit-task');
        if (origTaskEl) origTaskEl.innerText = currentAuditOriginal.task || '(Campo vacío)';
        if (editTaskEl) editTaskEl.value = opt.task || currentAuditOriginal.task || '';

        const origCtxEl = document.getElementById('diag-orig-context');
        const editCtxEl = document.getElementById('diag-edit-context');
        if (origCtxEl) origCtxEl.innerText = currentAuditOriginal.context || '(Campo vacío)';
        if (editCtxEl) editCtxEl.value = opt.context || currentAuditOriginal.context || '';

        const origRefEl = document.getElementById('diag-orig-ref');
        const editRefEl = document.getElementById('diag-edit-ref');
        if (origRefEl) origRefEl.innerText = currentAuditOriginal.ref || '(Campo vacío)';
        if (editRefEl) editRefEl.value = opt.ref || currentAuditOriginal.ref || '';

        ['task', 'context', 'ref'].forEach(f => onDiagFieldEdited(f));
    } else {
        if (p1Container) p1Container.classList.add('hidden');
        if (p2Container) p2Container.classList.remove('hidden');
        if (countBadge) countBadge.innerText = '2 campos (E-I)';

        const origEvalEl = document.getElementById('diag-orig-eval');
        const editEvalEl = document.getElementById('diag-edit-eval');
        if (origEvalEl) origEvalEl.innerText = currentAuditOriginal.eval || '(Campo vacío)';
        if (editEvalEl) editEvalEl.value = opt.eval || currentAuditOriginal.eval || '';

        const origIterEl = document.getElementById('diag-orig-iter');
        const editIterEl = document.getElementById('diag-edit-iter');
        if (origIterEl) origIterEl.innerText = currentAuditOriginal.iter || '(Campo vacío)';
        if (editIterEl) editIterEl.value = opt.iter || currentAuditOriginal.iter || '';

        ['eval', 'iter'].forEach(f => onDiagFieldEdited(f));
    }

    switchDiagModalTab('analysis');
    setDiagViewMode('split');

    const modal = document.getElementById('modal-ai-diagnosis');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    if (window.FontAwesome && window.FontAwesome.dom) window.FontAwesome.dom.i2svg();
}

export function closeAIDiagnosisModal() {
    const modal = document.getElementById('modal-ai-diagnosis');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

export function applyAIOptimization() {
    if (!state.latestDiagnosis) return;

    if (currentAuditPhase === 'phase1') {
        const editTaskEl = document.getElementById('diag-edit-task');
        const editCtxEl = document.getElementById('diag-edit-context');
        const editRefEl = document.getElementById('diag-edit-ref');

        const taskVal = editTaskEl ? editTaskEl.value : (state.latestDiagnosis.optimizedPrompt?.task || '');
        const ctxVal = editCtxEl ? editCtxEl.value : (state.latestDiagnosis.optimizedPrompt?.context || '');
        const refVal = editRefEl ? editRefEl.value : (state.latestDiagnosis.optimizedPrompt?.ref || '');

        if (taskVal !== undefined && document.getElementById('gen-task')) document.getElementById('gen-task').value = taskVal;
        if (ctxVal !== undefined && document.getElementById('gen-context')) document.getElementById('gen-context').value = ctxVal;
        if (refVal !== undefined && document.getElementById('gen-ref')) document.getElementById('gen-ref').value = refVal;

        if (state.aiAuditResults.phase1) {
            state.aiAuditResults.phase1.score = Math.max(95, state.aiAuditResults.phase1.score || 95);
            state.aiAuditResults.phase1.label = 'Optimizado por IA';
            state.aiAuditResults.phase1.tip = 'Versión refinada por IA aplicada con éxito.';
        }
        showToast("¡Entrada T-C-R Optimizada!", "Se han aplicado las mejoras revisadas a Tarea, Contexto y Referencias.", "bolt");
    } else {
        const editEvalEl = document.getElementById('diag-edit-eval');
        const editIterEl = document.getElementById('diag-edit-iter');

        const evalVal = editEvalEl ? editEvalEl.value : (state.latestDiagnosis.optimizedPrompt?.eval || '');
        const iterVal = editIterEl ? editIterEl.value : (state.latestDiagnosis.optimizedPrompt?.iter || '');

        if (evalVal !== undefined && document.getElementById('gen-eval')) document.getElementById('gen-eval').value = evalVal;
        if (iterVal !== undefined && document.getElementById('gen-iter')) document.getElementById('gen-iter').value = iterVal;

        if (state.aiAuditResults.phase2) {
            state.aiAuditResults.phase2.score = Math.max(95, state.aiAuditResults.phase2.score || 95);
            state.aiAuditResults.phase2.label = 'Optimizado por IA';
            state.aiAuditResults.phase2.tip = 'Guía de control docente refinada por IA aplicada.';
        }
        showToast("¡Control Docente E-I Optimizado!", "Se han aplicado las mejoras revisadas a Criterios de Evaluación e Iteración.", "bolt");
    }

    buildPrompt();
    closeAIDiagnosisModal();
}
