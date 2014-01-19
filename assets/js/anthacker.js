/* Basic Little Stuffs */
var AntHacker = AntHacker || {
  Colony: {}
};


/* GO GO GO */
window.onload = function onload() {
  paper.install(window);

  AntHacker.converter = new Showdown.converter();

  window.HackAllTheAnts = new AntHacker.Farm({
    canvasId: 'vanGogh'
  });

  var btn = document.querySelector('.loading__btn');
  btn.addEventListener("click", function() {
    AntHacker.mode = 1;
  });
}