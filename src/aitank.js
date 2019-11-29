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

    this.steps = [];

    this.noUpdate = 0;

    //state vars
    //this.state = null;
    this.reward = null;
  }

  state() {
    let x;
    let y;

    let xdiff = this.position.x % this.game.blockSize;
    let ydiff = this.position.y % this.game.blockSize;

    x =
      xdiff < this.game.blockSize / 2
        ? (x = this.position.x - xdiff)
        : (x = this.position.x + this.game.blockSize - xdiff);

    y =
      ydiff < this.game.blockSize / 2
        ? this.position.y - ydiff
        : this.position.y + this.game.blockSize - ydiff;

    return [x, y];
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

  //Step functions

  ////   TO BE TREATED AS BLACK BOX  ---v
  calculateReward() {
    //calculating reward

    //initial reward 0 if survived
    this.reward = 0;

    //fire + aitank  -->  reward = -1
    this.game.tank.fires.forEach(fire => {
      if (
        this.position.x <= fire.position.x &&
        fire.position.x <= this.position.x + this.width
      ) {
        if (
          (fire.axis === "+Y" && fire.position.y <= this.position.y) ||
          (fire.axis === "-Y" &&
            fire.position.y >= this.position.y + this.height)
        ) {
          this.reward = -1;
          return;
        }
      }

      if (
        this.position.y <= fire.position.y &&
        fire.position.y <= this.position.y + this.height
      ) {
        if (
          (fire.axis === "+X" && fire.position.x <= this.position.x) ||
          (fire.axis === "-X" &&
            fire.position.x >= this.position.x + this.width)
        ) {
          this.reward = -1;
          return;
        }
      }
    });

    //aifire + tank  -->  reward = 1

    this.fires.forEach(fire => {
      if (
        this.game.tank.position.x <= fire.position.x &&
        fire.position.x <= this.game.tank.position.x + this.game.tank.width
      )
        if (
          (fire.axis === "+Y" &&
            fire.position.y <= this.game.tank.position.y) ||
          (fire.axis === "-Y" &&
            fire.position.y >=
              this.game.tank.position.y + this.game.tank.height)
        ) {
          this.reward = 1;
          return;
        }

      if (
        this.game.tank.position.y <= fire.position.y &&
        fire.position.y <= this.game.tank.position.y + this.game.tank.height
      )
        if (
          (fire.axis === "+X" &&
            fire.position.x <= this.game.tank.position.x) ||
          (fire.axis === "-X" &&
            fire.position.x >=
              this.game.tank.position.x + this.game.tank.height)
        ) {
          this.reward = 1;
          return;
        }
    });

    //aifire + aitank  -->  reward = 1
    this.fires.forEach(fire => {
      this.game.ai.tanks.forEach(aitank2 => {
        if (aitank2 !== this) {
          if (
            aitank2.position.x <= fire.position.x &&
            fire.position.x <= aitank2.position.x + aitank2.width
          )
            if (
              (fire.axis === "+Y" && fire.position.y <= aitank2.position.y) ||
              (fire.axis === "-Y" &&
                fire.position.y >= aitank2.position.y + aitank2.height)
            ) {
              this.reward = 1;
              return;
            }

          if (
            aitank2.position.y <= fire.position.y &&
            fire.position.y <= aitank2.position.y + aitank2.height
          )
            if (
              (fire.axis === "+X" && fire.position.x <= aitank2.position.x) ||
              (fire.axis === "-X" &&
                fire.position.x >= aitank2.position.x + aitank2.width)
            ) {
              this.reward = 1;
              return;
            }
        }
      });
    });
  } ////  ^--------- TO BE TREATED AS BLACK BOX

  step(action) {
    if (action === "paused") {
      return;
    }
    if (action === "U") {
      this.moveUp();
      //console.log("U");
    }
    if (action === "D") {
      this.moveDown();
      //console.log("D");
    }
    if (action === "L") {
      this.moveLeft();
      //console.log("L");
    }
    if (action === "R") {
      this.moveRight();
      //console.log("R");
    }
    if (action === "-") {
      this.stop();
      //console.log("-");
    }
    if (action === "1") {
      this.shoot();
      //console.log("1");
    }

    this.calculateReward();
    console.log([this.reward, this.game.currentState()]);
    //return [this.reward, this.game.currentState()];
  }

  setSteps(adt, steps) {
    this.steps = steps;
    this.callStepFunction(adt);
  }

  callStepFunction(adt) {
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

      if (currentTask >= aitank.steps.length) currentTask = 0;

      if (aitank.steps[currentTask] == "U") {
        //aitank.moveUp();
        //console.log("U");
        aitank.step("U");
      }
      if (aitank.steps[currentTask] == "D") {
        //aitank.moveDown();
        //console.log("D");
        aitank.step("D");
      }
      if (aitank.steps[currentTask] == "L") {
        //aitank.moveLeft();
        //console.log("L");
        aitank.step("L");
      }
      if (aitank.steps[currentTask] == "R") {
        //aitank.moveRight();
        //console.log("R");
        aitank.step("R");
      }
      if (aitank.steps[currentTask] == "-") {
        //aitank.stop();
        //console.log("-");
        aitank.step("-");
      }
      if (aitank.steps[currentTask] == "1") {
        //aitank.shoot();
        //console.log("1");
        aitank.step("1");
      }

      currentTask += 1;
    }, adt);
  }

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
  //}

  lifeEnd() {
    this.life = 0;
  }

  drawMuzzle(ctx) {
    ctx.fillStyle = "#9f9f9f";
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
      ctx.fillStyle = "#eee";
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
      // this.position.x += this.velX * this.maxSpeed;
      // this.position.y += this.velY * this.maxSpeed;

      let count = this.maxSpeed;
      while (count) {
        if (!this.noUpdate) {
          if (this.axis === "+X" || this.axis === "-X")
            this.position.x += this.velX;
          if (this.axis === "+Y" || this.axis === "-Y")
            this.position.y += this.velY;
        }
        this.game.collision.check();
        count -= 1;
      }
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

    this.updatePosition();

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
