import { gameConstants } from "./context.mjs";

class Player {
  constructor({x, y, score, id}) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.score = score;
    this.width = gameConstants.PLAYER_WIDTH;
    this.height = gameConstants.PLAYER_HEIGHT;
    this.speed = 5;
    this.movement = [0, 0, 0, 0]; // Up, Left, Down, Right
  }

  movePlayer(dir, speed = this.speed) {
    switch(dir){
      case 'left':
        this.x = Math.max(this.x-speed, 0);
      case 'right':
        this.x = Math.min(this.x+speed, 640);
      case 'down':
        this.y = Math.min(this.y-speed, 0);
      case 'up':
        this.y = Math.min(this.y+speed, 480);
    }
  }

  move() {
    this.x = Math.max(Math.min(this.x + this.speed*this.movement[3] 
      - this.speed*this.movement[1], gameConstants.field_max_X), 0);
    this.y = Math.max(Math.min(this.y + this.speed*this.movement[2] 
      - this.speed*this.movement[0], gameConstants.field_max_Y), 0);
  }

  collision(item) {
   if (
    item.x > this.x + this.width ||
    item.x + 1 + gameConstants.COIN_WIDTH < this.x ||
    item.y + 1 + gameConstants.COIN_HEIGHT < this.y ||
    item.y > this.y + this.height
    ) {return false} else {return true}
  }

  calculateRank(arr) {
    // Rank: currentRanking/totalPlayers
    let myRank = 1;
    arr.forEach(el => {
      if (el.score > this.score){
        myRank++;
      }
    });
    return `Rank: ${myRank}/${arr.length}`
  }
}

export default Player;
