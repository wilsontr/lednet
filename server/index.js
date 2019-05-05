const _ = require('lodash');
const WebSocket = require('ws');
const randomColor = require('./sketches/randomColor');

const padByte = number => String(number).padStart(3, '0');
const serializeColor = ([r, g, b]) => `c${padByte(r)}${padByte(g)}${padByte(b)}`;

const wss = new WebSocket.Server({ 
  port: 8080,
  clientTracking: true,
});

console.log('websocket server started on port 8080');

const clients = [];
let clientCount = 0;


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
      clientCount++;
      console.log('clients connected:', clientCount);
    }
  });

  ws.on('close', () => {
    console.log('connection closed');
    if (clients[clientId]) {
      clients[clientId] = undefined;
      delete clients[clientId];
      clientCount--;
      console.log('clients connected:', clientCount);
    }
  });

  ws.on('error', error => {
    console.log('error', error);
  })

});


console.log('opc server started on port 7890');

const gridSize = {
  height: 3,
  width: 3,
};

const ledColors = [];

const phase = 0;
const freq = 0.1;
const amplitude = 128;
const offset = 128;
let frame = 0;

for (let idx = 0; idx < (gridSize.height * gridSize.width); idx++) {
  ledColors[idx] = [0, 0, 0];
}

// for (let x = 0; x < gridSize.width; x++ ) {
//   ledColors[x] = new Array();
//   for (let y = 0; y < gridSize.width; y++ ) {
//     ledColors[x][y] = [0, 0, 0];
//   }  
// }

// setInterval(() => {
//   for (let x = 0; x < gridSize.width; x++) {
//     for (let y = 0; y < gridSize.width; y++) {
//       ledColors[x][y] = Math.random() * 255;
//     }
//   }
// }, 500);

randomColor(ledColors, gridSize.height, gridSize.width);

// const getClientPixelColor = clientId => {
//   const y = Math.floor(clientId / gridSize.width);
//   const x = clientId % gridSize.width;

// }


setInterval(() => { 
  // const colorString = `c${serializeColor(color)}`;
  // console.log('color', colorString);
  // socket.send(colorString);
  clients.forEach(client => {
    if (client && client.ws) {      
      const colorString = serializeColor(ledColors[client.pixelId]);
      client.ws.send(colorString);
    }
  });
  
}, 33);
