const app = require("express")();
const httpServer = require("http").createServer(app);
const options = { /* ... */ };
const io = require("socket.io")(httpServer, options);
const fs = require('fs');
const path = require("path");
const splitFile = require("split-file");

app.get('/', (req, res) => {
  res.sendStatus(200);
})

const connections = [];

io.on("connection", socket => {
  socket.on('error', (err) => {
    console.log(err);
  })
  connections.push(socket);
  console.log(socket.id);
  socket.on('MSG', (data) => {
    const pt = path.resolve(__dirname, `serverFiles/${data.name.split(path.sep).pop()}`);
    console.log(pt);
    fs.writeFileSync(pt, data.file);
  })
  socket.on('END_FILE', data => {
    const filenames = data.filenames.map(name => `serverFiles/${name.split(path.sep).pop()}`);
    splitFile.mergeFiles(filenames, `serverFiles/${filenames[0].split(path.sep).pop().split('.sf')[0]}`).then(() => { // parsing original filename
      filenames.forEach(name => {
        fs.unlinkSync(path.resolve(__dirname, `serverFiles/${name.split(path.sep).pop()}`));
      })
    });
  });
  /* ... */ });

httpServer.listen(3000);