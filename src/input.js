export default class InputHandler {
  constructor(tank, game) {
    document.addEventListener("keydown", event => {
      switch (event.keyCode) {
        case 65:
          if (game.gamestate === 0) return;
          tank.moveLeft();
          break;

        case 87:
          if (game.gamestate === 0) return;
          tank.moveUp();
          break;

        case 68:
          if (game.gamestate === 0) return;
          tank.moveRight();
          break;

        case 83:
          if (game.gamestate === 0) return;
          tank.moveDown();
          break;

        case 16:
          if (game.gamestate === 0) return;
          tank.shoot();
          break;

        case 27:
          game.togglePause();
          break;

        case 32:
          game.start();
          break;
      }
    });
    document.addEventListener("keyup", event => {
      switch (event.keyCode) {
        case 65:
          tank.stop();
          break;

        case 87:
          tank.stop();
          break;

        case 68:
          tank.stop();
          break;

        case 83:
          tank.stop();
          break;
      }
    });
    window.addEventListener("blur", event => {
      game.togglePause();
    });
  }
}
