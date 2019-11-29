////   TO BE TREATED AS BLACK BOX  ---v
export function calculateReward(bot) {
  //calculating reward

  //initial reward 0 if survived
  let reward = 0;

  //fire + aitank  -->  reward = -1
  bot.game.tank.fires.forEach(fire => {
    if (
      bot.position.x <= fire.position.x &&
      fire.position.x <= bot.position.x + bot.width
    ) {
      if (
        (fire.axis === "+Y" && fire.position.y <= bot.position.y) ||
        (fire.axis === "-Y" && fire.position.y >= bot.position.y + bot.height)
      ) {
        reward = -1;
      }
    }

    if (
      bot.position.y <= fire.position.y &&
      fire.position.y <= bot.position.y + bot.height
    ) {
      if (
        (fire.axis === "+X" && fire.position.x <= bot.position.x) ||
        (fire.axis === "-X" && fire.position.x >= bot.position.x + bot.width)
      ) {
        reward = -1;
      }
    }
  });

  //aifire + tank  -->  reward = 1

  bot.fires.forEach(fire => {
    if (
      bot.game.tank.position.x <= fire.position.x &&
      fire.position.x <= bot.game.tank.position.x + bot.game.tank.width
    )
      if (
        (fire.axis === "+Y" && fire.position.y <= bot.game.tank.position.y) ||
        (fire.axis === "-Y" &&
          fire.position.y >= bot.game.tank.position.y + bot.game.tank.height)
      ) {
        reward = 1;
      }

    if (
      bot.game.tank.position.y <= fire.position.y &&
      fire.position.y <= bot.game.tank.position.y + bot.game.tank.height
    )
      if (
        (fire.axis === "+X" && fire.position.x <= bot.game.tank.position.x) ||
        (fire.axis === "-X" &&
          fire.position.x >= bot.game.tank.position.x + bot.game.tank.height)
      ) {
        reward = 1;
      }
  });

  //aifire + aitank  -->  reward = 1
  bot.fires.forEach(fire => {
    bot.game.ai.tanks.forEach(aitank2 => {
      if (aitank2 !== bot) {
        if (
          aitank2.position.x <= fire.position.x &&
          fire.position.x <= aitank2.position.x + aitank2.width
        )
          if (
            (fire.axis === "+Y" && fire.position.y <= aitank2.position.y) ||
            (fire.axis === "-Y" &&
              fire.position.y >= aitank2.position.y + aitank2.height)
          ) {
            reward = 1;
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
            reward = 1;
          }
      }
    });
  });

  return reward;
} ////  ^--------- TO BE TREATED AS BLACK BOX
