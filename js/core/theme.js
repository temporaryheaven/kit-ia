/**
 * =============================================================================
 * KIT IA DOCENTES FP - CONTROLADOR DE TEMA CLARO / OSCURO (v1.3.0)
 * =============================================================================
 */

import { showToast } from './toast.js';

export function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
}

export function updateThemeUI(theme) {
    const iconWrap = document.getElementById('theme-toggle-icon-wrap');
    const text = document.getElementById('theme-toggle-text');
    const btn = document.getElementById('btn-toggle-theme');

    if (theme === 'light') {
        if (iconWrap) {
            iconWrap.innerHTML = '<i class="fa-solid fa-sun text-amber-500 text-sm shrink-0"></i>';
        }
        if (text) {
            text.textContent = 'Modo Oscuro';
        }
        if (btn) {
            btn.title = 'Cambiar a Tema Oscuro';
        }
    } else {
        if (iconWrap) {
            iconWrap.innerHTML = '<i class="fa-solid fa-moon text-brand-400 text-sm shrink-0"></i>';
        }
        if (text) {
            text.textContent = 'Modo Claro';
        }
        if (btn) {
            btn.title = 'Cambiar a Tema Claro';
        }
    }

    if (window.FontAwesome && window.FontAwesome.dom) {
        window.FontAwesome.dom.i2svg();
    }
}

export function setTheme(theme) {
    const validTheme = theme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', validTheme);
    if (validTheme === 'light') {
        document.documentElement.classList.add('light');
    } else {
        document.documentElement.classList.remove('light');
    }
    try {
        localStorage.setItem('kit_ia_theme', validTheme);
    } catch (e) {
        console.warn("No se pudo guardar la preferencia de tema en localStorage:", e);
    }
    updateThemeUI(validTheme);
}

export function toggleTheme() {
    const current = getCurrentTheme();
    const newTheme = current === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    showToast(
        newTheme === 'light' ? 'Tema Claro Activado' : 'Tema Oscuro Activado',
        newTheme === 'light' ? 'Se ha aplicado el tema claro con alto contraste.' : 'Se ha restaurado el tema oscuro original.',
        newTheme === 'light' ? 'sun' : 'moon'
    );
}

export function initTheme() {
    const savedTheme = localStorage.getItem('kit_ia_theme') || 'dark';
    setTheme(savedTheme);
}
