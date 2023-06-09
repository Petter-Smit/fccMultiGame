const controls = (player, socket) => {
    const getKey = (e) => {
        if (e.code === "KeyW" || e.code === "ArrowUp") return 1
        if (e.code === "KeyA" || e.code === "ArrowLeft") return 2
        if (e.code === "KeyS" || e.code === "ArrowDown") return 3
        if (e.code === "KeyD" || e.code === "ArrowRight") return 4
    };

    document.onkeydown = (e) => {
        const dir = getKey(e);
        if (dir) {
            player.movement[dir-1] = 1;
            socket.emit("moveStart", {dir: dir-1, x: player.x, y: player.y});
        };
    };

    document.onkeyup = (e) => {
        const dir = getKey(e);
        if (dir) {
            player.movement[dir-1] = 0;
            socket.emit("moveEnd", {dir: dir-1, x: player.x, y: player.y});
        };
    };
};

export default controls;