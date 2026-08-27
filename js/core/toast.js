/**
 * =============================================================================
 * KIT IA DOCENTES FP - SISTEMA DE NOTIFICACIONES TOAST (v1.3.0)
 * =============================================================================
 */

let toastTimeout = null;

export function showToast(title, message, icon = "check") {
    const toast = document.getElementById('toast');
    const iconEl = document.getElementById('toast-icon');
    const titleEl = document.getElementById('toast-title');
    const msgEl = document.getElementById('toast-msg');

    if (!toast || !iconEl || !titleEl || !msgEl) return;

    titleEl.innerText = title;
    msgEl.innerText = message;

    let iconHtml = '<i class="fa-solid fa-check"></i>';
    if (icon === 'download') iconHtml = '<i class="fa-solid fa-download"></i>';
    if (icon === 'bolt') iconHtml = '<i class="fa-solid fa-bolt"></i>';
    if (icon === 'trash') iconHtml = '<i class="fa-solid fa-trash"></i>';
    if (icon === 'shield') iconHtml = '<i class="fa-solid fa-shield-halved"></i>';
    if (icon === 'sun') iconHtml = '<i class="fa-solid fa-sun text-amber-400"></i>';
    if (icon === 'moon') iconHtml = '<i class="fa-solid fa-moon text-brand-400"></i>';
    if (icon === 'wand') iconHtml = '<i class="fa-solid fa-wand-magic-sparkles text-amber-400"></i>';

    iconEl.innerHTML = iconHtml;

    if (window.FontAwesome && window.FontAwesome.dom) {
        window.FontAwesome.dom.i2svg();
    }

    toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
        toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3000);
}
