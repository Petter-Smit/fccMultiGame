require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

const app = express();

app.use(helmet.xssFilter());
app.use(helmet.frameguard());
app.use(helmet.noSniff());
app.use(helmet.noCache());
app.use(helmet.hidePoweredBy({
  setTo: 'PHP 7.4.3'
}));

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({origin: '*'})); 

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  }); 

//For FCC testing purposes
fccTestingRoutes(app);
    
// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const portNum = process.env.PORT || 3000;

// Set up server and tests
const server = app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

const io = socket(server);
const Collectible = require("./public/Collectible.mjs");
const {gameConstants} = require("./public/context.mjs");

// Make a coin to send to all players.
const makeCoin = () => {
  let x = Math.floor(Math.random()*gameConstants.field_max_X);
  let y = Math.floor(Math.random()*gameConstants.field_max_Y);
  let value = Math.floor(Math.random()*3 + 1);
  out = new Collectible({'x': x, 'y': y, 'value': value, 'id': 1});
  return out;
}

let theCoin = makeCoin();
let allPlayers = [];

io.on('connection', socket => {
  socket.emit("start", {coin: theCoin, players: allPlayers});

  socket.on("addPlayer", addedPlayer => {
    allPlayers.push(addedPlayer);
    socket.broadcast.emit("newPlayer", addedPlayer);
  });

  socket.on("moveStart", obj =>{
    socket.broadcast.emit("moveStart", {dir: obj.dir, id: socket.id, x: obj.x, y: obj.y});
  });

  socket.on("moveEnd", obj => {
    socket.broadcast.emit("moveEnd", {dir: obj.dir, id: socket.id, x: obj.x, y: obj.y});
  });

  socket.on("tookCoin", () => {
    io.sockets.emit("awardedCoin", {coinVal: theCoin.value, id: socket.id});
    theCoin = makeCoin();
    io.sockets.emit("newCoin", theCoin);
  });

  socket.on('disconnect', () => {
    allPlayers = allPlayers.filter(player => player.id !== socket.id);
    socket.broadcast.emit("removePlayer", (socket.id));
  });
});

module.exports = app; // For testing
