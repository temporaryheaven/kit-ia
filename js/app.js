/**
 * =============================================================================
 * KIT IA DOCENTES FP - PUNTO DE ENTRADA PRINCIPAL / ORQUESTADOR (v1.3.0)
 * =============================================================================
 */

import { APP_VERSION, updateAppVersionLabels } from './config.js';
import { slides } from './data/slides-data.js';
import { FP_FAMILIES } from './data/incual-families.js';
import { state } from './core/state.js';
import { initTheme, toggleTheme, setTheme, getCurrentTheme, updateThemeUI } from './core/theme.js';
import { showToast } from './core/toast.js';
import { escapeHtml, formatDate } from './core/utils.js';

import { switchTab, toggleGlobalFullscreen, initKeyboardShortcuts } from './modules/ui-helpers.js';
import {
    renderSlide,
    prevSlide,
    nextSlide,
    goToSlide,
    toggleNotes,
    toggleTimer,
    resetTimer,
    renderFilterPills,
    renderFamilyCards,
    setPromptFilter,
    filterPrompts,
    copyPromptText,
    updateAuditScore
} from './modules/presentation.js';

import {
    onPhase1Input,
    onPhase2Input,
    buildPrompt,
    copyPromptPhase1,
    copyPromptPhase2,
    copyGeneratedPrompt,
    downloadPromptMd,
    loadPreset,
    resetGeneratorForm,
    loadTemplateToGenerator
} from './modules/generator.js';

import {
    PROVIDER_MODELS,
    openApiConfigModal,
    closeApiConfigModal,
    updateModelDropdown,
    toggleApiKeyVisibility,
    saveApiKeyConfig,
    testApiConnection,
    clearApiKeyConfig,
    loadApiKeyConfig,
    updateApiStatusBadge,
    copyAuditMetaPrompt,
    switchDiagModalTab,
    setDiagViewMode,
    onDiagFieldEdited,
    resetAIOptimizationProposal,
    runAIDiagnosis,
    closeAIDiagnosisModal,
    applyAIOptimization
} from './modules/ai-audit.js';

import {
    openSavePromptModal,
    closeSavePromptModal,
    submitSavePrompt,
    setSavePromptMode,
    onSavePromptTargetChange,
    onSaveVersionFamilyFilterChange,
    selectSaveTargetPrompt,
    toggleSaveTargetDropdown,
    showPromptHoverPopup,
    hidePromptHoverPopup,
    openPromptBankModal,
    closePromptBankModal,
    changePromptCardVersion,
    setPromptActiveVersion,
    editVersionCommentPrompt,
    renderPromptBank,
    loadPromptToDesigner,
    deletePromptFromBank,
    duplicatePromptInBank,
    copyPromptBankPhase1,
    copyPromptBankPhase2,
    updatePromptBankCounterBadge
} from './modules/prompt-bank.js';

import {
    openPromptHistoryModal,
    closePromptHistoryModal,
    renderPromptHistoryTimeline,
    deletePromptVersion
} from './modules/prompt-history.js';

import {
    exportPromptBankToJson,
    exportPromptBankToMarkdown,
    exportSinglePromptToMarkdown,
    exportPromptBankToTxt,
    toggleExportDropdown,
    closeExportDropdown,
    triggerLocalRestore,
    handleLocalRestoreFile,
    openRestoreModal,
    closeRestoreModal,
    executeRestore,
    backupToGoogleDrive,
    restoreFromGoogleDrive
} from './modules/backup-sync.js';

import {
    openFeedbackModal,
    closeFeedbackModal,
    handleFeedbackBackdropClick,
    handleFeedbackSubmit
} from './modules/feedback.js';

// =============================================================================
// PUENTE GLOBAL (WINDOW BINDINGS) PARA EVENTOS HTML EN LÍNEA
// =============================================================================
Object.assign(window, {
    // Config & Info
    APP_VERSION,
    slides,
    FP_FAMILIES,
    state,

    // Tema y Notificaciones
    initTheme,
    toggleTheme,
    setTheme,
    getCurrentTheme,
    updateThemeUI,
    showToast,
    escapeHtml,
    formatDate,

    // UI & Navegación
    switchTab,
    toggleGlobalFullscreen,

    // Presentación & Cronómetro
    renderSlide,
    prevSlide,
    nextSlide,
    goToSlide,
    toggleNotes,
    toggleTimer,
    resetTimer,
    renderFilterPills,
    renderFamilyCards,
    setPromptFilter,
    filterPrompts,
    copyPromptText,
    updateAuditScore,

    // Diseñador TCREI
    onPhase1Input,
    onPhase2Input,
    buildPrompt,
    copyPromptPhase1,
    copyPromptPhase2,
    copyGeneratedPrompt,
    downloadPromptMd,
    loadPreset,
    resetGeneratorForm,
    loadTemplateToGenerator,

    // API & Auditoría IA
    PROVIDER_MODELS,
    openApiConfigModal,
    closeApiConfigModal,
    updateModelDropdown,
    toggleApiKeyVisibility,
    saveApiKeyConfig,
    testApiConnection,
    clearApiKeyConfig,
    loadApiKeyConfig,
    updateApiStatusBadge,
    copyAuditMetaPrompt,
    switchDiagModalTab,
    setDiagViewMode,
    onDiagFieldEdited,
    resetAIOptimizationProposal,
    runAIDiagnosis,
    closeAIDiagnosisModal,
    applyAIOptimization,

    // Banco de Prompts & Versiones
    openSavePromptModal,
    closeSavePromptModal,
    submitSavePrompt,
    setSavePromptMode,
    onSavePromptTargetChange,
    onSaveVersionFamilyFilterChange,
    selectSaveTargetPrompt,
    toggleSaveTargetDropdown,
    showPromptHoverPopup,
    hidePromptHoverPopup,
    openPromptBankModal,
    closePromptBankModal,
    changePromptCardVersion,
    setPromptActiveVersion,
    editVersionCommentPrompt,
    renderPromptBank,
    loadPromptToDesigner,
    deletePromptFromBank,
    duplicatePromptInBank,
    copyPromptBankPhase1,
    copyPromptBankPhase2,
    updatePromptBankCounterBadge,

    // Historial
    openPromptHistoryModal,
    closePromptHistoryModal,
    renderPromptHistoryTimeline,
    deletePromptVersion,

    // Backup & Google Drive
    exportPromptBankToJson,
    exportPromptBankToMarkdown,
    exportSinglePromptToMarkdown,
    exportPromptBankToTxt,
    toggleExportDropdown,
    closeExportDropdown,
    triggerLocalRestore,
    handleLocalRestoreFile,
    openRestoreModal,
    closeRestoreModal,
    executeRestore,
    backupToGoogleDrive,
    restoreFromGoogleDrive,

    // Feedback
    openFeedbackModal,
    closeFeedbackModal,
    handleFeedbackBackdropClick,
    handleFeedbackSubmit
});

// =============================================================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// =============================================================================
function initApp() {
    updateAppVersionLabels();
    initTheme();
    renderSlide(0);
    renderFilterPills();
    renderFamilyCards();
    loadApiKeyConfig();
    buildPrompt();
    updatePromptBankCounterBadge();

    // Atajos de teclado
    initKeyboardShortcuts({
        nextSlide,
        prevSlide,
        toggleNotes,
        closeAllModals: () => {
            closeFeedbackModal();
            closeApiConfigModal();
            closeAIDiagnosisModal();
            closeSavePromptModal();
            closePromptBankModal();
            closeRestoreModal();
            closePromptHistoryModal();
        }
    });

    // Cierre de dropdowns al hacer clic fuera
    document.addEventListener('click', (event) => {
        const exportWrapper = document.getElementById('export-dropdown-wrapper');
        if (exportWrapper && !exportWrapper.contains(event.target)) {
            closeExportDropdown();
        }

        const targetTrigger = document.getElementById('save-target-dropdown-trigger');
        const targetMenu = document.getElementById('save-target-dropdown-menu');
        if (targetTrigger && targetMenu && !targetTrigger.contains(event.target) && !targetMenu.contains(event.target)) {
            targetMenu.classList.add('hidden');
            hidePromptHoverPopup();
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
