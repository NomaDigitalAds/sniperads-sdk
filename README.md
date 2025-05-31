# SniperAds SDK

SDK para rastreamento e análise de eventos em páginas de funil.

## Instalação

```bash
npm install sniperads-sdk
```

## Uso básico

```js
import { initVisitor, trackEvent, onEvent } from 'sniperads-sdk';

// Inicializa o visitante
initVisitor();

// Envia um evento
trackEvent('page_view');

// Registra um handler para um evento
onEvent('visitor_finded', () => {
  console.log('Visitante identificado!');
});
```

## Funcionalidades

O SDK fornece as seguintes funcionalidades:

- **Tracking de visitantes**: Rastreamento anônimo de visitantes
- **Sistema de eventos**: Pub/sub simplificado para comunicação entre componentes
- **Integração com Facebook Pixel**: Envio automático de eventos para o Facebook
- **Gerenciamento de funil**: Funções para gerenciar o fluxo do funil de vendas

## Documentação

### Core

```js
// Inicializa o tracking para um visitante
initVisitor();

// Envia um evento para o backend
trackEvent('page_view');
```

### Eventos

```js
// Registra um handler para um evento específico
onEvent('event_name', () => {
  // Ação a ser executada quando o evento ocorrer
});

// Registra um handler que será executado quando todos os eventos ocorrerem
onEvents(['event1', 'event2'], () => {
  // Executado somente após os dois eventos terem sido disparados
});

// Dispara um evento
pushEvent('event_name');
```

### Facebook Pixel

```js
// Inicializa o Facebook Pixel
initFacebookPixel('pixel_id');

// Envia um evento para o Facebook
sendFacebookEvent('PageView');

// Atualiza os clids para o Facebook
updateFacebookClids();
```

## Licença

MIT
