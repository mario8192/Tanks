export function initConsole(ai) {
  $(document.getElementById("console")).empty();

  $(document.getElementById("console")).append('<p id ="line-def" />');

  let i = 1;
  ai.tanks.forEach(tank => {
    $(document.getElementById("console")).append(() => {
      return '<p id ="line-' + i + '" />';
    });
    i += 1;
  });
}

export function updateConsole(bot, array) {
  let i = 0;
  let id = "line-def";
  let ref = document.getElementById(id);

  ref.innerHTML =
    "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0" +
    array[i];
  i += 1;
  id = "line-" + i;
  ref = document.getElementById(id);

  bot.game.ai.tanks.forEach(elem => {
    ref.innerHTML =
      elem.index +
      "\u00A0 ---- \u00A0" +
      elem.reward +
      "\u00A0\u00A0\u00A0" +
      array[i];
    if (elem.reward === 0) ref.style.color = "white";
    if (elem.reward === 1) ref.style.color = "#0f0";
    if (elem.reward === -1) ref.style.color = "red";
    if (elem.reward === 0.75) ref.style.color = "cyan";
    if (elem.reward === -0.5) ref.style.color = "yellow";
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
