const express = require('express');
const app = express();
const io = require('socket.io-client');
const fs = require('fs');
const path = require('path');
const splitfile = require('split-file');

const socket = io('http://localhost:3000');
const fileSplitSize = 1000000;

splitfile.splitFileBySize('clientFiles/large-file.txt', fileSplitSize).then(names => {
  names.forEach(name => {
    const file = fs.readFileSync(path.resolve(__dirname, `${name}`));
    socket.emit('MSG', { file: file, name: name});
  })
  names.forEach(name => {
    fs.unlinkSync(path.resolve(__dirname, `clientFiles/${name.split(path.sep).pop()}`));
  })
  socket.emit('END_FILE', { filenames: names}); 
})
