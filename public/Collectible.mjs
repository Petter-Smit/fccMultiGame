import { gameConstants } from "./context.mjs";
class Collectible {
  constructor({ x, y, width = 13, height = 13, value = 1, id = 1 }) {
    this.x = x;
    this.y = y;
    this.width = gameConstants.COIN_WIDTH;
    this.height = gameConstants.COIN_HEIGHT;
    this.value = value;
    this.id = id;
  }
}

try {
  module.exports = Collectible;
} catch (e) {}

export default Collectible;
