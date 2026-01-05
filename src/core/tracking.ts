import { API_URL } from '../config';
import { getStorageItem, setStorageItem, pushEvent, isBrowser } from '../utils/utils';
type TrackEventType = 'page_view' | 'vsl_play' | 'vsl_lead' | 'vsl_pitch' | 'initiate_checkout'


/** -----------------------------------------------------------------
 *  Cria o visitante
 *  ----------------------------------------------------------------- */
export async function initVisitor(): Promise<void> {
  if (!isBrowser()) return;

  const source = getStorageItem('source');
  if (source) {
    pushEvent(`source_${source}`);
  }

  const existing = getStorageItem('visitor_id');
  if (existing) {
    pushEvent('visitor_finded');
    return;
  }

  try {
    const res = await fetch(
      `${API_URL}/tracking-visitor` +
        `?page_url=${encodeURIComponent(location.href)}` +
        `&referrer=${encodeURIComponent(document.referrer)}` +
        `&language=${encodeURIComponent(navigator.language)}`,
    );
    
    if (!res.ok) throw new Error('visitor create failed');
    const json = await res.json();

    setStorageItem('visitor_id', json.visitor_id);
    setStorageItem('source', json.source_type || '');
    
    pushEvent('visitor_new');
    pushEvent('visitor_finded');
    
    console.log('[sniperads] visitor created:', json.visitor_id);
  } catch (e) {
    console.error('[sniperads] Create visitor error:', e);
  }
}

/** -----------------------------------------------------------------
 *  Envia eventos para o Tracking
 *  ----------------------------------------------------------------- */
export async function trackEvent(event_type: TrackEventType): Promise<void> {
  if (!isBrowser()) return;
  
  const visitor_id = getStorageItem('visitor_id');
  if (!visitor_id) return;

  try {
    await fetch(`${API_URL}/tracking-event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitor_id,
        page_url: location.href,
        event_type,
      }),
    });
    
    console.log('[sniperads] Event sent:', event_type);
    pushEvent(`event_${event_type}`);
  } catch (e) {
    console.error('[sniperads] Event error:', e);
  }
}

