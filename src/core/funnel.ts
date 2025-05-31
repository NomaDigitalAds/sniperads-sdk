import { PAGE_FUNNEL_URL } from '../config';
import {isBrowser, getStorageItem, setStorageItem } from '../utils/utils';


/** -----------------------------------------------------------------
 * Processa botão de checkout
 * ----------------------------------------------------------------- */
export async function goPageCheckout(): Promise<void> {
    if (!isBrowser()) return;
    
    const visitor_id = getStorageItem('visitor_id');
    if (!visitor_id) return;
  
    try {
      const res = await fetch(`${PAGE_FUNNEL_URL}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitor_id,
          page_url: location.href,
        }),
      });
      
      if (!res.ok) throw new Error(`Falha ao processar checkout: ${res.statusText}`);
      const checkoutSession = await res.json();
  
      // Salva o ID da sessão no localStorage
      if (checkoutSession.id) {
        setStorageItem('session_id', checkoutSession.id);
      }
  
      // Redireciona para a sessão do checkout
      window.location.href = checkoutSession.url;
    } catch (e) {
      console.error('[sniperads] Checkout error:', e);
    }
  }
  
  /** -----------------------------------------------------------------
   * Processa botão de accept do funil
   * ----------------------------------------------------------------- */
  export async function goPageAccept(): Promise<void> {
    if (!isBrowser()) return;
    
    const visitor_id = getStorageItem('visitor_id');
    if (!visitor_id) return;
  
    try {
      const res = await fetch(`${PAGE_FUNNEL_URL}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitor_id,
          page_url: location.href,
          original_session: getStorageItem('session_id')
        }),
      });
      
      if (!res.ok) throw new Error('Accept funnel failed');
      const response = await res.json();
  
      // Se sucesso, redireciona para a URL de sucesso
      if (response.success) {
        window.location.href = response.redirect;
      }
    } catch (e) {
      console.error('[sniperads] Accept funnel error:', e);
    }
  }
  
  /** -----------------------------------------------------------------
   * Processa botão de reject do funil
   * ----------------------------------------------------------------- */
  export async function goPageReject(): Promise<void> {
    if (!isBrowser()) return;
    
    const visitor_id = getStorageItem('visitor_id');
    if (!visitor_id) return;
  
    try {
      const res = await fetch(`${PAGE_FUNNEL_URL}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitor_id,
          page_url: location.href
        }),
      });
      
      if (!res.ok) throw new Error('Reject funnel failed');
      const response = await res.json();
  
      // Se sucesso, redireciona para a URL de sucesso
      if (response.success) {
        window.location.href = response.redirect;
      }
    } catch (e) {
      console.error('[sniperads] Reject funnel error:', e);
    }
  }
  