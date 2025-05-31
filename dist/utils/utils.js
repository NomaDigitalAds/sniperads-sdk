// Configurações
// Adiciona um evento para o dataLayer
export function pushEvent(event) {
    if (!isBrowser())
        return;
    window.eventLayer = window.eventLayer || [];
    window.eventLayer.push(event);
}
// Obtém um item do localStorage com o prefixo
export function getStorageItem(key) {
    return localStorage.getItem(`sniperads.${key}`);
}
// Define um item no localStorage com o prefixo
export function setStorageItem(key, value) {
    localStorage.setItem(`sniperads.${key}`, value);
}
// Escuta o DOMContentLoaded 
export function listenDOMReady() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            pushEvent('dom_ready');
        });
    }
    else {
        pushEvent('dom_ready');
    }
}
/**
 * Verifica se estamos em um ambiente de navegador
 */
export function isBrowser() {
    return typeof window !== 'undefined';
}
