import InputHandler from "./input.js";
import Tank from "./tank.js";
import Terrain from "./terrain.js";
import AI from "./ai.js";
import Collision from "./collision.js";

const GAMESTATE = {
  PAUSED: 0,
  RUNNING: 1,
  MENU: 2,
  GAMEOVER: 3,
  NEWLEVEL: 4,
  WIN: 5
};
let gameScreenDrawn = {
  PAUSED: false,
  MENU: false,
  GAMEOVER: false,
  WIN: false
};

export default class Game {
  constructor(gameWidth, gameHeight, bricksPerRow) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.gamestate = GAMESTATE.MENU;

    this.lives = 3;
    this.livesCounter = "Lives: 3";
    this.blockSize = 40;

    this.terrain = new Terrain(this);
    this.terrain.buildWalls();

    this.ai = new AI(this);
    this.ai.buildOpps();
    this.ai.buildRoutines();
    //console.log("this in game.js is", this);

    this.tank = new Tank(this);

    this.collision = new Collision(this);
    // this.collisionTank = new Collision(this);
    // this.collisionAI = new Collision(this);

    new InputHandler(this.tank, this);
  }

  currentState() {
    let aiStates = [];
    let i = 0;
    this.ai.tanks.forEach(tank => {
      aiStates[i] = tank.state();
      i += 1;
    });

    return [this.tank.state(), ...aiStates];
  }

  start() {
    if (
      this.gamestate !== GAMESTATE.MENU &&
      this.gamestate !== GAMESTATE.GAMEOVER &&
      this.gamestate !== GAMESTATE.NEWLEVEL &&
      this.gamestate !== GAMESTATE.WIN
    )
      return;

    this.lives = 3;
    this.tank.respawn();
    this.terrain.clear();
    this.terrain.buildWalls();
    this.ai.clear();
    this.ai.buildOpps();
    this.execAIroutine(250);
    this.setFireLimit(200);
    this.gamestate = GAMESTATE.RUNNING;
  }

  loseLife() {
    this.lives -= 1;
  }

  setFireLimit(limit) {
    let t = this;
    setInterval(function() {
      if (t.tank.fireReady === 0) t.tank.fireReady = 1;
    }, limit);
  }

  execSteps() {}

  // needs reworking
  execAIroutine(adt) {
    this.ai.routine(adt);
    //setTimeout(this.ai.routine(), 1000);
  }

  update(deltaTime) {
    if (this.lives === 0) {
      this.gamestate = GAMESTATE.GAMEOVER;
      return;
    }

    // if (
    //   this.gamestate === GAMESTATE.PAUSED ||
    //   this.gamestate === GAMESTATE.MENU ||
    //   this.gamestate === GAMESTATE.GAMEOVER ||
    //   this.gamestate === GAMESTATE.WIN
    // )
    //   return;
    if (this.gamestate === GAMESTATE.RUNNING) {
      //collision logic goes here
      this.collision.check();

      //this.collision.update(deltaTime);
      this.tank.update(deltaTime);

      //console.log(this.ai.tanks[2].noUpdate, this.ai.tanks[2].axis);
      this.ai.update(deltaTime);

      gameScreenDrawn = {
        PAUSED: false,
        MENU: false,
        GAMEOVER: false,
        WIN: false
      };
    } else return;

    if (this.ai.tanks.length === 0) {
      this.gamestate = GAMESTATE.WIN;
      return;
    }
  }

  draw(ctx) {
    if (this.gamestate === GAMESTATE.PAUSED) {
      if (!gameScreenDrawn.PAUSED) {
        ctx.rect(0, 0, this.gameWidth, this.gameHeight);
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fill();

        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Paused", this.gameWidth / 2, this.gameHeight / 2);
      }
      gameScreenDrawn.PAUSED = true;
      return;
    }

    if (this.gamestate === GAMESTATE.MENU) {
      if (!gameScreenDrawn.MENU) {
        ctx.rect(0, 0, this.gameWidth, this.gameHeight);
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fill();

        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(
          "Press SPACEBAR To Start",
          this.gameWidth / 2,
          this.gameHeight / 2
        );
      }
      gameScreenDrawn.MENU = true;
      return;
    }
    if (this.gamestate === GAMESTATE.GAMEOVER) {
      if (!gameScreenDrawn.GAMEOVER) {
        ctx.rect(0, 0, this.gameWidth, this.gameHeight);
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fill();

        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", this.gameWidth / 2, this.gameHeight / 2);
      }
      gameScreenDrawn.GAMEOVER = true;
      return;
    }
    if (this.gamestate === GAMESTATE.WIN) {
      if (!gameScreenDrawn.WIN) {
        ctx.rect(0, 0, this.gameWidth, this.gameHeight);
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fill();

        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("YOU WIN", this.gameWidth / 2, this.gameHeight / 2);
      }
      gameScreenDrawn.WIN = true;
      return;
    }

    ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);

    this.tank.draw(ctx);
    this.terrain.draw(ctx);
    this.ai.draw(ctx);
    this.livesCounter = "Lives: " + this.lives;

    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(this.livesCounter, this.gameWidth - 50, 30);
  }

  togglePause() {
    if (this.gamestate == GAMESTATE.RUNNING) {
      this.gamestate = GAMESTATE.PAUSED;
    } else if (this.gamestate == GAMESTATE.PAUSED) {
      this.gamestate = GAMESTATE.RUNNING;
    }
  }

  pauseOnDefocus() {
    if (this.gamestate == GAMESTATE.RUNNING) {
      this.gamestate = GAMESTATE.PAUSED;
    }
  }
}
