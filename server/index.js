const _ = require('lodash');
const WebSocket = require('ws');
const net = require('net');
const createParser = require('./parser');


const opcServer = net.createServer(connection => {
  connection.pipe(createParser()).on('data', message => {
    console.log('message', message);
  })
});

opcServer.listen(7890);

console.log('opc server started on port 7890');

const wss = new WebSocket.Server({ 
  port: 8080,
  clientTracking: true,
});
console.log('websocket server started on port 8080');

const color = {
  red: 0,
  green: 0,
  blue: 111,
};

const padByte = number => String(number).padStart(3, '0');

const serializeColor = c => `${padByte(c.red)}${padByte(c.green)}${padByte(c.blue)}`;

let socket = null;

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

setInterval(() => { 
  color.red += 5;
  if (color.red >= 255) {
    color.red = 0;;  
  }
  color.blue -= 5;
  if (color.blue <= 0) {
    color.blue = 255;
  }
  color.green += 2;
  if (color.green >= 255) {
    color.green = 0;
  }
  if (socket) {
    const colorString = `c${serializeColor(color)}`;
    console.log('color', colorString);
    socket.send(colorString);
  }
}, 33);
