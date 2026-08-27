/**
 * =============================================================================
 * KIT IA DOCENTES FP - BACKUP LOCAL Y SINCRONIZACIÓN GOOGLE DRIVE (v1.3.0)
 * =============================================================================
 */

import { GDRIVE_CLIENT_ID, GDRIVE_BACKUP_FILENAME, GDRIVE_SCOPE } from '../config.js';
import { state } from '../core/state.js';
import { showToast } from '../core/toast.js';
import { escapeHtml } from '../core/utils.js';
import {
    getSavedPrompts,
    saveSavedPrompts,
    getActiveVersion,
    renderPromptBank
} from './prompt-bank.js';

let pendingRestorePayload = null;

export function exportPromptBankToJson() {
    const prompts = getSavedPrompts();
    if (prompts.length === 0) {
        showToast("Banco Vacío", "No tienes prompts guardados para exportar.", "trash");
        return;
    }

    const payload = {
        app: "Kit_IA_Docentes_TCREI",
        version: "2.1.0",
        exportedAt: new Date().toISOString(),
        promptsCount: prompts.length,
        prompts: prompts
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    const dateSuffix = new Date().toISOString().split('T')[0];
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Kit_IA_Docentes_Prompts_Backup_${dateSuffix}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast("Backup Descargado", `Exportados ${prompts.length} prompts con todo su historial a .json.`, "download");
}

export function exportPromptBankToMarkdown() {
    const prompts = getSavedPrompts();
    if (prompts.length === 0) {
        showToast("Banco Vacío", "No tienes prompts guardados para exportar.", "trash");
        return;
    }

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const dateSuffix = now.toISOString().split('T')[0];

    let md = `# 📚 Banco de Prompts TCREI - Kit de IA para Docentes de FP\n\n`;
    md += `> **Fecha de Exportación:** ${dateFormatted}  \n`;
    md += `> **Total de Prompts:** ${prompts.length}  \n`;
    md += `> **Marco Metodológico:** TCREI (Tarea y Rol • Contexto • Referencias • Evaluar • Iterar)\n\n`;
    md += `---\n\n`;

    prompts.forEach((p, idx) => {
        const title = p.title || `Prompt ${idx + 1}`;
        const fam = p.familyName ? `${p.familyCode || 'GEN'} - ${p.familyName}` : (p.familyCode || 'General');
        const tags = (p.tags && p.tags.length > 0) ? p.tags.map(t => `\`#${t}\``).join(' ') : '_Sin etiquetas_';
        const dateP = p.updatedAt ? new Date(p.updatedAt).toLocaleDateString('es-ES') : '-';
        const activeVer = getActiveVersion(p);
        const versions = p.versions || [];

        md += `## ${idx + 1}. ${title} (Versión Activa: v${activeVer.versionNumber})\n\n`;
        md += `- **Familia Profesional:** ${fam}\n`;
        md += `- **Etiquetas:** ${tags}\n`;
        md += `- **Última Actualización:** ${dateP}\n`;
        if (activeVer.versionComment) {
            md += `- **Comentario de Versión (v${activeVer.versionNumber}):** ${activeVer.versionComment}\n`;
        }
        md += `\n`;

        md += `### 📥 Fase 1: Prompt de Entrada Estructurado (T-C-R)\n\n`;
        md += `\`\`\`text\n`;
        md += `[TAREA & ROL]:\n${activeVer.task || 'No especificado'}\n\n`;
        md += `[CONTEXTO DE AULA / TALLER]:\n${activeVer.context || 'No especificado'}\n\n`;
        md += `[REFERENCIAS & NORMATIVA]:\n${activeVer.ref || 'No especificado'}\n`;
        md += `\`\`\`\n\n`;

        md += `### 🔄 Fase 2: Control Crítico e Iteración (E-I)\n\n`;
        md += `- **🎯 Auditoría Docente (Evaluar - E):**\n  ${activeVer.eval || '_No especificado_'}\n\n`;
        md += `- **🔁 Reprompting / Prueba de Esfuerzo (Iterar - I):**\n  > ${activeVer.iter || '_No especificado_'}\n\n`;

        if (p.notes && p.notes.trim()) {
            md += `💡 **Observaciones Pedagógicas Generales:**\n> ${p.notes}\n\n`;
        }

        if (versions.length > 1) {
            md += `### 📜 Apéndice: Historial de Versiones (${versions.length} versiones)\n\n`;
            md += `| Versión | Fecha | Comentario / Registro de Cambios | Estado |\n`;
            md += `| :--- | :--- | :--- | :--- |\n`;
            versions.forEach(v => {
                const isAct = v.versionId === p.activeVersionId;
                const vDate = v.createdAt ? new Date(v.createdAt).toLocaleDateString('es-ES') : '-';
                md += `| **v${v.versionNumber}** | ${vDate} | ${v.versionComment || '_Sin comentario_'} | ${isAct ? '**★ Activa**' : 'Histórica'} |\n`;
            });
            md += `\n`;
        }

        md += `---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Kit_IA_Docentes_Banco_Prompts_${dateSuffix}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    showToast("Exportado a Markdown", `Exportados ${prompts.length} prompts con versión activa y apéndice de histórico.`, "download");
}

export function exportSinglePromptToMarkdown(id) {
    const list = getSavedPrompts();
    const p = list.find(item => item.id === id);
    if (!p) return;

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('es-ES');
    const safeTitle = (p.title || 'Prompt_TCREI').replace(/[/\\?%*:|"<>]/g, '-').replace(/\s+/g, '_');
    const fam = p.familyName ? `${p.familyCode || 'GEN'} - ${p.familyName}` : (p.familyCode || 'General');
    const tags = (p.tags && p.tags.length > 0) ? p.tags.map(t => `\`#${t}\``).join(' ') : '_Sin etiquetas_';
    const activeVer = getActiveVersion(p);
    const versions = p.versions || [];

    let md = `# ${p.title || 'Prompt TCREI'} (v${activeVer.versionNumber})\n\n`;
    md += `> **Familia Profesional:** ${fam}  \n`;
    md += `> **Etiquetas:** ${tags}  \n`;
    md += `> **Fecha:** ${dateFormatted}  \n`;
    md += `> **Marco Metodológico:** TCREI (Docencia FP)\n\n`;
    if (activeVer.versionComment) {
        md += `> **Nota de Versión (v${activeVer.versionNumber}):** ${activeVer.versionComment}  \n\n`;
    }
    md += `---\n\n`;

    md += `## 📥 Fase 1: Prompt de Entrada Estructurado (T-C-R)\n\n`;
    md += `\`\`\`text\n`;
    md += `[TAREA & ROL]:\n${activeVer.task || 'No especificado'}\n\n`;
    md += `[CONTEXTO DE AULA / TALLER]:\n${activeVer.context || 'No especificado'}\n\n`;
    md += `[REFERENCIAS & NORMATIVA]:\n${activeVer.ref || 'No especificado'}\n`;
    md += `\`\`\`\n\n`;

    md += `## 🔄 Fase 2: Control Crítico e Iteración (E-I)\n\n`;
    md += `- **🎯 Criterios de Evaluación Docente (E):**\n  ${activeVer.eval || '_No especificado_'}\n\n`;
    md += `- **🔁 Estrategia de Reprompting / Iteración (I):**\n  > ${activeVer.iter || '_No especificado_'}\n\n`;

    if (p.notes && p.notes.trim()) {
        md += `💡 **Observaciones Pedagógicas Generales:**\n> ${p.notes}\n\n`;
    }

    if (versions.length > 1) {
        md += `## 📜 Apéndice: Historial de Versiones (${versions.length} versiones)\n\n`;
        md += `| Versión | Fecha | Comentario / Registro de Cambios | Estado |\n`;
        md += `| :--- | :--- | :--- | :--- |\n`;
        versions.forEach(v => {
            const isAct = v.versionId === p.activeVersionId;
            const vDate = v.createdAt ? new Date(v.createdAt).toLocaleDateString('es-ES') : '-';
            md += `| **v${v.versionNumber}** | ${vDate} | ${v.versionComment || '_Sin comentario_'} | ${isAct ? '**★ Activa**' : 'Histórica'} |\n`;
        });
        md += `\n`;
    }

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeTitle}_v${activeVer.versionNumber}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    showToast("Prompt Descargado", `"${p.title}" exportado como Markdown (v${activeVer.versionNumber}).`, "download");
}

export function exportPromptBankToTxt() {
    const prompts = getSavedPrompts();
    if (prompts.length === 0) {
        showToast("Banco Vacío", "No tienes prompts guardados para exportar.", "trash");
        return;
    }

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const dateSuffix = now.toISOString().split('T')[0];

    let txt = `======================================================================\n`;
    txt += `BANCO DE PROMPTS TCREI - KIT DE IA PARA DOCENTES DE FP\n`;
    txt += `======================================================================\n`;
    txt += `Fecha de Exportación: ${dateFormatted}\n`;
    txt += `Total de Prompts: ${prompts.length}\n`;
    txt += `Marco Metodológico: TCREI (Tarea y Rol • Contexto • Referencias • Evaluar • Iterar)\n`;
    txt += `======================================================================\n\n`;

    prompts.forEach((p, idx) => {
        const title = p.title || `Prompt ${idx + 1}`;
        const fam = p.familyName ? `${p.familyCode || 'GEN'} - ${p.familyName}` : (p.familyCode || 'General');
        const tags = (p.tags && p.tags.length > 0) ? p.tags.join(', ') : 'Sin etiquetas';
        const dateP = p.updatedAt ? new Date(p.updatedAt).toLocaleDateString('es-ES') : '-';
        const activeVer = getActiveVersion(p);
        const versions = p.versions || [];

        txt += `----------------------------------------------------------------------\n`;
        txt += `PROMPT ${idx + 1}: ${title.toUpperCase()} (VERSIÓN ACTIVA: v${activeVer.versionNumber})\n`;
        txt += `----------------------------------------------------------------------\n`;
        txt += `Familia Profesional: ${fam}\n`;
        txt += `Etiquetas: ${tags}\n`;
        txt += `Última Actualización: ${dateP}\n`;
        if (activeVer.versionComment) {
            txt += `Comentario de Versión Activa (v${activeVer.versionNumber}): ${activeVer.versionComment}\n`;
        }
        txt += `\n`;

        txt += `[FASE 1: PROMPT DE ENTRADA ESTRUCTURADO (T-C-R)]\n`;
        txt += `* Tarea & Rol (T):\n  ${(activeVer.task || 'No especificado').replace(/\n/g, '\n  ')}\n\n`;
        txt += `* Contexto de Aula / Taller (C):\n  ${(activeVer.context || 'No especificado').replace(/\n/g, '\n  ')}\n\n`;
        txt += `* Referencias & Normativa (R):\n  ${(activeVer.ref || 'No especificado').replace(/\n/g, '\n  ')}\n\n`;

        txt += `[FASE 2: CONTROL CRÍTICO E ITERACIÓN (E-I)]\n`;
        txt += `* Auditoría Docente (Evaluar - E):\n  ${(activeVer.eval || 'No especificado').replace(/\n/g, '\n  ')}\n\n`;
        txt += `* Reprompting / Prueba de Esfuerzo (Iterar - I):\n  ${(activeVer.iter || 'No especificado').replace(/\n/g, '\n  ')}\n\n`;

        if (p.notes && p.notes.trim()) {
            txt += `* Observaciones Pedagógicas:\n  ${p.notes.replace(/\n/g, '\n  ')}\n\n`;
        }

        if (versions.length > 1) {
            txt += `[HISTORIAL DE VERSIONES (${versions.length} versiones)]\n`;
            versions.forEach(v => {
                const isAct = v.versionId === p.activeVersionId;
                const vDate = v.createdAt ? new Date(v.createdAt).toLocaleDateString('es-ES') : '-';
                txt += `* v${v.versionNumber} (${vDate}) ${isAct ? '[ACTIVA]' : ''}: ${v.versionComment || 'Sin comentario'}\n`;
            });
            txt += `\n`;
        }

        txt += `\n`;
    });

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Kit_IA_Docentes_Banco_Prompts_${dateSuffix}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    showToast("Exportado a Texto", `Exportados ${prompts.length} prompts con versión activa e histórico.`, "download");
}

export function toggleExportDropdown(e) {
    if (e) e.stopPropagation();
    const menu = document.getElementById('export-dropdown-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

export function closeExportDropdown() {
    const menu = document.getElementById('export-dropdown-menu');
    if (menu && !menu.classList.contains('hidden')) {
        menu.classList.add('hidden');
    }
}

export function triggerLocalRestore() {
    const fileInput = document.getElementById('local-restore-file-input');
    if (fileInput) {
        fileInput.value = '';
        fileInput.click();
    }
}

export function handleLocalRestoreFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        try {
            const parsed = JSON.parse(event.target.result);
            if (!parsed.prompts || !Array.isArray(parsed.prompts)) {
                showToast("Archivo No Válido", "El archivo JSON no contiene un banco de prompts válido.", "trash");
                return;
            }
            openRestoreModal(parsed, "Archivo Local (" + file.name + ")");
        } catch (err) {
            showToast("Error de Lectura", "No se pudo interpretar el archivo JSON.", "trash");
        }
    };
    reader.readAsText(file);
}

export function openRestoreModal(payload, sourceLabel) {
    pendingRestorePayload = payload;
    const modal = document.getElementById('modal-restore-prompt');
    const sourceEl = document.getElementById('restore-source-label');
    const countEl = document.getElementById('restore-prompt-count');
    const dateEl = document.getElementById('restore-date-label');
    const listEl = document.getElementById('restore-preview-list');

    if (sourceEl) sourceEl.innerText = sourceLabel;
    if (countEl) countEl.innerText = `${payload.prompts.length} prompts`;
    if (dateEl) {
        const d = payload.exportedAt ? new Date(payload.exportedAt).toLocaleString('es-ES') : 'Fecha no disponible';
        dateEl.innerText = d;
    }

    if (listEl) {
        listEl.innerHTML = payload.prompts.slice(0, 5).map(p => `
            <div class="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                <span class="text-white font-medium truncate max-w-xs">${escapeHtml(p.title || 'Sin Título')}</span>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/20 text-brand-300">${escapeHtml(p.familyCode || 'GEN')} (${p.versions?.length || 1}v)</span>
            </div>
        `).join('');
        if (payload.prompts.length > 5) {
            listEl.innerHTML += `<p class="text-[11px] text-slate-500 italic text-center">+ ${payload.prompts.length - 5} prompts adicionales...</p>`;
        }
    }

    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
    if (window.FontAwesome && window.FontAwesome.dom) window.FontAwesome.dom.i2svg();
}

export function closeRestoreModal() {
    const modal = document.getElementById('modal-restore-prompt');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
    pendingRestorePayload = null;
}

export function executeRestore(strategy) {
    if (!pendingRestorePayload || !pendingRestorePayload.prompts) return;

    const importedPrompts = pendingRestorePayload.prompts;
    const existingPrompts = getSavedPrompts();
    let finalPrompts = [];

    if (strategy === 'overwrite') {
        finalPrompts = [...importedPrompts];
    } else { // 'merge'
        const existingMap = new Map();
        existingPrompts.forEach(p => existingMap.set(p.id, p));

        importedPrompts.forEach(imp => {
            if (existingMap.has(imp.id)) {
                const existing = existingMap.get(imp.id);
                const versionsMap = new Map((existing.versions || []).map(v => [v.versionId, v]));
                (imp.versions || []).forEach(v => {
                    versionsMap.set(v.versionId, v);
                });
                const mergedVersions = Array.from(versionsMap.values()).sort((a, b) => (a.versionNumber || 0) - (b.versionNumber || 0));
                existingMap.set(imp.id, {
                    ...existing,
                    ...imp,
                    versions: mergedVersions,
                    activeVersionId: imp.activeVersionId || existing.activeVersionId || mergedVersions[mergedVersions.length - 1]?.versionId
                });
            } else {
                existingMap.set(imp.id, imp);
            }
        });
        finalPrompts = Array.from(existingMap.values());
    }

    saveSavedPrompts(finalPrompts);
    renderPromptBank();
    closeRestoreModal();
    showToast("Restauración Exitosa", `Tu banco ahora cuenta con ${finalPrompts.length} prompts.`, "check");
}

export function requestGoogleDriveAuth(callback) {
    if (!GDRIVE_CLIENT_ID || GDRIVE_CLIENT_ID.trim() === '' || GDRIVE_CLIENT_ID.includes('YOUR_CLIENT_ID')) {
        showToast("Google Drive no configurado", "El Google Client ID no está configurado en el código de la aplicación.", "trash");
        return;
    }

    if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
        showToast("Cargando Google Auth", "El script de Google Identity se está cargando. Prueba en un instante.", "bolt");
        return;
    }

    try {
        state.gdriveTokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: GDRIVE_CLIENT_ID,
            scope: GDRIVE_SCOPE,
            callback: (tokenResponse) => {
                if (tokenResponse.error !== undefined) {
                    console.error("Google Auth Error:", tokenResponse);
                    if (tokenResponse.error === 'interaction_required' || tokenResponse.error === 'consent_required') {
                        state.gdriveTokenClient.requestAccessToken({ prompt: 'consent' });
                        return;
                    }
                    state.gdriveAccessToken = null;
                    showToast("Error de Autorización", tokenResponse.error_description || tokenResponse.error, "trash");
                    return;
                }
                state.gdriveAccessToken = tokenResponse.access_token;
                if (typeof callback === 'function') {
                    callback(state.gdriveAccessToken);
                }
            }
        });

        state.gdriveTokenClient.requestAccessToken({ prompt: state.gdriveAccessToken ? '' : 'select_account' });
    } catch (err) {
        console.error("Google Auth Init Error:", err);
        showToast("Error de Google Auth", err.message || "No se pudo iniciar la autenticación.", "trash");
    }
}

export function backupToGoogleDrive() {
    const prompts = getSavedPrompts();
    if (prompts.length === 0) {
        showToast("Banco Vacío", "No hay prompts guardados para sincronizar en Google Drive.", "trash");
        return;
    }

    requestGoogleDriveAuth(async (token) => {
        showToast("Sincronizando...", "Conectando con Google Drive...", "bolt");
        try {
            const payload = {
                app: "Kit_IA_Docentes_TCREI",
                version: "2.0.0",
                exportedAt: new Date().toISOString(),
                promptsCount: prompts.length,
                prompts: prompts
            };
            const jsonContent = JSON.stringify(payload, null, 2);

            // 1. Search if backup file exists in Drive
            const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=name='${GDRIVE_BACKUP_FILENAME}' and trashed=false&fields=files(id,name,modifiedTime)&spaces=drive`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!searchRes.ok) {
                if (searchRes.status === 401) {
                    state.gdriveAccessToken = null;
                    throw new Error("Sesión de Google expirada. Vuelve a pulsar el botón para autorizar.");
                }
                const errJson = await searchRes.json().catch(() => ({}));
                throw new Error(errJson.error?.message || `Error al consultar Drive (${searchRes.status})`);
            }

            const searchData = await searchRes.json();
            let fileUpdated = false;

            // 2. If file found, try updating its content via PATCH
            if (searchData.files && searchData.files.length > 0) {
                const fileId = searchData.files[0].id;
                try {
                    const updateRes = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json; charset=UTF-8'
                        },
                        body: jsonContent
                    });

                    if (updateRes.ok) {
                        fileUpdated = true;
                        showToast("¡Backup Sincronizado!", `Archivo ${GDRIVE_BACKUP_FILENAME} actualizado en tu Drive (${prompts.length} prompts).`, "check");
                    } else {
                        console.warn("PATCH failed, status:", updateRes.status, "- procediendo a crear archivo nuevo.");
                    }
                } catch (patchErr) {
                    console.warn("PATCH error:", patchErr);
                }
            }

            // 3. If file didn't exist or PATCH couldn't overwrite it, create it via standard multipart POST
            if (!fileUpdated) {
                const metadata = {
                    name: GDRIVE_BACKUP_FILENAME,
                    mimeType: 'application/json'
                };
                const boundary = 'tcrei_backup_boundary_' + Date.now();
                const multipartRequestBody =
                    `--${boundary}\r\n` +
                    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
                    JSON.stringify(metadata) +
                    `\r\n--${boundary}\r\n` +
                    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
                    jsonContent +
                    `\r\n--${boundary}--`;

                const createRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': `multipart/related; boundary=${boundary}`
                    },
                    body: multipartRequestBody
                });

                if (!createRes.ok) {
                    if (createRes.status === 401) {
                        state.gdriveAccessToken = null;
                        throw new Error("Sesión de Google expirada. Vuelve a pulsar el botón para autorizar.");
                    }
                    const errJson = await createRes.json().catch(() => ({}));
                    throw new Error(errJson.error?.message || `Error al crear archivo en Drive (${createRes.status})`);
                }
                showToast("¡Backup Creado en Drive!", `Guardado como ${GDRIVE_BACKUP_FILENAME} (${prompts.length} prompts).`, "check");
            }
        } catch (err) {
            console.error("Google Drive Backup Error:", err);
            showToast("Error en Google Drive", err.message || "Error al sincronizar con Google Drive.", "trash");
        }
    });
}

export function restoreFromGoogleDrive() {
    requestGoogleDriveAuth(async (token) => {
        showToast("Buscando en Drive...", `Consultando ${GDRIVE_BACKUP_FILENAME}...`, "bolt");
        try {
            const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=name='${GDRIVE_BACKUP_FILENAME}' and trashed=false&fields=files(id,name,modifiedTime,size)&orderBy=modifiedTime desc&spaces=drive`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!searchRes.ok) {
                if (searchRes.status === 401) {
                    state.gdriveAccessToken = null;
                    throw new Error("Sesión de Google expirada. Vuelve a pulsar el botón para autorizar.");
                }
                const errJson = await searchRes.json().catch(() => ({}));
                throw new Error(errJson.error?.message || `Error al consultar Drive (${searchRes.status})`);
            }

            const searchData = await searchRes.json();

            if (!searchData.files || searchData.files.length === 0) {
                showToast("Sin Copia en Drive", `No se encontró ${GDRIVE_BACKUP_FILENAME} en tu Google Drive. Realiza un backup primero.`, "trash");
                return;
            }

            const fileId = searchData.files[0].id;
            const contentRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!contentRes.ok) {
                if (contentRes.status === 401) {
                    state.gdriveAccessToken = null;
                    throw new Error("Sesión de Google expirada. Vuelve a pulsar el botón para autorizar.");
                }
                const errJson = await contentRes.json().catch(() => ({}));
                throw new Error(errJson.error?.message || "No se pudo descargar el archivo de backup.");
            }

            const parsedPayload = await contentRes.json();

            if (!parsedPayload.prompts || !Array.isArray(parsedPayload.prompts)) {
                showToast("Formato Inválido", "El archivo en Drive no contiene la estructura de prompts esperada.", "trash");
                return;
            }

            openRestoreModal(parsedPayload, `Google Drive (${GDRIVE_BACKUP_FILENAME})`);
        } catch (err) {
            console.error("Google Drive Restore Error:", err);
            showToast("Error de Descarga", err.message || "Error al leer desde Google Drive", "trash");
        }
    });
}
