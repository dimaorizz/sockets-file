const fs = require('fs');
const eol = require('eol');

const readStream = fs.createReadStream('serverFiles/large-file.txt');

readStream.on('data', (chunk) => {
  
});