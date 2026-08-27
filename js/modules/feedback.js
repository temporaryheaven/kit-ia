/**
 * =============================================================================
 * KIT IA DOCENTES FP - FORMULARIO DE FEEDBACK Y PROPUESTAS DE MEJORA (v1.3.0)
 * =============================================================================
 */

import { GOOGLE_SCRIPT_FEEDBACK_URL } from '../config.js';
import { state } from '../core/state.js';
import { showToast } from '../core/toast.js';

export function openFeedbackModal() {
    const modal = document.getElementById('modal-feedback');
    if (!modal) return;

    // Reset status banner
    const statusBanner = document.getElementById('feedback-status-banner');
    if (statusBanner) {
        statusBanner.className = 'hidden p-3.5 rounded-xl text-xs flex items-center gap-2.5';
        statusBanner.innerHTML = '';
    }

    // Update contextual indicator badge
    const contextEl = document.getElementById('feedback-context-indicator');
    if (contextEl) {
        let tabName = 'Presentación';
        if (state.activeTab === 'infographic') tabName = 'Infografía';
        else if (state.activeTab === 'generator') tabName = 'Diseñador TCREI';
        else if (state.activeTab === 'prompts') tabName = 'Banco por Familias';
        else if (state.activeTab === 'cheatsheet') tabName = 'Cheat Sheet & RGPD';

        let slideInfo = state.activeTab === 'presentation' ? `Diapositiva: ${state.currentSlideIndex + 1}/8` : 'N/A';
        contextEl.textContent = `Pestaña: ${tabName} • ${slideInfo}`;
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    // Focus on subject field after opening
    setTimeout(() => {
        const subjectInput = document.getElementById('feedback-subject');
        if (subjectInput) subjectInput.focus();
    }, 100);
}

export function closeFeedbackModal() {
    const modal = document.getElementById('modal-feedback');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

export function handleFeedbackBackdropClick(event) {
    if (event.target && event.target.id === 'modal-feedback') {
        closeFeedbackModal();
    }
}

export async function handleFeedbackSubmit(event) {
    event.preventDefault();

    const typeEl = document.getElementById('feedback-type');
    const subjectEl = document.getElementById('feedback-subject');
    const messageEl = document.getElementById('feedback-message');
    const emailEl = document.getElementById('feedback-email');
    const statusBanner = document.getElementById('feedback-status-banner');
    const submitBtn = document.getElementById('btn-submit-feedback');
    const submitBtnText = document.getElementById('btn-submit-feedback-text');

    if (!typeEl || !subjectEl || !messageEl || !submitBtn) return;

    const feedbackType = typeEl.value;
    const subject = subjectEl.value.trim();
    const message = messageEl.value.trim();
    const email = emailEl ? emailEl.value.trim() : '';

    if (!subject || !message) {
        showToast("Campos Incompletos", "Por favor completa el asunto y el mensaje.", "trash");
        return;
    }

    let tabName = state.activeTab;
    if (state.activeTab === 'presentation') tabName = 'Presentación Interactiva';
    else if (state.activeTab === 'infographic') tabName = 'Infografía Resumen';
    else if (state.activeTab === 'generator') tabName = 'Diseñador TCREI';
    else if (state.activeTab === 'prompts') tabName = 'Banco por Familias';
    else if (state.activeTab === 'cheatsheet') tabName = 'Cheat Sheet & RGPD';

    const payload = {
        type: 'feedback',
        feedbackType: feedbackType,
        subject: subject,
        message: message,
        email: email || 'No proporcionado',
        context: {
            activeTab: tabName,
            currentSlide: state.activeTab === 'presentation' ? (state.currentSlideIndex + 1) : 'N/A',
            configuredProvider: localStorage.getItem('tcrei_api_provider') || 'No configurado',
            userAgent: navigator.userAgent
        },
        submittedAt: new Date().toISOString()
    };

    // Set loading state
    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
    if (submitBtnText) submitBtnText.textContent = 'Enviando...';

    if (statusBanner) {
        statusBanner.className = 'p-3.5 rounded-xl text-xs flex items-center gap-2.5 bg-purple-500/10 border border-purple-500/30 text-purple-200';
        statusBanner.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin text-purple-400"></i> Enviando aportación al administrador...';
    }

    try {
        if (!GOOGLE_SCRIPT_FEEDBACK_URL || GOOGLE_SCRIPT_FEEDBACK_URL.trim() === '') {
            console.warn("GOOGLE_SCRIPT_FEEDBACK_URL no está configurado. Simulación:", payload);
            await new Promise(resolve => setTimeout(resolve, 800));

            if (statusBanner) {
                statusBanner.className = 'p-3.5 rounded-xl text-xs flex items-center gap-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-200';
                statusBanner.innerHTML = '<i class="fa-solid fa-circle-check text-amber-400"></i> ¡Feedback registrado localmente! (Configura <code>GOOGLE_SCRIPT_FEEDBACK_URL</code> para conectarlo con Google Sheets y alertas por email).';
            }
            showToast("Feedback Recibido", "¡Gracias por tu colaboración para mejorar la herramienta!", "bolt");
        } else {
            await fetch(GOOGLE_SCRIPT_FEEDBACK_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (statusBanner) {
                statusBanner.className = 'p-3.5 rounded-xl text-xs flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-200';
                statusBanner.innerHTML = '<i class="fa-solid fa-circle-check text-emerald-400"></i> ¡Aportación enviada con éxito! Muchas gracias por colaborar en la mejora del Kit.';
            }
            showToast("Feedback Enviado", "Tu mensaje ha sido guardado y notificado al administrador.", "check");
        }

        if (subjectEl) subjectEl.value = '';
        if (messageEl) messageEl.value = '';
        if (emailEl) emailEl.value = '';

        setTimeout(() => {
            closeFeedbackModal();
        }, 2200);

    } catch (err) {
        console.error("Feedback Submission Error:", err);
        if (statusBanner) {
            statusBanner.className = 'p-3.5 rounded-xl text-xs flex items-center gap-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-200';
            statusBanner.innerHTML = `<i class="fa-solid fa-circle-exclamation text-rose-400"></i> Error al enviar: ${err.message || 'Error de conexión'}. Inténtalo de nuevo más tarde.`;
        }
        showToast("Error de Envío", "No se pudo entregar el feedback.", "trash");
    } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
        if (submitBtnText) submitBtnText.textContent = 'Enviar Aportación';
    }
}
