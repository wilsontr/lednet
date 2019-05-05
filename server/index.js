const _ = require('lodash');
const WebSocket = require('ws');
// const createParser = require('./js-opc/parser');
// const createStrand = require('./js-opc/strand');

const padByte = number => String(number).padStart(3, '0');
const serializeColor = ([r, g, b]) => `${padByte(r)}${padByte(g)}${padByte(b)}`;

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


// const opcServer = net.createServer(connection => {
//   connection.pipe(createParser()).on('data', message => {
//     // Read pixel colors
//     if (message.command === 0) {
//       const strand = createStrand(message.data);
//       for (var i = 0; i < strand.length; i++) {
//         // console.log("  Pixel", i, strand.getPixel(i));
//         const [red, green, blue] = strand.getPixel(i);
//         const color = {red, green, blue};

//         if (socket) {
//           const colorString = `c${serializeColor(color)}`;
//           // console.log('color', colorString);
//           socket.send(colorString);
//         }        
//       }
//     }    
//   })
// });

// opcServer.listen(7890);



console.log('opc server started on port 7890');

let color = [0, 0, 0]
let currentColor = 'red';

setInterval(() => {
  // console.log(currentColor);
  switch (currentColor) {
    case 'red': color = [255, 0, 0]; currentColor = 'blue'; break;
    case 'blue': color = [0, 0, 255]; currentColor = 'green'; break;
    case 'green': color = [0, 255, 0]; currentColor = 'red'; break;
  }
}, 500);

setInterval(() => { 
  const colorString = `c${serializeColor(color)}`;
  // console.log('color', colorString);
  // socket.send(colorString);
  clients.forEach(client => {
    if (client && client.ws) {
      client.ws.send(colorString);
    }
  });
}, 33);
