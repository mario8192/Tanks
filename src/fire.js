export default class Fire {
  constructor(tank) {
    this.screenX = tank.game.gameWidth;
    this.screenY = tank.game.gameHeight;

    this.position = {
      x: tank.position.x + tank.width / 2 - 2,
      y: tank.position.y + tank.height / 2 - 2
    };

    this.width = 5;
    this.height = 5;

    this.life = 1;

    this.vel = 2;
    this.axis = tank.axis;
  }

  draw(ctx) {
    if (!this.life) return;
    ctx.fillStyle = "#ddd";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update(deltatime) {
    if (!this.life) return;
    if (this.axis === "+X") this.position.x += this.vel * 5;
    if (this.axis === "-X") this.position.x -= this.vel * 5;
    if (this.axis === "+Y") this.position.y += this.vel * 5;
    if (this.axis === "-Y") this.position.y -= this.vel * 5;

    //clear fire from mem if it goes offscreen
    this.clearFromMem();
  }

  clearFromMem() {
    if (
      this.position.x < 0 ||
      this.position.y < 0 ||
      this.position.x > this.screenX ||
      this.position.y > this.screenY
    )
      this.lifeEnd();
  }

  lifeEnd() {
    this.life = 0;
  }
}
