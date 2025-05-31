/**
 * eventLayer.ts - Sistema de eventos simplificado
 * - Intercepta window.eventLayer.push()
 * - Permite registrar handlers para eventos
 * - Cada handler é isolado; falha de um não derruba os outros
 */
declare global {
    interface Window {
        eventLayer: any;
    }
}
type EventName = string;
type Handler = () => void;
/**
 * onEvent - Registra um handler para um evento
 * @param eventName Nome do evento
 * @param handler Função a ser executada quando o evento ocorrer
 */
declare function onEvent(eventName: string, handler: Handler): void;
/**
 * onEvents - Solução unificada que dispara o handler quando TODOS os eventos ocorrerem
 * @param events Um evento único ou array de eventos
 * @param handler Função a ser executada quando todos os eventos ocorrerem
 */
declare function onEvents(events: EventName | EventName[], handler: Handler): void;
export { onEvent, onEvents };
