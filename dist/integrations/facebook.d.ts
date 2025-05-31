type FacebookEventType = 'PageView' | 'ViewContent';
declare global {
    interface Window {
        fbq?: (...args: any[]) => void;
        _fbq?: typeof window.fbq;
    }
}
/** -----------------------------------------------------------------
 * Inicializa o Facebook Pixel com o ID fornecido
 * ----------------------------------------------------------------- */
export declare function initFacebookPixel(pixelId: string): void;
/** -----------------------------------------------------------------
 * Envia evento Facebook Pixel
 * ----------------------------------------------------------------- */
export declare function sendFacebookEvent(event_type: FacebookEventType): void;
/** -----------------------------------------------------------------
 * Atualiza CLIDs (fbp / fbc) com sistema de polling simplificado
 * ------------------------------------------------------------------*/
export declare function updateFacebookClids(): void;
export {};
