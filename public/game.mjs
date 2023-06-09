import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
import controls from './controls.mjs';
import {gameConstants} from './context.mjs';
const socket = io();
let canvas = document.getElementById('game-window');
let ctx = canvas.getContext('2d');

let gameFrame = 0;
let players = [];
let localId = '';
let currCoin;

const loadImage = (src) => {
    const out = new Image();
    out.src = src;
    return out;
}

const bronzeCoinImg = loadImage(
  "https://cdn.freecodecamp.org/demo-projects/images/bronze-coin.png"
);
const silverCoinImg = loadImage(
  "https://cdn.freecodecamp.org/demo-projects/images/silver-coin.png"
);
const goldCoinImg = loadImage(
  "https://cdn.freecodecamp.org/demo-projects/images/gold-coin.png"
);
const mainPlayerImg = loadImage(
  "https://cdn.freecodecamp.org/demo-projects/images/main-player.png"
);
const otherPlayerImg = loadImage(
  "https://cdn.freecodecamp.org/demo-projects/images/other-player.png"
);

const makeLocalPlayer = (id) => new Player({
  x: Math.floor(Math.random()*gameConstants.field_max_X),
  y: Math.floor(Math.random()*gameConstants.field_max_Y),
  score: 0,
  id: id,
});

socket.on("start", (obj) => {
  const localPlayer = makeLocalPlayer(socket.id);
  socket.emit("addPlayer", localPlayer);
  obj.players.forEach(player => {
    players.push(new Player(player));
  })
  players.push(localPlayer);
  localId = socket.id;
  console.log("this is my id:", localId);
  currCoin = obj.coin;

  socket.on("newPlayer", (added) => {
    players.push(new Player(added));
  });

  socket.on("removePlayer", (removed) => {
    players = players.filter(player => player.id !== removed);
  });

  socket.on("moveStart", obj =>{
    const movingPlayer = players.find(player => player.id === obj.id);
    movingPlayer.movement[obj.dir] = 1;
    movingPlayer.x = obj.x;
    movingPlayer.y = obj.y;
  });
  
  socket.on("moveEnd", obj=>{
    const movingPlayer = players.find(player => player.id === obj.id);
    movingPlayer.movement[obj.dir] = 0;
    movingPlayer.x = obj.x;
    movingPlayer.y = obj.y;
  });

  socket.on("awardedCoin", (obj) => {
    players.find(player => player.id === obj.id).score += obj.coinVal;
  });

  socket.on("newCoin", newCoin => {
    currCoin = newCoin;
  });

  controls(localPlayer, socket);
  animate();
});

const animate = () => {
  ctx.fillStyle = '#231f20';
  ctx.clearRect(0, 0, gameConstants.CANVAS_WIDTH, gameConstants.CANVAS_HEIGHT);
  ctx.fillRect(0, 0, gameConstants.CANVAS_WIDTH, gameConstants.CANVAS_HEIGHT);

  ctx.fillStyle = "white";
  ctx.font = `13px 'Press Start 2P'`;
  ctx.textAlign = "center";
  ctx.fillText("Controls: WASD", gameConstants.CANVAS_WIDTH/6, gameConstants.MISC/2+10);
  const thisPlayer = players.find(player => player.id === localId);
  ctx.fillText(thisPlayer.calculateRank(players),
    gameConstants.CANVAS_WIDTH/6*5, 35);

  ctx.font = `16px 'Press Start 2P'`
  ctx.fillText("Coin Race", gameConstants.CANVAS_WIDTH/2, gameConstants.MISC/2+10);

  let keepforlast;
  players.forEach(player => {
    player.move();
    if (player.id !== localId){
      ctx.drawImage(otherPlayerImg, player.x, player.y);
    } else {
      keepforlast = player;
      if (player.collision(currCoin)){
        socket.emit("tookCoin");
      }
    }
    if (keepforlast) ctx.drawImage(mainPlayerImg, keepforlast.x, keepforlast.y);
  });

  ctx.drawImage(silverCoinImg, currCoin.x, currCoin.y);
  gameFrame++;

  requestAnimationFrame(animate);
}
