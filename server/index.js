const _ = require('lodash');
const WebSocket = require('ws');
const net = require('net');
const createParser = require('./js-opc/parser');
const createStrand = require('./js-opc/strand');

// const color = {
//   red: 0,
//   green: 0,
//   blue: 111,
// };

const padByte = number => String(number).padStart(3, '0');
const serializeColor = c => `${padByte(c.red)}${padByte(c.green)}${padByte(c.blue)}`;

let socket = null;

const wss = new WebSocket.Server({ 
  port: 8080,
  clientTracking: true,
});

console.log('websocket server started on port 8080');


wss.on('connection', (ws, request) => {
  const clientHost = _.get(request, 'rawHeaders.host', 'N/A');
  console.log('connection from ', clientHost);

  socket = ws;
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.on('close', () => {
    console.log('connection closed');
  });

  ws.on('error', error => {
    console.log('error', error);
  })

});


const opcServer = net.createServer(connection => {
  connection.pipe(createParser()).on('data', message => {
    // console.log('message', message);
    // Read pixel colors
    if (message.command === 0) {
      const strand = createStrand(message.data);
      for (var i = 0; i < strand.length; i++) {
        // console.log("  Pixel", i, strand.getPixel(i));
        const [red, green, blue] = strand.getPixel(i);
        // color.red = r;
        // color.green = g;
        // color.blue = b;
        const color = {red, green, blue};

        if (socket) {
          const colorString = `c${serializeColor(color)}`;
          console.log('color', colorString);
          socket.send(colorString);
        }        
      }

      // console.log('strand', strand.length);
    }    
  })
});

opcServer.listen(7890);

console.log('opc server started on port 7890');


// setInterval(() => { 
//   color.red += 5;
//   if (color.red >= 255) {
//     color.red = 0;;  
//   }
//   color.blue -= 5;
//   if (color.blue <= 0) {
//     color.blue = 255;
//   }
//   color.green += 2;
//   if (color.green >= 255) {
//     color.green = 0;
//   }
//   if (socket) {
//     const colorString = `c${serializeColor(color)}`;
//     console.log('color', colorString);
//     socket.send(colorString);
//   }
// }, 33);
