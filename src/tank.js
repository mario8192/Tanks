import Fire from "./fire.js";

export default class Tank {
  constructor(game) {
    this.game = game;

    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;

    this.width = 30;
    this.height = 30;

    this.maxSpeed = 1;
    this.velX = 0;
    this.velY = 0;

    this.axis = "-Y";

    this.defaultPosition = {
      x: game.gameWidth / 2 - this.width / 2,
      y: game.gameHeight / 2 + 100
    };

    this.position = {
      x: 0,
      y: 0
    };

    this.terrain = game.terrain;
    this.fires = [];

    this.fireTimeout = 2000;
    this.fireReady = 1;

    this.noUpdate = 0;
  }

  state() {
    return [this.position.x, this.position.y];
  }

  moveLeft() {
    //if (!this.velY && this.velX !== 1) {
    this.velX = -1;
    this.axis = "-X";
  }

  moveRight() {
    //if (!this.velY && this.velX !== -1) {
    this.velX = 1;
    this.axis = "+X";
  }

  moveUp() {
    //if (!this.velX && this.velY !== 1) {
    this.velY = -1;
    this.axis = "-Y";
  }

  moveDown() {
    //if (!this.velX && this.velY !== -1) {
    this.velY = 1;
    this.axis = "+Y";
  }

  fireCooldown() {
    this.fireReady = 1;
  }

  shoot() {
    if (this.fireReady) this.fires.push(new Fire(this));
    this.fireReady = 0;
  }

  stop() {
    this.velX = 0;
    this.velY = 0;
  }

  stopInX() {
    this.velX = 0;
    if (this.velY === 1) this.axis = "+Y";
    if (this.velY === -1) this.axis = "-Y";
  }

  stopInY() {
    this.velY = 0;
    if (this.velX === 1) this.axis = "+X";
    if (this.velX === -1) this.axis = "-X";
  }

  respawn() {
    this.fires.splice(0, this.fires.length);

    this.position.x = this.defaultPosition.x;
    this.position.y = this.defaultPosition.y;

    this.axis = "-Y";

    setTimeout(console.log("respawned"), 500);
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
    ctx.fillStyle = "#3c6";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    this.drawMuzzle(ctx);
    if (this.fires !== undefined)
      this.fires.forEach(fire => {
        fire.draw(ctx);
      });
  }

  updatePosition() {
    if (this.noUpdate) {
      this.noUpdate = 0;
    } else {
      // this.position.x += this.velX * this.maxSpeed;
      // this.position.y += this.velY * this.maxSpeed;

      if (this.axis === "+X" || this.axis === "-X")
        this.position.x += this.velX;
      if (this.axis === "+Y" || this.axis === "-Y")
        this.position.y += this.velY;
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

    //tank + boundary
    if (this.position.x < 0) this.position.x = 0;
    if (this.position.y < 0) this.position.y = 0;
    if (this.position.x + this.width > this.game.gameWidth)
      this.position.x = this.game.gameWidth - this.width;
    if (this.position.y + this.height > this.game.gameHeight)
      this.position.y = this.game.gameHeight - this.height;

    // if (this.position.x < 0) this.position.x = 0;
    // if (this.position.y < 0) this.position.y = 0;
    // if (this.position.x + this.width > this.gameWidth)
    //   this.position.x = this.gameWidth - this.width;
    // if (this.position.y + this.height > this.gameHeight)
    //   this.position.y = this.gameHeight - this.height;

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
