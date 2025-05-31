/**
 * eventLayer.ts - Sistema de eventos simplificado
 * - Intercepta window.eventLayer.push()
 * - Permite registrar handlers para eventos
 * - Cada handler é isolado; falha de um não derruba os outros
 */
import { isBrowser } from '../utils/utils';
// Array de handlers registrados para cada evento
const eventHandlers = {};
// Histórico de eventos disparados
const firedEvents = new Set();
// Garantir que eventLayer exista imediatamente
if (isBrowser()) {
    window.eventLayer = window.eventLayer || [];
}
/**
 * onEvent - Registra um handler para um evento
 * @param eventName Nome do evento
 * @param handler Função a ser executada quando o evento ocorrer
 */
function onEvent(eventName, handler) {
    // Inicializa o array de handlers para este evento se não existir
    if (!eventHandlers[eventName]) {
        eventHandlers[eventName] = [];
    }
    // Adiciona o handler
    eventHandlers[eventName].push(handler);
    // Se o evento já foi disparado anteriormente, executa o handler imediatamente
    if (firedEvents.has(eventName)) {
        setTimeout(() => {
            try {
                handler();
            }
            catch (e) {
                console.error('[eventLayer] Erro ao executar handler para evento', eventName, e);
            }
        }, 0);
    }
}
/**
 * onEvents - Solução unificada que dispara o handler quando TODOS os eventos ocorrerem
 * @param events Um evento único ou array de eventos
 * @param handler Função a ser executada quando todos os eventos ocorrerem
 */
function onEvents(events, handler) {
    // Normalizar para array de eventos
    const eventList = Array.isArray(events) ? events : [events];
    if (eventList.length === 0)
        return;
    // Caso especial: apenas 1 evento
    if (eventList.length === 1) {
        onEvent(eventList[0], handler);
        return;
    }
    // Caso de múltiplos eventos
    const received = new Set();
    const total = eventList.length;
    // Verificar eventos que já foram disparados
    eventList.forEach(eventName => {
        if (firedEvents.has(eventName)) {
            received.add(eventName);
        }
    });
    // Se todos já ocorreram, disparar o handler imediatamente
    if (received.size === total) {
        setTimeout(handler, 0);
        return;
    }
    // Registrar handler para cada evento que ainda não ocorreu
    eventList.forEach(eventName => {
        onEvent(eventName, () => {
            received.add(eventName);
            if (received.size === total)
                handler();
        });
    });
}
/* intercepta o push e simplifica para trabalhar apenas com strings */
if (isBrowser() && !window.eventLayer._intercepted) {
    const nativePush = Array.prototype.push;
    window.eventLayer._intercepted = true;
    window.eventLayer.push = function (eventName) {
        // Adiciona ao array
        nativePush.call(this, eventName);
        // Marca o evento como disparado
        firedEvents.add(eventName);
        // Executa os handlers registrados para este evento
        if (eventHandlers[eventName]) {
            eventHandlers[eventName].forEach(handler => {
                try {
                    handler();
                }
                catch (e) {
                    console.error('[eventLayer] Erro ao processar evento', eventName, e);
                }
            });
        }
        return this.length;
    };
}
// Exportar as funções
export { onEvent, onEvents };
