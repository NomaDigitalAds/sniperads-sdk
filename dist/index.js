/**
 * SniperAds SDK
 * Sistema de tracking para páginas de funil
 */
// Exporta utilitários
export { pushEvent, listenDOMReady, } from './utils/utils';
// Exporta funções de tracking
export { initVisitor, trackEvent, } from './core/tracking';
// Exporta funções de funil
export { goPageAccept, goPageReject, goPageCheckout, } from './core/funnel';
// Exporta funções de bus de eventos
export { onEvent, onEvents } from './core/eventLayer';
// Exporta pixels
export { initFacebookPixel, sendFacebookEvent, updateFacebookClids } from './integrations/facebook';
