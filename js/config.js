/**
 * =============================================================================
 * KIT IA DOCENTES FP - CONFIGURACIÓN GLOBAL Y CONSTANTES (v1.3.0)
 * =============================================================================
 */

export const APP_VERSION = '1.3.0';

export const STORAGE_KEY_PROMPTS = 'tcrei_custom_prompts';
export const GDRIVE_CLIENT_ID = '260774404794-5qo9f3p1lianbgmjaolgqsvg9mn6i7ik.apps.googleusercontent.com';
export const GDRIVE_BACKUP_FILENAME = 'Kit_IA_Docentes_TCREI_Backup.json';
export const GDRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';
export const GOOGLE_SCRIPT_FEEDBACK_URL = 'https://script.google.com/macros/s/AKfycbwHWcEkcYT4Gv9myL4fP_Wh-OXqXkb1IrEfue6uTvhx62znJj8DSO9YbG5QDf0zXM9K0g/exec';

/**
 * Sincroniza dinámicamente las etiquetas de versión en la interfaz de usuario.
 */
export function updateAppVersionLabels() {
    document.querySelectorAll('.app-version-label').forEach(el => {
        el.innerText = `v${APP_VERSION}`;
    });
    document.querySelectorAll('.app-version-raw').forEach(el => {
        el.innerText = APP_VERSION;
    });
}
