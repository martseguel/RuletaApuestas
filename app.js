const express = require('express');
const app = express();
const mime = require('mime');
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
var last100Rolls = [10,2,0,10,2,0,10,2,0];


const client = []
io.sockets.on('connection', (socket) => {
  console.log("Cliente conectado");
  socket.emit("startProgressBar", secs - 1);
  socket.emit("last100RollsInit", last100Rolls);

  socket.on("userBet", (amount, username) => {
    io.emit("newUserBet"(amount, username));
    //Do ddbb 
  })

})


const setHeadersOnStatic = (res, path, stat) => {
  const type = mime.getType(path);
  res.set('content-type', type);
}
const staticOptions = {
  setHeaders: setHeadersOnStatic
}
app.use(express.static(path.join(__dirname, 'client'), staticOptions));


app.get('/', (req, res) => {
  res.sendFile("/index.html")
})


// Iniciar el servidor
server.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
  startTimer(20);
  //for(var i = 0; i < 99; i++){
  //  var num = getRandomIntInclusive(0,14);
  //  last100Rolls.push(num);
  //}
});

var timeInSecs;
var ticker;

function startTimer(secs) {
  waiterProgressBar = setInterval(() => {
    io.emit("startProgressBar", 20);
    clearInterval(waiterProgressBar);
  }, 1000)
  timeInSecs = parseInt(secs);
  ticker = setInterval(() => {
    tick();
  }, 1000)
}
var secs = timeInSecs;

function tick() {
  secs = timeInSecs;
  if (secs > 0) {
    timeInSecs--;
  }
  else {
    randNum = getRandomIntInclusive(0, 14);
    io.emit("roll", randNum);
    if (last100Rolls.length > 99) {
      last100Rolls.shift();
    }
    last100Rolls.push(randNum);
    console.log(last100Rolls);
    clearInterval(ticker);
    setTimeout(function () {
      startTimer(20);
      io.emit('newRollStat', randNum);
      io.emit("startProgressBar", 0);
    }, 7000);
  }

  var days = Math.floor(secs / 86400);
  secs %= 86400;
  var hours = Math.floor(secs / 3600);
  secs %= 3600;
  var mins = Math.floor(secs / 60);
  secs %= 60;
  var pretty = ((days < 10) ? "0" : "") + days + ":" + ((hours < 10) ? "0" : "") + hours + ":" + ((mins < 10) ? "0" : "") + mins + ":" + ((secs < 10) ? "0" : "") + secs;

  io.emit('remainingSecs', secs);
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

