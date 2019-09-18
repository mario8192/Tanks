import Fire from "./fire.js";

export default class AITank {
  constructor(game, x, y) {
    this.game = game;

    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;

    this.width = 30;
    this.height = 30;

    this.maxSpeed = 1;
    this.velX = 0;
    this.velY = 0;

    this.axis = "+Y";

    this.life = 1;

    this.position = {
      // x: game.gameWidth / 2 - this.width / 2,
      // y: game.gameHeight / 2 + 200
      x: x,
      y: y
    };

    this.terrain = game.terrain;
    this.fires = [];

    this.routine = [];

    this.noUpdate = 0;
  }

  moveLeft() {
    // if (!this.velY && this.velX !== 1) {
    //   this.velX = -1;
    //   this.axis = "-X";
    // }

    this.velX = -1;
    this.velY = 0;
    this.axis = "-X";
  }

  moveRight() {
    // if (!this.velY && this.velX !== -1) {
    //   this.velX = 1;
    //   this.axis = "+X";
    // }
    this.velX = 1;
    this.velY = 0;
    this.axis = "+X";
  }

  moveUp() {
    // if (!this.velX && this.velY !== 1) {
    //   this.velY = -1;
    //   this.axis = "-Y";
    // }
    this.velX = 0;
    this.velY = -1;
    this.axis = "-Y";
  }

  moveDown() {
    // if (!this.velX && this.velY !== -1) {
    //   this.velY = 1;
    //   this.axis = "+Y";
    // }
    this.velX = 0;
    this.velY = 1;
    this.axis = "+Y";
  }

  moving() {
    if (this.velX === 0 && this.velY === 0) return 0;

    return 1;
  }

  shoot() {
    this.fires.push(new Fire(this));
  }

  stop() {
    //console.log("stopped");
    this.velX = 0;
    this.velY = 0;
  }

  setRoutine(adt, routine) {
    this.routine = routine;
    this.routineTank(adt);
  }

  routineTank(adt) {
    let currentTask = 0;
    let aitank = this;
    let game = this.game;
    setInterval(function() {
      //console.log(this);

      if (
        game.gamestate === 0 ||
        game.gamestate === 2 ||
        game.gamestate === 3 ||
        game.gamestate === 5
      )
        return;

      if (currentTask >= aitank.routine.length) currentTask = 0;

      if (aitank.routine[currentTask] == "U") {
        aitank.moveUp();
        //console.log("U");
      }
      if (aitank.routine[currentTask] == "D") {
        aitank.moveDown();
        //console.log("D");
      }
      if (aitank.routine[currentTask] == "L") {
        aitank.moveLeft();
        //console.log("L");
      }
      if (aitank.routine[currentTask] == "R") {
        aitank.moveRight();
        //console.log("R");
      }
      if (aitank.routine[currentTask] == "-") {
        aitank.stop();
        //console.log("-");
      }
      if (aitank.routine[currentTask] == "1") {
        aitank.shoot();
        //console.log("1");
      }

      currentTask += 1;
    }, adt);

    // setInterval(function() {
    //   console.log(this);
    //   this.moveDown().bind(this);
    //   setInterval(function() {
    //     this.stop();
    //     setInterval(function() {
    //       this.shoot();
    //       setInterval(function() {
    //         setInterval(function() {
    //           setInterval(function() {}, 1000);
    //         }, aiTime);
    //       }, aiTime);
    //     }, aiTime);
    //   }, aiTime);
    // }, aiTime);
    //setTimeout(this.moveDown(), 500);
    //this.moveLeft();
    //setTimeout(this.stop, 1000);
    //this.stop();
    //this.shoot();
    //setTimeout(this.moveDown(), 1000);
    //setTimeout(this.stop(), 2000);
    //setTimeout(this.shoot(), 2500);
    //setTimeout(this.stop(), 1000);
  }

  lifeEnd() {
    this.life = 0;
  }

  drawMuzzle(ctx) {
    ctx.fillStyle = "#000";
    if (this.axis === "+X")
      ctx.fillRect(
        this.position.x + this.width / 2,
        this.position.y + this.height / 2 - 2,
        this.width / 2 + 3,
        5
      );
    if (this.axis === "-X")
      ctx.fillRect(
        this.position.x - 3,
        this.position.y + this.height / 2 - 2,
        this.width / 2 + 3,
        5
      );
    if (this.axis === "+Y")
      ctx.fillRect(
        this.position.x + this.width / 2 - 2,
        this.position.y + this.height / 2,
        5,
        this.width / 2 + 3
      );
    if (this.axis === "-Y")
      ctx.fillRect(
        this.position.x + this.width / 2 - 2,
        this.position.y - 3,
        5,
        this.width / 2 + 3
      );
  }

  draw(ctx) {
    if (this.life) {
      ctx.fillStyle = "#adadad";
      ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
      this.drawMuzzle(ctx);
      if (this.fires !== undefined)
        this.fires.forEach(fire => {
          fire.draw(ctx);
        });
    }
  }

  updatePosition() {
    if (this.noUpdate) {
      this.noUpdate = 0;
    } else {
      this.position.x += this.velX * this.maxSpeed;
      this.position.y += this.velY * this.maxSpeed;
    }
  }

  update(deltaTime) {
    //console.log("noupdate is ", this.noUpdate);
    // if (this.noUpdate) {
    //   this.noUpdate = 0;
    // } else {
    //   this.position.x += this.velX * this.maxSpeed;
    //   this.position.y += this.velY * this.maxSpeed;
    // }

    if (this.position.x < 0) this.position.x = 0;
    if (this.position.y < 0) this.position.y = 0;
    if (this.position.x + this.width > this.gameWidth)
      this.position.x = this.gameWidth - this.width;
    if (this.position.y + this.height > this.gameHeight)
      this.position.y = this.gameHeight - this.height;

    // if (this.wall !== undefined && detectCollision(this, this.wall) === true) {
    //   this.position.x -= this.velX * 5;
    //   this.position.y -= this.velY * 5;
    // }

    if (this.fires !== undefined)
      this.fires.forEach(fire => {
        fire.update(deltaTime);
      });
    this.fires.forEach(fire => {
      if (fire.life === 0) {
        this.fires.splice(this.fires.indexOf(fire), 1);
      }
    });

    //console.log("wall is ", this.wall);
  }
}
