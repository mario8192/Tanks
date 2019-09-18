import { detectCollision } from "./collisionDetection.js";

export default class Collision {
  constructor(game) {
    this.game = game;
    this.tank = game.tank;
    this.ai = game.ai;
    this.terrain = game.terrain;
  }

  axisOfCollision(tank, wall) {
    let wallTop = wall.position.y;
    let wallLeft = wall.position.x;
    let wallRight = wall.position.x + wall.width;
    let wallBottom = wall.position.y + wall.height;

    //console.log(obj2);

    let tankTop = tank.position.y;
    let tankLeft = tank.position.x;
    let tankRight = tank.position.x + tank.width;
    let tankBottom = tank.position.y + tank.height;

    if (tankTop === wallBottom) {
      if (tank.velY === -1) {
        if (
          (tankRight <= wallRight && tankLeft >= wallLeft) ||
          (tankLeft < wallLeft && tankRight > wallLeft) ||
          (tankRight > wallRight && tankLeft < wallRight)
        )
          return 1;
      } //else return 0;
    }
    if (tankRight === wallLeft) {
      if (tank.velX === 1) {
        if (
          (tankBottom <= wallBottom && tankTop >= wallTop) ||
          (tankTop < wallTop && tankBottom > wallTop) ||
          (tankBottom > wallBottom && tankTop < wallBottom)
        )
          return 2;
      } //else return 0;
    }
    if (tankBottom === wallTop) {
      if (tank.velY === 1) {
        if (
          (tankRight <= wallRight && tankLeft >= wallLeft) ||
          (tankLeft < wallLeft && tankRight > wallLeft) ||
          (tankRight > wallRight && tankLeft < wallRight)
        )
          return 3;
      } // else return 0;
    }
    if (tankLeft === wallRight) {
      if (tank.velX === -1) {
        if (
          (tankBottom <= wallBottom && tankTop >= wallTop) ||
          (tankTop < wallTop && tankBottom > wallTop) ||
          (tankBottom > wallBottom && tankTop < wallBottom)
        )
          return 4;
      } //else return 0;
    }
    return 0;
  }

  check(deltaTime) {
    if (this.game.gamestate === 1) this.update(deltaTime);
    else return;
  }

  update(deltaTime) {
    // if (detectCollision(this.terrain.walls[0], this.terrain.walls[2]))
    //   console.log("trueeeeee");
    // else console.log("falseeeee");

    // //tank + boundary
    // if (this.tank.position.x < 0) this.tank.position.x = 0;
    // if (this.tank.position.y < 0) this.tank.position.y = 0;
    // if (this.tank.position.x + this.tank.width > this.game.gameWidth)
    //   this.tank.position.x = this.game.gameWidth - this.tank.width;
    // if (this.tank.position.y + this.tank.height > this.game.gameHeight)
    //   this.tank.position.y = this.game.gameHeight - this.tank.height;

    //aitank + boundary
    this.ai.tanks.forEach(aitank => {
      if (aitank.position.x < 0) aitank.position.x = 0;
      if (aitank.position.y < 0) aitank.position.y = 0;
      if (aitank.position.x + aitank.width > this.game.gameWidth)
        aitank.position.x = this.game.gameWidth - aitank.width;
      if (aitank.position.y + aitank.height > this.game.gameHeight)
        aitank.position.y = this.game.gameHeight - aitank.height;
    });

    //tank + aitank
    if (this.ai.tanks !== undefined) {
      this.ai.tanks.forEach(aitank => {
        if (detectCollision(this.tank, aitank)) {
          // this.tank.position.x -= this.tank.velX * 5;
          // this.tank.position.y -= this.tank.velY * 5;

          // aitank.position.x -= aitank.velX * 5;
          // aitank.position.y -= aitank.velY * 5;

          //aitank.stop();
          let axis = this.axisOfCollision(aitank, this.tank);
          //if (axis === 0) console.log(axis);

          if (
            (axis === 1 && aitank.velY === -1) ||
            (axis === 2 && aitank.velX === 1) ||
            (axis === 3 && aitank.velY === 1) ||
            (axis === 4 && aitank.velX === -1)
          ) {
            this.tank.noUpdate = 1;
            aitank.noUpdate = 1;
            //return true;
          }
        }
      });
    }

    //tank + wall

    // if (this.walls.walls !== undefined) {
    //   this.walls.walls.forEach(wall => {
    //     if (detectCollision(this.tank, wall)) {
    //       // this.tank.position.x -= this.tank.velX * 1;
    //       // this.tank.position.y -= this.tank.velY * 1;
    //       this.tank.stop();
    //     }
    //   });
    // }

    if (this.terrain.walls !== undefined) {
      this.terrain.walls.forEach(wall => {
        if (detectCollision(this.tank, wall)) {
          let axis = this.axisOfCollision(this.tank, wall);
          //if (axis === 0) console.log(axis);
          if (
            (axis === 1 && this.tank.velY === -1) ||
            (axis === 2 && this.tank.velX === 1) ||
            (axis === 3 && this.tank.velY === 1) ||
            (axis === 4 && this.tank.velX === -1)
          ) {
            this.tank.noUpdate = 1;
            //return true;
          }
        }
      });
    }

    //fire + wall
    if (this.terrain.walls !== undefined && this.tank.fires.length !== 0) {
      this.terrain.walls.forEach(wall => {
        this.tank.fires.forEach(fire => {
          if (detectCollision(fire, wall)) {
            //console.log("wall hit");
            fire.lifeEnd();
            wall.reduce(fire.axis);
          }
        });
      });
      this.terrain.removeEmpty();
    }

    //fire + aitank
    if (this.ai.tanks !== undefined && this.tank.fires.length !== 0) {
      this.ai.tanks.forEach(tank => {
        this.tank.fires.forEach(fire => {
          if (detectCollision(fire, tank)) {
            //console.log("opp hit");
            fire.lifeEnd();
            tank.lifeEnd();
          }
        });
      });
      this.ai.removeEmpty();
    }

    //aitank + wall
    // if (this.terrain.walls !== undefined) {
    //   this.terrain.walls.forEach(wall => {
    //     this.ai.tanks.forEach(aitank => {
    //       if (detectCollision(aitank, wall)) {
    //         aitank.position.x -= aitank.velX * 5;
    //         aitank.position.y -= aitank.velY * 5;
    //       }
    //     });
    //   });
    // }

    if (this.ai.tanks !== undefined) {
      this.ai.tanks.forEach(aitank => {
        if (this.terrain.walls !== undefined) {
          this.terrain.walls.forEach(wall => {
            if (detectCollision(aitank, wall)) {
              let axis = this.axisOfCollision(aitank, wall);
              //console.log(axis);
              if (
                (axis === 1 && aitank.axis === "-Y") ||
                (axis === 2 && aitank.axis === "+X") ||
                (axis === 3 && aitank.axis === "+Y") ||
                (axis === 4 && aitank.axis === "-X")
              ) {
                //if (axis === 0) console.log(axis);

                //aitank.stop();

                // if (
                //   (axis === 1 && aitank.velY === -1) ||
                //   (axis === 2 && aitank.velX === 1) ||
                //   (axis === 3 && aitank.velY === 1) ||
                //   (axis === 4 && aitank.velX === -1)
                // ) {
                aitank.noUpdate = 1;
                //console.log(aitank.noUpdate);
                //return true;
              }
            }
          });
        }
      });
    }

    //aifire + wall
    if (this.terrain.walls !== undefined) {
      this.terrain.walls.forEach(wall => {
        this.ai.tanks.forEach(aitank => {
          aitank.fires.forEach(fire => {
            if (detectCollision(fire, wall)) {
              //console.log("wall hit");
              fire.lifeEnd();
              wall.reduce(fire.axis);
            }
          });
        });
      });
      this.terrain.removeEmpty();
    }

    //aifire + tank
    this.ai.tanks.forEach(aitank => {
      aitank.fires.forEach(fire => {
        if (detectCollision(fire, this.tank)) {
          console.log("life -1");
          this.game.loseLife();
          this.tank.respawn();
        }
      });
    });

    this.game.tank.updatePosition();
    this.game.ai.tanks.forEach(aitank => aitank.updatePosition());
    //console.log(this.ai.tanks[2].noUpdate, this.ai.tanks[2].axis);
  }
}
