/* Basic Little Stuffs */
var AntHacker = AntHacker || {
  Colony: {},
  paragraphsCount: 0
};

/* Setup Modes */
AntHacker.states = {
  intro: 0,
  marching: 1,
  finished: 2
};

/* set current state */
AntHacker.currentState = AntHacker.states.intro;

/* GO GO GO */
window.onload = function onload() {
  paper.install(window);

  AntHacker.converter = new Showdown.converter();

  AntHacker.live = new AntHacker.Farm({
    articleEl: '#hemingway',
    canvasEl: '#vanGogh',
    wordMode: false
  });
}