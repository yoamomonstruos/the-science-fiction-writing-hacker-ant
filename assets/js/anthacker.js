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


  var $loading = document.querySelector('.loading'),
      $btn = document.querySelector('.loading__btn');

  $btn.addEventListener("click", function(event) {
    event.preventDefault();
    $loading.classList.add("is-hidden");

    setTimeout(function() {
      AntHacker.mode = 1;
    }, 1500);
  });
}