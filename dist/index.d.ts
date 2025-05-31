/**
 * SniperAds SDK
 * Sistema de tracking para páginas de funil
 */
export { pushEvent, listenDOMReady, } from './utils/utils';
export { initVisitor, trackEvent, } from './core/tracking';
export { goPageAccept, goPageReject, goPageCheckout, } from './core/funnel';
export { onEvent, onEvents } from './core/eventLayer';
export { initFacebookPixel, sendFacebookEvent, updateFacebookClids } from './integrations/facebook';
