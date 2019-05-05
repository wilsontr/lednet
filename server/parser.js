// modification of https://github.com/parshap/js-opc

const through = require('through2');
const parse = require('parse-binary-stream');
const { Writable } = require('stream');
const plexer = require('plexer');

const parseMessage = (read, callback) => {
  var message = {};
  // read channel
  read(1, data => {
    message.channel = data.readUInt8(0);
    // read command
    read(1, data => {
      message.command = data.readUInt8(0);
      // read data length
      read(2, data => {
        var length = data.readUInt16BE(0);
        // read data
        read(length, function(data) {
          message.data = data;
          // done!
          callback(message);
        });
      });
    });
  });
}

const parseAllMessages = (read, callback) => {
  (function next() {
    parseMessage(read, function(message) {
      callback(message);
      next();
    });
  })();
}

module.exports = () => {
  var parser = parse(read => {
    parseAllMessages(read, message => {
      output.push(message);
    });
  });
  var output = through.obj();
  parser.on('end', () => {
    output.push(null);
  });
  return plexer.obj(parser, output);
};
