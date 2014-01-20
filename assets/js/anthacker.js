/* Basic Little Stuffs */
var AntHacker = AntHacker || {
  Colony: {},
  paragraphsCount: 0
};

/* Setup Modes */
AntHacker.states = {
  intro: 0,
  anarchy: 1,
  concensus: 2,
  finished: 3
};

/* set current state */
AntHacker.currentState = AntHacker.states.intro;


/* GO GO GO */
window.onload = function onload() {
  paper.install(window);

  AntHacker.converter = new Showdown.converter();

  window.HackAllTheAnts = new AntHacker.Farm({
    canvasId: 'vanGogh'
  });


  var $loading = document.querySelector('.loading'),
      $btn = document.querySelector('.loading__btn');

  $btn.addEventListener("click", function(event) {
    event.preventDefault();
    $loading.classList.add("is-hidden");

    setTimeout(function() {
      AntHacker.currentState = AntHacker.states.anarchy;
    }, 1500);
  });
}