/**
 * =============================================================================
 * KIT IA DOCENTES FP - HELPERS DE INTERFAZ, PESTAÑAS Y ATAJOS (v1.3.0)
 * =============================================================================
 */

import { state } from '../core/state.js';

export function switchTab(tabId) {
    state.activeTab = tabId;
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-tab-btn').forEach(el => el.classList.remove('active'));

    const sec = document.getElementById(`sec-${tabId}`);
    const btn = document.getElementById(`tab-${tabId}`);

    if (sec) sec.classList.remove('hidden');
    if (btn) btn.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function toggleGlobalFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error entering fullscreen: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

export function initKeyboardShortcuts(actions = {}) {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (actions.closeAllModals) actions.closeAllModals();
            return;
        }

        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
            return;
        }

        if (e.key === 'ArrowRight' || e.key === ' ') {
            if (state.activeTab === 'presentation' && actions.nextSlide) {
                e.preventDefault();
                actions.nextSlide();
            }
        } else if (e.key === 'ArrowLeft') {
            if (state.activeTab === 'presentation' && actions.prevSlide) {
                e.preventDefault();
                actions.prevSlide();
            }
        } else if (e.key === 'f' || e.key === 'F') {
            e.preventDefault();
            toggleGlobalFullscreen();
        } else if (e.key === 'n' || e.key === 'N') {
            if (state.activeTab === 'presentation' && actions.toggleNotes) {
                e.preventDefault();
                actions.toggleNotes();
            }
        }
    });
}
