import { API_URL, } from '../config';
import { getStorageItem } from '../utils/utils';
// @ts-ignore - Arquivo .js sem tipagem
import { loadFacebookPixel } from './facebook-pixel-loader.js';
/** -----------------------------------------------------------------
 * Inicializa o Facebook Pixel com o ID fornecido
 * ----------------------------------------------------------------- */
export function initFacebookPixel(pixelId) {
    if (window.fbq) {
        console.warn('[meta] Pixel já inicializado');
        return;
    }
    // Carrega o código oficial do Facebook Pixel
    loadFacebookPixel();
    // Inicializar com visitor_id
    const visitor_id = getStorageItem('visitor_id');
    window.fbq('init', pixelId, { external_id: visitor_id });
    console.log('[meta] Pixel initialized', pixelId);
}
/** -----------------------------------------------------------------
 * Envia evento Facebook Pixel
 * ----------------------------------------------------------------- */
export function sendFacebookEvent(event_type) {
    if (!window.fbq) {
        console.error('[meta] Pixel não inicializado');
        return;
    }
    const visitor_id = getStorageItem('visitor_id');
    window.fbq('track', event_type, { 'external_id': visitor_id });
    console.log('[meta] ' + event_type + ' sent', visitor_id);
    console.log('[meta] teste');
}
/** -----------------------------------------------------------------
 * Atualiza CLIDs (fbp / fbc) com sistema de polling simplificado
 * ------------------------------------------------------------------*/
export function updateFacebookClids() {
    const visitorId = getStorageItem('visitor_id');
    if (!visitorId)
        return;
    // Configurações do polling
    let attempts = 0;
    const maxAttempts = 5; // Reduzido para 5 tentativas
    const interval = 1000; // 1 segundo entre tentativas
    function checkAndUpdate() {
        var _a, _b;
        // Função simplificada para obter cookies
        const fbp = ((_a = document.cookie.match(/(_fbp=([^;]*))/)) === null || _a === void 0 ? void 0 : _a[2]) || null;
        const fbc = ((_b = document.cookie.match(/(_fbc=([^;]*))/)) === null || _b === void 0 ? void 0 : _b[2]) || null;
        const fbclid = !fbc ? new URLSearchParams(window.location.search).get('fbclid') : null;
        // Enviar dados se temos fbp ou atingimos limite de tentativas
        if (fbp || attempts >= maxAttempts) {
            fetch(`${API_URL}/tracking-visitor`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    visitor_id: visitorId,
                    data: {
                        clid: {
                            fbp,
                            fbc: fbc || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : null)
                        }
                    }
                })
            })
                .then(r => console.log('[meta] CLIDs ' + (r.ok ? 'atualizados' : 'erro ' + r.status)))
                .catch(e => console.error('[meta] Erro:', e));
            return;
        }
        attempts++;
        setTimeout(checkAndUpdate, interval);
    }
    checkAndUpdate();
}
