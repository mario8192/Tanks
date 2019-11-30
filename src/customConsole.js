export function initConsole(ai) {
  $(document.getElementById("console")).empty();
  let i = 1;
  ai.tanks.forEach(tank => {
    $(document.getElementById("console")).append(() => {
      return '<p id ="line-' + i + '" />';
    });
    i += 1;
  });
}

export function updateConsole(bot, array) {
  let i = 1;
  let id = "line-" + i;
  let ref = document.getElementById(id);
  bot.game.ai.tanks.forEach(elem => {
    ref.innerHTML = elem.reward + "   " + array[i];
    if (elem.reward === 0) ref.style.color = "white";
    if (elem.reward === 1) ref.style.color = "cyan";
    if (elem.reward === -1) ref.style.color = "red";
    i += 1;
    id = "line-" + i;
    ref = document.getElementById(id);
  });
  while (ref) {
    $("#" + id).remove();
    id = "line-" + i;
    ref = document.getElementById(id);
  }
}
