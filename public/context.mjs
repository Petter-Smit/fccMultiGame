const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;
const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 30;
const MISC = 50;
const collSize = 13;

const gameConstants = {
    CANVAS_WIDTH: CANVAS_WIDTH,
    CANVAS_HEIGHT: CANVAS_HEIGHT,
    MISC: MISC,
    field_min_X: 0,
    field_max_X: CANVAS_WIDTH - PLAYER_WIDTH,
    field_min_Y: 0,
    field_max_Y: CANVAS_HEIGHT - PLAYER_HEIGHT,
    PLAYER_WIDTH: PLAYER_WIDTH,
    PLAYER_HEIGHT: PLAYER_HEIGHT,
    COIN_HEIGHT: collSize,
    COIN_WIDTH: collSize,
};

export {gameConstants};