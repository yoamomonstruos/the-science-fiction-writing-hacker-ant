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
    canvasId: 'vanGogh',
    wordMode: false
  });


  var $loading = document.querySelector('.loading'),
      $btn = document.querySelector('.loading__btn')
      $ordered = document.querySelector('.ordered')
      $article = document.querySelector('article');

  $btn.addEventListener("click", function(event) {
    event.preventDefault();
    $loading.classList.add("is-hidden");

    setTimeout(function() {
      AntHacker.currentState = AntHacker.states.marching;
    }, 1500);
  });

  $ordered.addEventListener("click", function(event) {
    event.preventDefault();
    AntHacker.Colony = {};
    project.clear();
    delete AntHacker.queen;
    delete AntHacker.writer;
    AntHacker.live.initialize();
  });
}