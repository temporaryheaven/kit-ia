/**
 * =============================================================================
 * KIT IA DOCENTES FP - UTILIDADES COMUNES (v1.3.0)
 * =============================================================================
 */

export function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export function formatDate(isoString) {
    if (!isoString) return '-';
    try {
        const d = new Date(isoString);
        return d.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return isoString;
    }
}
