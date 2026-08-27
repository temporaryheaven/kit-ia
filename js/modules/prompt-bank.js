/**
 * =============================================================================
 * KIT IA DOCENTES FP - BANCO DE PROMPTS Y MOTOR DE PERSISTENCIA LOCAL (v1.3.0)
 * =============================================================================
 */

import { STORAGE_KEY_PROMPTS } from '../config.js';
import { FP_FAMILIES } from '../data/incual-families.js';
import { state } from '../core/state.js';
import { showToast } from '../core/toast.js';
import { escapeHtml } from '../core/utils.js';
import { switchTab } from './ui-helpers.js';
import { onPhase1Input, onPhase2Input, buildPrompt } from './generator.js';

let bankCardSelectedVersion = {};
let currentWorkingPromptId = null;
let currentWorkingVersionId = null;
let currentGeneratorFamily = 'GEN';

export function getActiveVersion(prompt) {
    if (!prompt || !prompt.versions || !prompt.versions.length) {
        return {
            versionId: 'v_default',
            versionNumber: 1,
            versionComment: 'Versión inicial',
            task: prompt?.task || '',
            context: prompt?.context || '',
            ref: prompt?.ref || '',
            eval: prompt?.eval || '',
            iter: prompt?.iter || '',
            createdAt: prompt?.createdAt || new Date().toISOString()
        };
    }
    const active = prompt.versions.find(v => v.versionId === prompt.activeVersionId);
    return active || prompt.versions[prompt.versions.length - 1];
}

export function getVersion(prompt, versionId) {
    if (!prompt || !prompt.versions || !prompt.versions.length) {
        return getActiveVersion(prompt);
    }
    if (!versionId) return getActiveVersion(prompt);
    const found = prompt.versions.find(v => v.versionId === versionId);
    return found || getActiveVersion(prompt);
}

export function getSavedPrompts() {
    try {
        const data = localStorage.getItem(STORAGE_KEY_PROMPTS);
        if (!data) return [];
        let list = JSON.parse(data);
        if (!Array.isArray(list)) return [];

        let modified = false;
        list = list.map(item => {
            if (!item || typeof item !== 'object') return null;

            // Migración automática si el prompt no cuenta con estructura de versiones
            if (!item.versions || !Array.isArray(item.versions) || item.versions.length === 0) {
                const initialVerId = 'v_' + (item.createdAt ? new Date(item.createdAt).getTime() : Date.now()) + '_' + Math.random().toString(36).substring(2, 6);
                item.versions = [{
                    versionId: initialVerId,
                    versionNumber: 1,
                    versionComment: item.versionComment || item.notes || 'Versión inicial',
                    task: item.task || '',
                    context: item.context || '',
                    ref: item.ref || '',
                    eval: item.eval || '',
                    iter: item.iter || '',
                    createdAt: item.createdAt || new Date().toISOString()
                }];
                item.activeVersionId = initialVerId;
                modified = true;
            }

            // Asegurar que activeVersionId apunta a una versión existente
            if (!item.activeVersionId || !item.versions.some(v => v.versionId === item.activeVersionId)) {
                item.activeVersionId = item.versions[item.versions.length - 1].versionId;
                modified = true;
            }

            // Sincronizar campos raíz con la versión activa para retrocompatibilidad
            const activeVer = getActiveVersion(item);
            item.task = activeVer.task || '';
            item.context = activeVer.context || '';
            item.ref = activeVer.ref || '';
            item.eval = activeVer.eval || '';
            item.iter = activeVer.iter || '';

            return item;
        }).filter(Boolean);

        if (modified) {
            localStorage.setItem(STORAGE_KEY_PROMPTS, JSON.stringify(list));
        }
        return list;
    } catch (err) {
        console.error("Error reading saved prompts:", err);
        return [];
    }
}

export function saveSavedPrompts(list) {
    localStorage.setItem(STORAGE_KEY_PROMPTS, JSON.stringify(list));
    updatePromptBankCounterBadge();
}

export function updatePromptBankCounterBadge() {
    const list = getSavedPrompts();
    const badge = document.getElementById('prompt-bank-counter-badge');
    if (badge) {
        badge.innerText = list.length;
    }
}

export function populateSavePromptFamilyDropdown() {
    const select = document.getElementById('save-prompt-family');
    if (!select) return;

    select.innerHTML = '<option value="GEN">General / Módulos Transversales</option>';
    if (typeof FP_FAMILIES !== 'undefined') {
        FP_FAMILIES.forEach(f => {
            const opt = document.createElement('option');
            opt.value = f.code;
            opt.innerText = `${f.code} - ${f.name}`;
            select.appendChild(opt);
        });
    }
}

export function populateSavePromptFamilyFilter(selectedFamily = null) {
    const select = document.getElementById('save-prompt-family-filter');
    if (!select) return;

    let html = '';
    if (typeof FP_FAMILIES !== 'undefined') {
        FP_FAMILIES.forEach(f => {
            html += `<option value="${f.code}">${f.code} - ${f.name}</option>`;
        });
    }
    html += '<option value="GEN">GEN - General / Transversal</option>';
    html += '<option value="ALL">★ Todas las Familias</option>';
    select.innerHTML = html;

    if (selectedFamily) {
        select.value = selectedFamily;
    } else {
        select.value = currentGeneratorFamily || 'GEN';
    }
}

export function onSaveVersionFamilyFilterChange() {
    populateSavePromptTargetSelect();
}

export function populateSavePromptTargetSelect() {
    const menu = document.getElementById('save-target-dropdown-menu');
    const hiddenInput = document.getElementById('save-prompt-target-select');
    const triggerText = document.getElementById('save-target-trigger-text');
    const filterSelect = document.getElementById('save-prompt-family-filter');
    if (!menu || !hiddenInput || !triggerText) return;

    const filterFamily = filterSelect ? filterSelect.value : (currentGeneratorFamily || 'GEN');
    const list = getSavedPrompts();

    let filtered = list;
    if (filterFamily !== 'ALL') {
        filtered = list.filter(p => (p.familyCode || 'GEN') === filterFamily);
    }

    if (filtered.length === 0) {
        menu.innerHTML = `
            <div class="p-3 text-center text-xs text-slate-400 space-y-1.5">
                <p>No tienes prompts guardados en la familia <strong>${filterFamily}</strong>.</p>
                <button type="button" onclick="document.getElementById('save-prompt-family-filter').value='ALL'; populateSavePromptTargetSelect();" class="text-xs text-brand-400 hover:text-brand-300 underline font-medium">
                    Mostrar prompts de todas las familias
                </button>
            </div>
        `;
        hiddenInput.value = '';
        triggerText.innerHTML = `<span class="text-slate-500 italic">No hay prompts en la familia ${filterFamily}</span>`;
        onSavePromptTargetChange();
        return;
    }

    menu.innerHTML = filtered.map(p => {
        const activeVer = getActiveVersion(p);
        const isSelected = hiddenInput.value === p.id;
        return `
            <div class="p-2.5 rounded-xl hover:bg-slate-800/90 cursor-pointer transition border ${isSelected ? 'border-emerald-500/60 bg-emerald-950/30' : 'border-transparent hover:border-emerald-500/40'} space-y-1 group"
                 onmouseenter="showPromptHoverPopup('${p.id}', event)"
                 onmouseleave="hidePromptHoverPopup()"
                 onclick="selectSaveTargetPrompt('${p.id}')">
                <div class="flex items-center justify-between gap-1.5">
                    <div class="flex items-center gap-1.5 overflow-hidden">
                        <span class="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 shrink-0">${escapeHtml(p.familyCode || 'GEN')}</span>
                        <span class="text-[10px] font-mono text-emerald-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 shrink-0 font-bold">ID: ${escapeHtml(p.id)}</span>
                    </div>
                    <span class="text-[10px] font-mono text-slate-400 shrink-0">v${activeVer.versionNumber} (${p.versions?.length || 1} ver)</span>
                </div>
                <div class="text-xs font-bold text-white group-hover:text-emerald-300 truncate transition">
                    ${escapeHtml(p.title || 'Sin Título')}
                </div>
                <div class="text-[11px] text-slate-400 truncate">
                    <span class="text-slate-500 font-mono">v${activeVer.versionNumber}:</span> ${escapeHtml(activeVer.versionComment || 'Sin comentario')}
                </div>
            </div>
        `;
    }).join('');

    let targetToSelect = filtered.find(p => p.id === hiddenInput.value)?.id;
    if (!targetToSelect && currentWorkingPromptId && filtered.some(p => p.id === currentWorkingPromptId)) {
        targetToSelect = currentWorkingPromptId;
    }
    if (!targetToSelect) {
        targetToSelect = filtered[0].id;
    }

    selectSaveTargetPrompt(targetToSelect);
}

export function selectSaveTargetPrompt(promptId) {
    const hiddenInput = document.getElementById('save-prompt-target-select');
    const triggerText = document.getElementById('save-target-trigger-text');
    const menu = document.getElementById('save-target-dropdown-menu');

    if (hiddenInput) hiddenInput.value = promptId;

    const list = getSavedPrompts();
    const target = list.find(p => p.id === promptId);

    if (target && triggerText) {
        const activeVer = getActiveVersion(target);
        triggerText.innerHTML = `
            <div class="flex items-center gap-1.5 truncate">
                <span class="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 shrink-0">${escapeHtml(target.familyCode || 'GEN')}</span>
                <span class="text-[10px] font-mono text-emerald-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 font-bold shrink-0">ID: ${escapeHtml(target.id)}</span>
                <span class="font-bold text-white truncate">${escapeHtml(target.title || 'Sin Título')}</span>
                <span class="text-[10px] font-mono text-slate-400 shrink-0">(v${activeVer.versionNumber})</span>
            </div>
        `;
    } else if (triggerText) {
        triggerText.innerHTML = `<span class="text-slate-400 italic">Selecciona un prompt...</span>`;
    }

    if (menu) menu.classList.add('hidden');
    hidePromptHoverPopup();
    onSavePromptTargetChange();
}

export function toggleSaveTargetDropdown(event) {
    if (event) event.stopPropagation();
    const menu = document.getElementById('save-target-dropdown-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

export function showPromptHoverPopup(promptId, event) {
    const popup = document.getElementById('save-target-hover-popup');
    if (!popup) return;

    const list = getSavedPrompts();
    const p = list.find(item => item.id === promptId);
    if (!p) return;

    const activeVer = getActiveVersion(p);
    const dateStr = activeVer.createdAt ? new Date(activeVer.createdAt).toLocaleDateString('es-ES') : '';

    popup.innerHTML = `
        <div class="border-b border-slate-800 pb-2.5 space-y-1">
            <div class="flex items-center justify-between gap-2">
                <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                    ${escapeHtml(p.familyCode || 'GEN')} • ${escapeHtml(p.familyName || 'General')}
                </span>
                <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ★ Versión Activa: v${activeVer.versionNumber} ${dateStr ? `(${dateStr})` : ''}
                </span>
            </div>
            <h4 class="font-heading font-extrabold text-white text-sm leading-snug">
                ${escapeHtml(p.title || 'Sin Título')}
            </h4>
            <div class="text-[11px] font-mono text-emerald-400 font-bold">
                ID: ${escapeHtml(p.id)} • Total versiones: ${p.versions?.length || 1}
            </div>
        </div>

        <div class="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200 leading-relaxed shadow-sm">
            <i class="fa-solid fa-comment-dots text-emerald-400"></i>
            <strong>Nota de v${activeVer.versionNumber}:</strong> ${escapeHtml(activeVer.versionComment || 'Sin comentario específico.')}
        </div>

        <div class="p-3 rounded-xl bg-slate-900 border border-sky-500/30 space-y-1.5 text-xs">
            <span class="text-sky-300 font-heading font-bold text-[11px] flex items-center gap-1">
                <i class="fa-solid fa-arrow-right-to-bracket text-sky-400"></i> Entrada TCREI (T-C-R):
            </span>
            <p class="text-slate-200 whitespace-pre-wrap leading-relaxed"><strong class="text-sky-400">T (Tarea/Rol):</strong> ${escapeHtml(activeVer.task || 'No definido')}</p>
            <p class="text-slate-300 whitespace-pre-wrap leading-relaxed"><strong class="text-teal-400">C (Contexto):</strong> ${escapeHtml(activeVer.context || 'No definido')}</p>
            <p class="text-slate-400 whitespace-pre-wrap leading-relaxed"><strong class="text-indigo-400">R (Referencias):</strong> ${escapeHtml(activeVer.ref || 'No definido')}</p>
        </div>

        <div class="p-3 rounded-xl bg-slate-900 border border-amber-500/30 space-y-1.5 text-xs">
            <span class="text-amber-300 font-heading font-bold text-[11px] flex items-center gap-1">
                <i class="fa-solid fa-arrows-rotate text-amber-400"></i> Control & Iteración (E-I):
            </span>
            <p class="text-slate-200 whitespace-pre-wrap leading-relaxed"><strong class="text-amber-400">E (Evaluar):</strong> ${escapeHtml(activeVer.eval || 'No definido')}</p>
            <p class="text-slate-300 whitespace-pre-wrap leading-relaxed"><strong class="text-purple-400">I (Iterar):</strong> ${escapeHtml(activeVer.iter || 'No definido')}</p>
        </div>

        ${p.notes ? `
            <div class="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 italic">
                <i class="fa-regular fa-note-sticky text-amber-400/80"></i> <strong>Notas generales:</strong> ${escapeHtml(p.notes)}
            </div>
        ` : ''}
    `;

    const modalEl = document.querySelector('#modal-save-prompt > div');
    const popupWidth = 440;
    const popupHeight = 520;
    const windowW = window.innerWidth;
    const windowH = window.innerHeight;

    let left = 20;
    let top = 20;

    if (modalEl) {
        const modalRect = modalEl.getBoundingClientRect();
        if (modalRect.right + popupWidth + 20 <= windowW) {
            left = modalRect.right + 14;
            top = Math.max(15, Math.min(modalRect.top, windowH - popupHeight - 20));
        } else if (modalRect.left - popupWidth - 20 >= 0) {
            left = modalRect.left - popupWidth - 14;
            top = Math.max(15, Math.min(modalRect.top, windowH - popupHeight - 20));
        } else {
            left = Math.max(10, (windowW - popupWidth) / 2);
            top = 15;
        }
    } else if (event && event.currentTarget) {
        const rect = event.currentTarget.getBoundingClientRect();
        left = (rect.right + popupWidth + 20 <= windowW) ? (rect.right + 12) : Math.max(10, rect.left - popupWidth - 12);
        top = Math.max(15, Math.min(rect.top, windowH - popupHeight - 20));
    }

    popup.style.left = `${Math.round(left)}px`;
    popup.style.top = `${Math.round(top)}px`;
    popup.style.width = `${Math.min(popupWidth, windowW - 24)}px`;

    popup.classList.remove('hidden');
}

export function hidePromptHoverPopup() {
    const popup = document.getElementById('save-target-hover-popup');
    if (popup) popup.classList.add('hidden');
}

export function setSavePromptMode(mode) {
    state.savePromptMode = mode;
    const tabNew = document.getElementById('save-mode-tab-new');
    const tabVer = document.getElementById('save-mode-tab-version');
    const sectionNew = document.getElementById('save-section-new-prompt');
    const sectionVer = document.getElementById('save-section-new-version');
    const submitBtnText = document.getElementById('save-prompt-submit-text');

    if (mode === 'new_version') {
        if (tabNew) {
            tabNew.classList.remove('bg-emerald-600', 'text-white', 'shadow-md');
            tabNew.classList.add('text-slate-400', 'hover:text-slate-200');
        }
        if (tabVer) {
            tabVer.classList.add('bg-emerald-600', 'text-white', 'shadow-md');
            tabVer.classList.remove('text-slate-400', 'hover:text-slate-200');
        }
        if (sectionNew) sectionNew.classList.add('hidden');
        if (sectionVer) sectionVer.classList.remove('hidden');

        const list = getSavedPrompts();
        const currentFamily = (currentWorkingPromptId ? list.find(p => p.id === currentWorkingPromptId)?.familyCode : null) || currentGeneratorFamily || document.getElementById('save-prompt-family')?.value || 'GEN';
        populateSavePromptFamilyFilter(currentFamily);
        populateSavePromptTargetSelect();
        onSavePromptTargetChange();
        if (submitBtnText) submitBtnText.innerText = 'Guardar Nueva Versión';
    } else {
        if (tabNew) {
            tabNew.classList.add('bg-emerald-600', 'text-white', 'shadow-md');
            tabNew.classList.remove('text-slate-400', 'hover:text-slate-200');
        }
        if (tabVer) {
            tabVer.classList.remove('bg-emerald-600', 'text-white', 'shadow-md');
            tabVer.classList.add('text-slate-400', 'hover:text-slate-200');
        }
        if (sectionNew) sectionNew.classList.remove('hidden');
        if (sectionVer) sectionVer.classList.add('hidden');
        if (submitBtnText) submitBtnText.innerText = 'Guardar en Mi Banco';
    }
}

export function onSavePromptTargetChange() {
    const hiddenInput = document.getElementById('save-prompt-target-select');
    const infoCard = document.getElementById('save-prompt-target-info');
    if (!hiddenInput || !infoCard) return;

    const targetId = hiddenInput.value;
    const list = getSavedPrompts();
    const targetPrompt = list.find(p => p.id === targetId);

    if (targetPrompt) {
        const nextVerNum = (targetPrompt.versions ? targetPrompt.versions.reduce((max, v) => Math.max(max, v.versionNumber || 0), 0) : 1) + 1;
        infoCard.innerHTML = `
            <div class="flex items-center justify-between text-xs">
                <span class="text-slate-400">Prompt seleccionado:</span>
                <span class="font-bold text-white truncate max-w-xs">${escapeHtml(targetPrompt.title)}</span>
            </div>
            <div class="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                <span class="text-slate-400">ID del prompt:</span>
                <span class="font-mono text-emerald-400 font-bold">${escapeHtml(targetPrompt.id)}</span>
            </div>
            <div class="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                <span class="text-slate-400">Versiones actuales:</span>
                <span class="font-mono text-slate-300">${targetPrompt.versions?.length || 1} versión/es</span>
            </div>
            <div class="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                <span class="text-slate-400">Nueva versión que se creará:</span>
                <span class="font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">v${nextVerNum}</span>
            </div>
        `;
    } else {
        infoCard.innerHTML = `<span class="text-xs text-amber-400">Selecciona un prompt para añadir la nueva versión.</span>`;
    }
}

export function openSavePromptModal(editId = null) {
    populateSavePromptFamilyDropdown();
    state.currentEditingPromptId = editId;
    const modal = document.getElementById('modal-save-prompt');
    const titleInput = document.getElementById('save-prompt-title');
    const familySelect = document.getElementById('save-prompt-family');
    const tagsInput = document.getElementById('save-prompt-tags');
    const notesInput = document.getElementById('save-prompt-notes');
    const versionCommentInput = document.getElementById('save-prompt-version-comment');
    const modalHeading = document.getElementById('save-prompt-modal-heading');
    const submitBtnText = document.getElementById('save-prompt-submit-text');
    const modeTabsContainer = document.getElementById('save-prompt-mode-tabs');

    const list = getSavedPrompts();
    const currentFamily = (currentWorkingPromptId ? list.find(p => p.id === currentWorkingPromptId)?.familyCode : null) || currentGeneratorFamily || 'GEN';

    if (editId) {
        if (modeTabsContainer) modeTabsContainer.classList.add('hidden');
        setSavePromptMode('new_prompt');

        const item = list.find(p => p.id === editId);
        if (item) {
            const activeVer = getActiveVersion(item);
            if (modalHeading) modalHeading.innerHTML = '<i class="fa-solid fa-pen-to-square text-amber-400"></i> Editar Metadatos del Prompt';
            if (titleInput) titleInput.value = item.title || '';
            if (familySelect) familySelect.value = item.familyCode || 'GEN';
            if (tagsInput) tagsInput.value = (item.tags || []).join(', ');
            if (notesInput) notesInput.value = item.notes || '';
            if (versionCommentInput) versionCommentInput.value = activeVer.versionComment || '';
            if (submitBtnText) submitBtnText.innerText = 'Guardar Cambios';
        }
    } else {
        if (modeTabsContainer) modeTabsContainer.classList.remove('hidden');
        if (modalHeading) modalHeading.innerHTML = '<i class="fa-solid fa-floppy-disk text-emerald-400"></i> Guardar Prompt en Mi Banco';

        const task = document.getElementById('gen-task')?.value.trim() || '';
        if (titleInput) {
            if (task) {
                const firstSentence = task.split('.')[0].replace(/^Actúa como docente (especialista )?en /i, '').trim();
                titleInput.value = firstSentence.length > 60 ? firstSentence.substring(0, 57) + '...' : firstSentence;
            } else {
                titleInput.value = `Prompt TCREI - ${new Date().toLocaleDateString('es-ES')}`;
            }
        }
        if (familySelect) familySelect.value = currentFamily;
        if (tagsInput) tagsInput.value = '';
        if (notesInput) notesInput.value = '';
        if (versionCommentInput) versionCommentInput.value = 'Versión inicial';

        if (currentWorkingPromptId && list.some(p => p.id === currentWorkingPromptId)) {
            setSavePromptMode('new_version');
            const newVerComment = document.getElementById('save-prompt-new-version-comment');
            if (newVerComment) newVerComment.value = '';
        } else {
            setSavePromptMode('new_prompt');
        }
    }

    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
    if (window.FontAwesome && window.FontAwesome.dom) window.FontAwesome.dom.i2svg();
}

export function closeSavePromptModal() {
    const modal = document.getElementById('modal-save-prompt');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
    hidePromptHoverPopup();
    const menu = document.getElementById('save-target-dropdown-menu');
    if (menu) menu.classList.add('hidden');
    state.currentEditingPromptId = null;
}

export function submitSavePrompt() {
    const list = getSavedPrompts();
    const now = new Date().toISOString();

    // MODO 1: EDITAR METADATOS DE UN PROMPT EXISTENTE
    if (state.currentEditingPromptId) {
        const title = document.getElementById('save-prompt-title')?.value.trim();
        const familyCode = document.getElementById('save-prompt-family')?.value;
        const tagsStr = document.getElementById('save-prompt-tags')?.value.trim();
        const notes = document.getElementById('save-prompt-notes')?.value.trim();
        const versionComment = document.getElementById('save-prompt-version-comment')?.value.trim() || '';

        if (!title) {
            showToast("Título Requerido", "Por favor, asigna un título o nombre a tu prompt.", "trash");
            return;
        }

        const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];
        let familyName = "General / Transversal";
        if (typeof FP_FAMILIES !== 'undefined') {
            const fam = FP_FAMILIES.find(f => f.code === familyCode);
            if (fam) familyName = fam.name;
        }

        const index = list.findIndex(p => p.id === state.currentEditingPromptId);
        if (index !== -1) {
            const item = list[index];
            item.title = title;
            item.familyCode = familyCode;
            item.familyName = familyName;
            item.tags = tags;
            item.notes = notes;
            item.updatedAt = now;

            if (item.versions && item.versions.length) {
                const activeVer = getActiveVersion(item);
                if (activeVer) {
                    activeVer.versionComment = versionComment;
                }
            }

            saveSavedPrompts(list);
            showToast("Prompt Actualizado", `"${title}" ha sido actualizado en tu banco.`, "check");
        }

        closeSavePromptModal();
        renderPromptBank();
        return;
    }

    // CAMPOS DEL DISEÑADOR TCREI
    const task = document.getElementById('gen-task')?.value.trim() || '';
    const context = document.getElementById('gen-context')?.value.trim() || '';
    const ref = document.getElementById('gen-ref')?.value.trim() || '';
    const evalCrit = document.getElementById('gen-eval')?.value.trim() || '';
    const iter = document.getElementById('gen-iter')?.value.trim() || '';

    if (!task && !context) {
        showToast("Diseñador Vacío", "Rellena al menos los campos del Diseñador antes de guardar.", "trash");
        return;
    }

    const sectionVer = document.getElementById('save-section-new-version');
    const isNewVersionMode = sectionVer && !sectionVer.classList.contains('hidden');

    // MODO 2: GUARDAR COMO NUEVA VERSIÓN DE UN PROMPT EXISTENTE
    if (isNewVersionMode) {
        const targetId = document.getElementById('save-prompt-target-select')?.value;
        const versionComment = document.getElementById('save-prompt-new-version-comment')?.value.trim();

        if (!targetId) {
            showToast("Selecciona un Prompt", "Debes seleccionar un prompt existente para añadirle la nueva versión.", "trash");
            return;
        }

        const index = list.findIndex(p => p.id === targetId);
        if (index === -1) {
            showToast("Prompt no encontrado", "El prompt seleccionado ya no existe en el banco.", "trash");
            return;
        }

        const targetPrompt = list[index];
        if (!targetPrompt.versions) targetPrompt.versions = [];

        const nextVerNum = targetPrompt.versions.reduce((max, v) => Math.max(max, v.versionNumber || 0), 0) + 1;
        const newVersionId = 'v_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);

        const newVersion = {
            versionId: newVersionId,
            versionNumber: nextVerNum,
            versionComment: versionComment || `Versión ${nextVerNum}`,
            task,
            context,
            ref,
            eval: evalCrit,
            iter,
            createdAt: now
        };

        targetPrompt.versions.push(newVersion);
        targetPrompt.activeVersionId = newVersionId;
        targetPrompt.updatedAt = now;
        targetPrompt.task = task;
        targetPrompt.context = context;
        targetPrompt.ref = ref;
        targetPrompt.eval = evalCrit;
        targetPrompt.iter = iter;

        currentWorkingPromptId = targetPrompt.id;
        currentWorkingVersionId = newVersionId;
        bankCardSelectedVersion[targetPrompt.id] = newVersionId;

        saveSavedPrompts(list);
        showToast("¡Nueva Versión Guardada!", `Se ha guardado la versión v${nextVerNum} de "${targetPrompt.title}".`, "check");
    }
    // MODO 3: GUARDAR COMO NUEVO PROMPT INDEPENDIENTE (CON v1)
    else {
        const title = document.getElementById('save-prompt-title')?.value.trim();
        const familyCode = document.getElementById('save-prompt-family')?.value;
        const tagsStr = document.getElementById('save-prompt-tags')?.value.trim();
        const notes = document.getElementById('save-prompt-notes')?.value.trim();
        const versionComment = document.getElementById('save-prompt-version-comment')?.value.trim() || 'Versión inicial';

        if (!title) {
            showToast("Título Requerido", "Por favor, asigna un título o nombre a tu prompt.", "trash");
            return;
        }

        const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];
        let familyName = "General / Transversal";
        if (typeof FP_FAMILIES !== 'undefined') {
            const fam = FP_FAMILIES.find(f => f.code === familyCode);
            if (fam) familyName = fam.name;
        }

        const newPromptId = 'tcrei_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
        const initialVersionId = 'v_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);

        const newPrompt = {
            id: newPromptId,
            title,
            familyCode,
            familyName,
            tags,
            notes,
            activeVersionId: initialVersionId,
            versions: [
                {
                    versionId: initialVersionId,
                    versionNumber: 1,
                    versionComment,
                    task,
                    context,
                    ref,
                    eval: evalCrit,
                    iter,
                    createdAt: now
                }
            ],
            task,
            context,
            ref,
            eval: evalCrit,
            iter,
            createdAt: now,
            updatedAt: now
        };

        list.unshift(newPrompt);
        currentWorkingPromptId = newPromptId;
        currentWorkingVersionId = initialVersionId;
        bankCardSelectedVersion[newPromptId] = initialVersionId;

        saveSavedPrompts(list);
        showToast("¡Prompt Guardado!", `Guardado en Mi Banco de Prompts (${list.length} en total).`, "check");
    }

    closeSavePromptModal();
    renderPromptBank();
}

export function populateBankFilterFamilyDropdown() {
    const select = document.getElementById('bank-filter-family');
    if (!select || select.options.length > 1) return;

    select.innerHTML = '<option value="ALL">Todas las Familias</option><option value="GEN">General / Transversal</option>';
    if (typeof FP_FAMILIES !== 'undefined') {
        FP_FAMILIES.forEach(f => {
            const opt = document.createElement('option');
            opt.value = f.code;
            opt.innerText = `${f.code} - ${f.name}`;
            select.appendChild(opt);
        });
    }
}

export function openPromptBankModal() {
    populateBankFilterFamilyDropdown();
    renderPromptBank();
    const modal = document.getElementById('modal-prompt-bank');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
    if (window.FontAwesome && window.FontAwesome.dom) window.FontAwesome.dom.i2svg();
}

export function closePromptBankModal() {
    const modal = document.getElementById('modal-prompt-bank');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

export function changePromptCardVersion(promptId, versionId) {
    bankCardSelectedVersion[promptId] = versionId;
    renderPromptBank();
}

export function setPromptActiveVersion(promptId, versionId) {
    const list = getSavedPrompts();
    const item = list.find(p => p.id === promptId);
    if (!item) return;

    const targetVer = getVersion(item, versionId);
    item.activeVersionId = versionId;
    item.updatedAt = new Date().toISOString();
    item.task = targetVer.task;
    item.context = targetVer.context;
    item.ref = targetVer.ref;
    item.eval = targetVer.eval;
    item.iter = targetVer.iter;

    bankCardSelectedVersion[promptId] = versionId;
    saveSavedPrompts(list);
    renderPromptBank();
    showToast("Versión Activa Actualizada", `La versión v${targetVer.versionNumber} es ahora la versión principal de "${item.title}".`, "check");
}

export function editVersionCommentPrompt(promptId, versionId) {
    const list = getSavedPrompts();
    const item = list.find(p => p.id === promptId);
    if (!item) return;

    const ver = getVersion(item, versionId);
    const currentComment = ver.versionComment || '';
    const newComment = prompt(`Editar comentario de la versión v${ver.versionNumber} para "${item.title}":`, currentComment);

    if (newComment !== null) {
        ver.versionComment = newComment.trim();
        saveSavedPrompts(list);
        renderPromptBank();
        showToast("Comentario Actualizado", `Comentario de v${ver.versionNumber} actualizado.`, "check");
    }
}

export function renderPromptBank() {
    const container = document.getElementById('prompt-bank-list-container');
    const searchVal = (document.getElementById('bank-search-input')?.value || '').toLowerCase().trim();
    const familyFilter = document.getElementById('bank-filter-family')?.value || 'ALL';
    const countHeader = document.getElementById('bank-total-count-badge');

    const allPrompts = getSavedPrompts();
    if (countHeader) countHeader.innerText = `${allPrompts.length} guardados`;
    updatePromptBankCounterBadge();

    let filtered = allPrompts.filter(item => {
        const matchesFamily = familyFilter === 'ALL' || item.familyCode === familyFilter;
        const matchText = !searchVal ||
            (item.title && item.title.toLowerCase().includes(searchVal)) ||
            (item.task && item.task.toLowerCase().includes(searchVal)) ||
            (item.context && item.context.toLowerCase().includes(searchVal)) ||
            (item.familyName && item.familyName.toLowerCase().includes(searchVal)) ||
            (item.tags && item.tags.some(t => t.toLowerCase().includes(searchVal))) ||
            (item.versions && item.versions.some(v => (v.versionComment && v.versionComment.toLowerCase().includes(searchVal))));
        return matchesFamily && matchText;
    });

    if (!container) return;

    if (filtered.length === 0) {
        if (allPrompts.length === 0) {
            container.innerHTML = `
                <div class="p-10 text-center space-y-4 bg-slate-950/60 rounded-3xl border border-dashed border-slate-800">
                    <div class="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
                        <i class="fa-solid fa-box-archive"></i>
                    </div>
                    <div class="space-y-1">
                        <h4 class="font-heading font-extrabold text-white text-base sm:text-lg">Tu Banco de Prompts está vacío</h4>
                        <p class="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                            Guarda tus mejores estructuras pedagógicas y sus sucesivas versiones desde el Diseñador TCREI para reutilizarlas o sincronizarlas con Google Drive.
                        </p>
                    </div>
                    <div class="pt-2 flex flex-wrap justify-center gap-3">
                        <button onclick="closePromptBankModal(); openSavePromptModal();" class="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95">
                            <i class="fa-solid fa-floppy-disk"></i> Guardar Prompt Actual
                        </button>
                        <button onclick="triggerLocalRestore()" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl border border-slate-700 transition flex items-center gap-2">
                            <i class="fa-solid fa-file-import"></i> Importar Backup (.json)
                        </button>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="p-8 text-center space-y-3 bg-slate-950/40 rounded-2xl border border-slate-800">
                    <i class="fa-solid fa-magnifying-glass text-slate-500 text-2xl"></i>
                    <p class="text-sm text-slate-400">No se encontraron prompts que coincidan con los filtros de búsqueda.</p>
                    <button onclick="document.getElementById('bank-search-input').value=''; document.getElementById('bank-filter-family').value='ALL'; renderPromptBank();" class="text-xs text-brand-400 hover:underline">
                        Limpiar filtros
                    </button>
                </div>
            `;
        }
        if (window.FontAwesome && window.FontAwesome.dom) window.FontAwesome.dom.i2svg();
        return;
    }

    container.innerHTML = filtered.map(item => {
        const versions = item.versions || [];
        const selectedVerId = bankCardSelectedVersion[item.id] || item.activeVersionId || versions[versions.length - 1]?.versionId;
        const curVer = getVersion(item, selectedVerId);
        const isActive = curVer.versionId === item.activeVersionId;
        const dateStr = curVer.createdAt ? new Date(curVer.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
        const tagsHtml = (item.tags || []).map(t => `<span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800">#${escapeHtml(t)}</span>`).join('');

        const versionOptionsHtml = versions.map(v => {
            const isAct = v.versionId === item.activeVersionId;
            const vDate = v.createdAt ? new Date(v.createdAt).toLocaleDateString('es-ES') : '';
            return `<option value="${v.versionId}" ${v.versionId === selectedVerId ? 'selected' : ''}>
                v${v.versionNumber} • ${vDate}${isAct ? ' ★ (Activa)' : ''}
            </option>`;
        }).join('');

        return `
            <div class="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition space-y-4 shadow-lg group">
                
                <!-- CARD HEADER -->
                <div class="flex flex-wrap justify-between items-start gap-3 border-b border-slate-900 pb-3">
                    <div class="space-y-1 max-w-xl">
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-lg bg-brand-500/20 text-brand-300 border border-brand-500/30">
                                ${escapeHtml(item.familyCode || 'GEN')}
                            </span>
                            <span class="text-xs text-slate-400 font-medium">${escapeHtml(item.familyName || 'General')}</span>
                            ${dateStr ? `<span class="text-[10px] text-slate-500 flex items-center gap-1"><i class="fa-regular fa-clock text-[9px]"></i> ${dateStr}</span>` : ''}
                        </div>
                        <h4 class="font-heading font-extrabold text-white text-base group-hover:text-emerald-300 transition">
                            ${escapeHtml(item.title || 'Sin Título')}
                        </h4>
                        ${tagsHtml ? `<div class="flex flex-wrap gap-1.5 pt-0.5">${tagsHtml}</div>` : ''}
                    </div>

                    <!-- CARD ACTIONS -->
                    <div class="flex flex-wrap items-center gap-1.5 shrink-0">
                        <button onclick="loadPromptToDesigner('${item.id}', '${curVer.versionId}')" title="Cargar versión v${curVer.versionNumber} en el Diseñador" class="text-xs bg-emerald-600/90 hover:bg-emerald-500 text-white font-heading font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95">
                            <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                            <span>Cargar v${curVer.versionNumber}</span>
                        </button>
                        <button onclick="copyPromptBankPhase1('${item.id}', '${curVer.versionId}')" title="Copiar Fases 1 a 3 (Prompt de Entrada T-C-R)" class="text-xs bg-slate-900 hover:bg-slate-800 text-sky-400 hover:text-sky-300 px-2.5 py-1.5 rounded-xl border border-sky-500/30 transition flex items-center gap-1 active:scale-95">
                            <i class="fa-regular fa-copy"></i>
                            <span class="hidden sm:inline">T-C-R</span>
                        </button>
                        <button onclick="copyPromptBankPhase2('${item.id}', '${curVer.versionId}')" title="Copiar Fases 4 y 5 (Human-in-the-Loop E-I)" class="text-xs bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 px-2.5 py-1.5 rounded-xl border border-amber-500/30 transition flex items-center gap-1 active:scale-95">
                            <i class="fa-solid fa-arrows-rotate"></i>
                            <span class="hidden sm:inline">E-I</span>
                        </button>
                        <button onclick="duplicatePromptInBank('${item.id}')" title="Duplicar prompt completo" class="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white p-2 rounded-xl border border-slate-800 transition">
                            <i class="fa-regular fa-clone"></i>
                        </button>
                        <button onclick="exportSinglePromptToMarkdown('${item.id}')" title="Descargar este prompt en archivo Markdown (.md) con su historial" class="text-xs bg-slate-900 hover:bg-slate-800 text-purple-400 hover:text-purple-300 p-2 rounded-xl border border-purple-500/30 transition active:scale-95">
                            <i class="fa-brands fa-markdown"></i>
                        </button>
                        <button onclick="openSavePromptModal('${item.id}')" title="Editar metadatos / título" class="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white p-2 rounded-xl border border-slate-800 transition">
                            <i class="fa-regular fa-pen-to-square"></i>
                        </button>
                        <button onclick="deletePromptFromBank('${item.id}')" title="Eliminar prompt completo" class="text-xs bg-slate-900 hover:bg-rose-950 text-rose-400 hover:text-rose-300 p-2 rounded-xl border border-slate-800 hover:border-rose-800 transition">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                </div>

                <!-- VERSION CONTROL BAR & VERSION METADATA -->
                <div class="flex flex-wrap items-center justify-between gap-2.5 bg-slate-900/70 p-2.5 rounded-xl border border-slate-800">
                    <div class="flex flex-wrap items-center gap-2">
                        <span class="text-xs font-heading font-bold text-slate-300 flex items-center gap-1">
                            <i class="fa-solid fa-code-branch text-emerald-400"></i> Versión:
                        </span>
                        <select onchange="changePromptCardVersion('${item.id}', this.value)" class="text-xs bg-slate-950 border border-emerald-500/40 text-emerald-300 font-mono font-bold rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer">
                            ${versionOptionsHtml}
                        </select>
                        <span class="text-[11px] text-slate-400 font-mono">(${versions.length} en total)</span>
                    </div>

                    <div class="flex items-center gap-2">
                        ${!isActive ? `
                            <button onclick="setPromptActiveVersion('${item.id}', '${curVer.versionId}')" title="Marcar versión v${curVer.versionNumber} como la versión principal/activa" class="text-[11px] bg-slate-950 hover:bg-emerald-950 text-emerald-400 hover:text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-lg transition flex items-center gap-1 active:scale-95">
                                <i class="fa-solid fa-thumbtack text-[10px]"></i>
                                <span>Hacer Activa</span>
                            </button>
                        ` : `
                            <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                <i class="fa-solid fa-check text-[9px]"></i> Versión Activa
                            </span>
                        `}
                        <button onclick="openPromptHistoryModal('${item.id}')" title="Ver historial de todas las versiones" class="text-[11px] bg-slate-950 hover:bg-slate-800 text-sky-300 hover:text-sky-200 border border-sky-500/30 px-2.5 py-1 rounded-lg transition flex items-center gap-1 active:scale-95">
                            <i class="fa-solid fa-clock-rotate-left text-[10px]"></i>
                            <span>Historial</span>
                        </button>
                    </div>
                </div>

                <!-- VERSION COMMENT HIGHLIGHT BOX -->
                <div class="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/25 flex items-start justify-between gap-2 text-xs">
                    <div class="flex items-start gap-2 flex-grow">
                        <i class="fa-regular fa-comment-dots text-emerald-400 text-sm mt-0.5 shrink-0"></i>
                        <div class="space-y-0.5">
                            <span class="text-emerald-400 font-bold font-mono text-[11px]">Comentario de v${curVer.versionNumber}:</span>
                            <p class="text-slate-200 leading-relaxed">${escapeHtml(curVer.versionComment || 'Sin comentario específico para esta versión.')}</p>
                        </div>
                    </div>
                    <button onclick="editVersionCommentPrompt('${item.id}', '${curVer.versionId}')" title="Editar comentario de la versión ${curVer.versionNumber}" class="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition shrink-0">
                        <i class="fa-regular fa-pen-to-square text-xs"></i>
                    </button>
                </div>

                <!-- CARD PREVIEW FIELDS (T-C-R & E-I FOR SELECTED VERSION) -->
                <div class="grid md:grid-cols-2 gap-3 text-xs">
                    <div class="p-3 rounded-xl bg-slate-900/40 border border-sky-500/20 space-y-1.5">
                        <span class="text-sky-300 font-heading font-bold flex items-center gap-1.5">
                            <i class="fa-solid fa-arrow-right-to-bracket text-sky-400"></i> Entrada TCREI (T-C-R) • v${curVer.versionNumber}:
                        </span>
                        <p class="text-slate-300 line-clamp-2 leading-relaxed"><strong class="text-sky-400/80">T:</strong> ${escapeHtml(curVer.task) || '<span class="text-slate-600 italic">No definido</span>'}</p>
                        <p class="text-slate-400 line-clamp-1"><strong class="text-teal-400/80">C:</strong> ${escapeHtml(curVer.context) || '<span class="text-slate-600 italic">No definido</span>'}</p>
                        <p class="text-slate-500 line-clamp-1"><strong class="text-indigo-400/80">R:</strong> ${escapeHtml(curVer.ref) || '<span class="text-slate-600 italic">No definido</span>'}</p>
                    </div>

                    <div class="p-3 rounded-xl bg-slate-900/40 border border-amber-500/20 space-y-1.5">
                        <span class="text-amber-300 font-heading font-bold flex items-center gap-1.5">
                            <i class="fa-solid fa-arrows-rotate text-amber-400"></i> Control & Iteración (E-I) • v${curVer.versionNumber}:
                        </span>
                        <p class="text-slate-300 line-clamp-2 leading-relaxed"><strong class="text-amber-400/80">E:</strong> ${escapeHtml(curVer.eval) || '<span class="text-slate-600 italic">No definido</span>'}</p>
                        <p class="text-slate-400 line-clamp-1"><strong class="text-purple-400/80">I:</strong> ${escapeHtml(curVer.iter) || '<span class="text-slate-600 italic">No definido</span>'}</p>
                        ${item.notes ? `<p class="text-slate-500 line-clamp-1 italic"><i class="fa-regular fa-note-sticky text-amber-400/70"></i> ${escapeHtml(item.notes)}</p>` : ''}
                    </div>
                </div>

            </div>
        `;
    }).join('');

    if (window.FontAwesome && window.FontAwesome.dom) window.FontAwesome.dom.i2svg();
}

export function loadPromptToDesigner(id, versionId = null) {
    const list = getSavedPrompts();
    const item = list.find(p => p.id === id);
    if (!item) return;

    const ver = getVersion(item, versionId);

    const genTask = document.getElementById('gen-task');
    if (genTask) genTask.value = ver.task || '';
    const genContext = document.getElementById('gen-context');
    if (genContext) genContext.value = ver.context || '';
    const genRef = document.getElementById('gen-ref');
    if (genRef) genRef.value = ver.ref || '';
    const genEval = document.getElementById('gen-eval');
    if (genEval) genEval.value = ver.eval || '';
    const genIter = document.getElementById('gen-iter');
    if (genIter) genIter.value = ver.iter || '';

    currentWorkingPromptId = item.id;
    currentWorkingVersionId = ver.versionId;

    onPhase1Input();
    onPhase2Input();
    buildPrompt();

    switchTab('generator');
    closePromptBankModal();
    closePromptHistoryModal();
    showToast("Prompt Cargado", `"${item.title}" (v${ver.versionNumber}) está listo en el Diseñador TCREI.`, "bolt");
}

export function deletePromptFromBank(id) {
    const list = getSavedPrompts();
    const item = list.find(p => p.id === id);
    const title = item ? item.title : 'este prompt';

    if (confirm(`¿Estás seguro de que deseas eliminar "${title}" y todas sus versiones de tu banco personal?`)) {
        const updated = list.filter(p => p.id !== id);
        delete bankCardSelectedVersion[id];
        saveSavedPrompts(updated);
        renderPromptBank();
        closePromptHistoryModal();
        showToast("Prompt Eliminado", `Se ha eliminado de tu banco local.`, "trash");
    }
}

export function duplicatePromptInBank(id) {
    const list = getSavedPrompts();
    const item = list.find(p => p.id === id);
    if (!item) return;

    const newPromptId = 'tcrei_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const duplicatedVersions = (item.versions || []).map(v => ({
        ...v,
        versionId: 'v_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6)
    }));

    const duplicate = {
        ...item,
        id: newPromptId,
        title: `${item.title} (Copia)`,
        versions: duplicatedVersions,
        activeVersionId: duplicatedVersions[duplicatedVersions.length - 1]?.versionId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    list.unshift(duplicate);
    saveSavedPrompts(list);
    renderPromptBank();
    showToast("Prompt Duplicado", `Se creó "${duplicate.title}" con todas sus versiones.`, "check");
}

export function copyPromptBankPhase1(id, versionId = null) {
    const list = getSavedPrompts();
    const item = list.find(p => p.id === id);
    if (!item) return;

    const ver = getVersion(item, versionId);
    const text = `# PROMPT ESTRUCTURADO (MARCO TCREI - FASE 1: ENTRADA) [v${ver.versionNumber}]
[TAREA & ROL (TASK)]:
${ver.task || '[Tarea y Rol asignado]'}

[CONTEXTO (CONTEXT)]:
${ver.context || '[Contexto del alumnado y taller]'}

[REFERENCIAS & RESTRICCIONES (REFERENCES)]:
${ver.ref || '[Referencias normativas y técnicas]'}`;

    navigator.clipboard.writeText(text).then(() => {
        showToast(`¡Fases 1 a 3 Copiadas (v${ver.versionNumber})!`, "Prompt de entrada listo para enviar a la IA.", "check");
    });
}

export function copyPromptBankPhase2(id, versionId = null) {
    const list = getSavedPrompts();
    const item = list.find(p => p.id === id);
    if (!item) return;

    const ver = getVersion(item, versionId);
    const text = `# GUÍA DOCENTE Y REPROMPTING (MARCO TCREI - FASE 2: HUMAN-IN-THE-LOOP) [v${ver.versionNumber}]
[EVALUACIÓN CRÍTICA DEL OUTPUT (EVALUATE)]:
${ver.eval || '[Criterios de auditoría crítica del output]'}

[PROMPT DE 2ª ITERACIÓN / REPROMPTING (ITERATE)]:
${ver.iter || '[Prompt de 2ª iteración / Reprompting]'}`;

    navigator.clipboard.writeText(text).then(() => {
        showToast(`¡Fases 4 y 5 Copiadas (v${ver.versionNumber})!`, "Guía de control e iteración lista para pegar.", "bolt");
    });
}
