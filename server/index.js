const _ = require('lodash');
const WebSocket = require('ws');
// const randomColor = require('./sketches/randomColor');
const sineWave = require('./sketches/sineWave');
const FrameBuffer = require('./FrameBuffer');

const padByte = number => String(number).padStart(3, '0');
const serializeColor = ([r, g, b]) => `c${padByte(r)}${padByte(g)}${padByte(b)}`;

const wss = new WebSocket.Server({ 
  port: 8080,
  clientTracking: true,
});

console.log('websocket server started on port 8080');

const clients = [];

wss.on('connection', (ws, request) => {
  let pixelId = undefined;
  let clientId = undefined;
  const host = _.get(request, 'connection.remoteAddress', {});
  console.log('connection from ', host);
  
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    if (message.match('pixel')) {
      pixelId = parseInt(message.split(' ').slice(1));
      clientId = clients.length;      
      clients.push({
        host,
        pixelId,
        ws,
      });  
      console.log('clients connected:', wss.clients.size);
    }
  });

  ws.on('close', () => {
    console.log('connection closed');
    if (clients[clientId]) {
      clients[clientId] = undefined;
      delete clients[clientId];
      console.log('clients connected:', wss.clients.size);
    }
  });

  ws.on('error', error => {
    console.log('error', error);
  })
});

const frameBuffer = new FrameBuffer(8, 8);

// randomColor(frameBuffer);
sineWave(frameBuffer);

setInterval(() => { 
  // console.log(frameBuffer.getPixels());
  clients.forEach(client => {
    if (client && client.ws) {      
      const color = frameBuffer.getPixelByIndex(client.pixelId);
      // console.log('color', color);
      const colorString = serializeColor(color);
      client.ws.send(colorString);
    }
  });
  
}, 33);
