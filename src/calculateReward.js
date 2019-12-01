export function calculateReward(bot) {
  ////   TO BE TREATED AS BLACK BOX  ---v
  //calculating reward

  //initial reward 0 if survived
  let reward = 0;

  //aitank towards tank --> reward = 1
  if (
    bot.oldxOffset - bot.xOffsetFromTank < 0 &&
    bot.oldyOffset - bot.yOffsetFromTank < 0
  ) {
    // console.log(
    //   [bot.oldxOffset, bot.xOffsetFromTank],
    //   [bot.oldyOffset, bot.yOffsetFromTank]
    // );
    reward = -0.5;
  }
  if (
    bot.oldxOffset - bot.xOffsetFromTank > 0 ||
    bot.oldyOffset - bot.yOffsetFromTank > 0
  ) {
    // console.log(
    //   [bot.oldxOffset, bot.xOffsetFromTank],
    //   [bot.oldyOffset, bot.yOffsetFromTank]
    // );
    reward = 0.75;
    //return reward;
  }

  // aitank drive into wall --> reward = -1
  if (bot.noUpdate) {
    reward = -1;
  }

  //fire + aitank  -->  reward = -1
  bot.game.tank.fires.forEach(fire => {
    //console.log(fire.position, bot.position);

    if (fire.axis === "+Y" || fire.axis === "-Y")
      if (
        bot.position.x <= fire.position.x &&
        fire.position.x <= bot.position.x + bot.width
      ) {
        if (
          (fire.axis === "+Y" &&
            fire.position.y <= bot.position.y + bot.height) ||
          (fire.axis === "-Y" && fire.position.y >= bot.position.y)
        ) {
          reward = -1;
          //return reward;
        }
      }

    if (fire.axis === "+X" || fire.axis === "-X")
      if (
        bot.position.y <= fire.position.y &&
        fire.position.y <= bot.position.y + bot.height
      ) {
        if (
          (fire.axis === "+X" &&
            fire.position.x <= bot.position.x + bot.width) ||
          (fire.axis === "-X" && fire.position.x >= bot.position.x)
        ) {
          reward = -1;
          //return reward;
        }
      }
  });

  //aifire + tank  -->  reward = 1
  bot.fires.forEach(fire => {
    if (fire.axis === "+Y" || fire.axis === "-Y")
      if (
        bot.game.tank.position.x <= fire.position.x &&
        fire.position.x <= bot.game.tank.position.x + bot.game.tank.width
      )
        if (
          (fire.axis === "+Y" &&
            fire.position.y <=
              bot.game.tank.position.y + bot.game.tank.height) ||
          (fire.axis === "-Y" && fire.position.y >= bot.game.tank.position.y)
        ) {
          reward = 1;
          //return reward;
        }

    if (fire.axis === "+X" || fire.axis === "-X")
      if (
        bot.game.tank.position.y <= fire.position.y &&
        fire.position.y <= bot.game.tank.position.y + bot.game.tank.height
      )
        if (
          (fire.axis === "+X" &&
            fire.position.x <=
              bot.game.tank.position.x + bot.game.tank.height) ||
          (fire.axis === "-X" && fire.position.x >= bot.game.tank.position.x)
        ) {
          reward = 1;
          //return reward;
        }
  });

  //aifire + aitank  -->  reward = 1
  bot.fires.forEach(fire => {
    bot.game.ai.tanks.forEach(aitank2 => {
      if (aitank2 !== bot) {
        if (fire.axis === "+Y" || fire.axis === "-Y")
          if (
            aitank2.position.x <= fire.position.x &&
            fire.position.x <= aitank2.position.x + aitank2.width
          )
            if (
              (fire.axis === "+Y" &&
                fire.position.y <= aitank2.position.y + aitank2.height) ||
              (fire.axis === "-Y" && fire.position.y >= aitank2.position.y)
            ) {
              reward = 1;
              //return reward;
            }

        if (fire.axis === "+X" || fire.axis === "-X")
          if (
            aitank2.position.y <= fire.position.y &&
            fire.position.y <= aitank2.position.y + aitank2.height
          )
            if (
              (fire.axis === "+X" &&
                fire.position.x <= aitank2.position.x + aitank2.width) ||
              (fire.axis === "-X" && fire.position.x >= aitank2.position.x)
            ) {
              reward = 1;
              //return reward;
            }
      }
    });
  });

  return reward;
} ////  ^--------- TO BE TREATED AS BLACK BOX
