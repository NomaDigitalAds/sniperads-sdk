type TrackEventType = 'page_view' | 'vsl_play' | 'vsl_lead' | 'vsl_pitch' | 'initiate_checkout';
/** -----------------------------------------------------------------
 *  Cria o visitante
 *  ----------------------------------------------------------------- */
export declare function initVisitor(): Promise<void>;
/** -----------------------------------------------------------------
 *  Envia eventos para o Tracking
 *  ----------------------------------------------------------------- */
export declare function trackEvent(event_type: TrackEventType): Promise<void>;
export {};
