/**
 * =============================================================================
 * KIT IA DOCENTES FP - HISTORIAL DE VERSIONES Y TIMELINE (v1.3.0)
 * =============================================================================
 */

import { showToast } from '../core/toast.js';
import { escapeHtml } from '../core/utils.js';
import {
    getSavedPrompts,
    saveSavedPrompts,
    getVersion,
    getActiveVersion,
    renderPromptBank,
    loadPromptToDesigner,
    setPromptActiveVersion,
    editVersionCommentPrompt
} from './prompt-bank.js';

let editingHistoryPromptId = null;

export function openPromptHistoryModal(promptId) {
    editingHistoryPromptId = promptId;
    renderPromptHistoryTimeline(promptId);
    const modal = document.getElementById('modal-prompt-history');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
    if (window.FontAwesome && window.FontAwesome.dom) window.FontAwesome.dom.i2svg();
}

export function closePromptHistoryModal() {
    const modal = document.getElementById('modal-prompt-history');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
    editingHistoryPromptId = null;
}

export function renderPromptHistoryTimeline(promptId) {
    const list = getSavedPrompts();
    const item = list.find(p => p.id === promptId);
    if (!item) {
        closePromptHistoryModal();
        return;
    }

    const titleEl = document.getElementById('history-modal-title');
    const subtitleEl = document.getElementById('history-modal-subtitle');
    const container = document.getElementById('history-versions-list');
    const summaryEl = document.getElementById('history-version-count-summary');

    if (titleEl) titleEl.innerText = `Historial: "${item.title}"`;
    if (subtitleEl) subtitleEl.innerText = `Familia: ${item.familyName || item.familyCode || 'General'} • Total de iteraciones guardadas: ${item.versions?.length || 1}`;
    if (summaryEl) summaryEl.innerText = `${item.versions?.length || 1} versión/es registrada/s`;

    if (!container) return;

    const versions = [...(item.versions || [])].reverse(); // más recientes primero

    container.innerHTML = versions.map((ver) => {
        const isActive = ver.versionId === item.activeVersionId;
        const dateStr = ver.createdAt ? new Date(ver.createdAt).toLocaleString('es-ES') : '-';

        return `
            <div class="p-4 rounded-2xl bg-slate-950 border ${isActive ? 'border-emerald-500/50 bg-emerald-950/10' : 'border-slate-800'} space-y-3 shadow-md">
                <div class="flex flex-wrap justify-between items-center gap-2 border-b border-slate-900 pb-2">
                    <div class="flex items-center gap-2">
                        <span class="font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg ${isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-900 text-slate-300 border border-slate-800'}">
                            v${ver.versionNumber}
                        </span>
                        ${isActive ? `<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">★ Activa</span>` : ''}
                        <span class="text-[11px] text-slate-400"><i class="fa-regular fa-clock text-[10px]"></i> ${dateStr}</span>
                    </div>

                    <div class="flex items-center gap-1.5">
                        <button onclick="loadPromptToDesigner('${item.id}', '${ver.versionId}')" title="Cargar esta versión en el Diseñador" class="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-1 rounded-lg transition flex items-center gap-1">
                            <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i> Cargar
                        </button>
                        ${!isActive ? `
                            <button onclick="setPromptActiveVersion('${item.id}', '${ver.versionId}')" title="Establecer como versión activa" class="text-xs bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-700 px-2.5 py-1 rounded-lg transition">
                                Hacer Activa
                            </button>
                        ` : ''}
                        <button onclick="editVersionCommentPrompt('${item.id}', '${ver.versionId}')" title="Editar comentario de esta versión" class="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 p-1.5 rounded-lg transition">
                            <i class="fa-regular fa-pen-to-square"></i>
                        </button>
                        ${versions.length > 1 ? `
                            <button onclick="deletePromptVersion('${item.id}', '${ver.versionId}')" title="Eliminar esta versión" class="text-xs bg-slate-900 hover:bg-rose-950 text-rose-400 border border-slate-800 hover:border-rose-800 p-1.5 rounded-lg transition">
                                <i class="fa-regular fa-trash-can"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>

                <!-- COMENTARIO DE LA VERSIÓN -->
                <div class="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                    <span class="text-emerald-400 font-bold">Comentario / Registro de cambios:</span>
                    <p class="mt-0.5 text-slate-200 leading-relaxed">${escapeHtml(ver.versionComment || 'Sin comentario específico.')}</p>
                </div>

                <!-- RESUMEN TCREI -->
                <div class="grid sm:grid-cols-2 gap-2 text-[11px] text-slate-400">
                    <div class="bg-slate-900/30 p-2 rounded-lg border border-slate-800/50">
                        <strong class="text-sky-400">T:</strong> ${escapeHtml(ver.task ? ver.task.substring(0, 90) + '...' : 'No definido')}
                    </div>
                    <div class="bg-slate-900/30 p-2 rounded-lg border border-slate-800/50">
                        <strong class="text-amber-400">E:</strong> ${escapeHtml(ver.eval ? ver.eval.substring(0, 90) + '...' : 'No definido')}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    if (window.FontAwesome && window.FontAwesome.dom) window.FontAwesome.dom.i2svg();
}

export function deletePromptVersion(promptId, versionId) {
    const list = getSavedPrompts();
    const item = list.find(p => p.id === promptId);
    if (!item || !item.versions || item.versions.length <= 1) {
        showToast("No se puede eliminar", "Un prompt debe contener al menos una versión.", "trash");
        return;
    }

    const ver = getVersion(item, versionId);
    if (confirm(`¿Estás seguro de que deseas eliminar la versión v${ver.versionNumber} de "${item.title}"?`)) {
        item.versions = item.versions.filter(v => v.versionId !== versionId);
        if (item.activeVersionId === versionId) {
            item.activeVersionId = item.versions[item.versions.length - 1].versionId;
        }
        const newActiveVer = getActiveVersion(item);
        item.task = newActiveVer.task;
        item.context = newActiveVer.context;
        item.ref = newActiveVer.ref;
        item.eval = newActiveVer.eval;
        item.iter = newActiveVer.iter;
        item.updatedAt = new Date().toISOString();

        saveSavedPrompts(list);
        renderPromptBank();
        renderPromptHistoryTimeline(promptId);
        showToast("Versión Eliminada", `Se eliminó la versión v${ver.versionNumber}.`, "trash");
    }
}
