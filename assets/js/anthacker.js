/* Basic Little Stuffs */
var AntHacker = AntHacker || {
  Colony: {}
};


/* GO GO GO */
window.onload = function onload() {
  paper.install(window);

  window.HackAllTheAnts = new AntHacker.Farm({
    canvasId: 'vanGogh'
  });
}