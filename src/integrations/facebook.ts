import { API_URL,  } from '../config';
import { getStorageItem } from '../utils/utils';
type FacebookEventType = 'PageView' | 'ViewContent'

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: typeof window.fbq;
  }
}

/** -----------------------------------------------------------------
 * Inicializa o Facebook Pixel com o ID fornecido
 * ----------------------------------------------------------------- */
export function initFacebookPixel(pixelId: string): void {
  if (window.fbq) return;

  // Define fbq como função stub
  const fbq = function (...args: any[]) {
    (fbq as any).callMethod
      ? (fbq as any).callMethod.apply(fbq, args)
      : (fbq as any).queue.push(args);
  };

  (fbq as any).push = fbq;
  (fbq as any).loaded = true;
  (fbq as any).version = '2.0';
  (fbq as any).queue = [];

  window.fbq = fbq;
  window._fbq = fbq;

  // Carregar o script do Pixel
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';

  const firstScript = document.getElementsByTagName('script')[0];
  firstScript?.parentNode?.insertBefore(script, firstScript);

  // Inicializar com visitor_id
  const visitor_id = getStorageItem('visitor_id');
  window.fbq('init', pixelId, { external_id: visitor_id });
}

/** -----------------------------------------------------------------
 * Envia evento Facebook Pixel
 * ----------------------------------------------------------------- */
export function sendFacebookEvent(event_type: FacebookEventType): void {
  if (!window.fbq) {
    console.error('[meta] Pixel não inicializado');
    return;
  }
  
  const visitor_id = getStorageItem('visitor_id');
  window.fbq('track', event_type, {'external_id': visitor_id});
  console.log('[meta] ' + event_type + ' sent', visitor_id);
}


/** -----------------------------------------------------------------
 * Atualiza CLIDs (fbp / fbc) com sistema de polling simplificado
 * ------------------------------------------------------------------*/
export function updateFacebookClids(): void {
  const visitorId = getStorageItem('visitor_id');
  if (!visitorId) return;
  
  // Configurações do polling
  let attempts = 0;
  const maxAttempts = 5;  // Reduzido para 5 tentativas
  const interval = 1000;   // 1 segundo entre tentativas
  
  function checkAndUpdate() {
    // Função simplificada para obter cookies
    const fbp = document.cookie.match(/(_fbp=([^;]*))/)?.[2] || null;
    const fbc = document.cookie.match(/(_fbc=([^;]*))/)?.[2] || null;
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