/**
 * =============================================================================
 * KIT IA DOCENTES FP - ESTADO GLOBAL DE LA APLICACIÓN (v1.3.0)
 * =============================================================================
 */

import { FP_FAMILIES } from '../data/incual-families.js';

export const state = {
    // Presentación
    currentSlideIndex: 0,
    speakerNotesVisible: false,
    activeTab: 'presentation',
    currentFamilyFilter: 'all',

    // Cronómetro
    timerSeconds: 0,
    timerInterval: null,
    timerRunning: false,

    // Diccionario de presets para carga rápida por familia profesional
    PRESETS: {},

    // Auditoría IA y Diagnóstico
    latestDiagnosis: null,
    aiAuditResults: {
        phase1: null,
        phase2: null
    },
    activeDiagTab: 'analysis',
    currentDiffViewMode: 'split',
    currentEditableProposal: null,
    originalAiProposal: null,

    // Banco de Prompts Personal (Persistencia en localStorage)
    customBankPrompts: [],
    currentEditingPromptId: null,
    savePromptMode: 'new_prompt', // 'new_prompt' | 'new_version'
    selectedTargetPromptId: null,

    // Sincronización Google Drive (OAuth GIS)
    gdriveTokenClient: null,
    gdriveAccessToken: null,
    gdrivePendingAction: null // 'backup' | 'restore'
};

// Inicialización del diccionario de plantillas rápidas por familia
FP_FAMILIES.forEach(f => {
    state.PRESETS[f.code] = {
        task: f.task,
        context: f.context,
        ref: f.ref,
        eval: f.eval,
        iter: f.iter
    };
});
