/* Basic Little Stuffs */
var AntHacker = AntHacker || {
  Colony: {}
};


!function(global) {
  'use strict';

  function Farm(options) {
    this.options = options || {};

    /* Define quick handles for the elements we need
     * to access from time to time. */
    this.$article = $(this.options.articleEl);
    this.$canvas = $(this.options.canvasEl)[0];
    this.$controls = $('.controls');
    this.$loading = $('.loading');
    this.btns = {
      $start: $('[data-btn="start"]'),
      $random: $('[data-btn="random"]'),
      $order: $('[data-btn="order"]')
    };

    global.wordMode = this.options.wordMode;
    this.initialize().bindEvents();
  }

  Farm.prototype.initialize = function initialize() {
    paper.setup(this.$canvas);

    this.writer = new global.Writer();
    global.paragraphsCount = 0;

    for ( var _i = 0; _i < global.Paragraphs.length; _i++ ) {
      new global.Ant({ _id: _i });
    }

    this.queen = new global.Queen();
    return this;
  }

  Farm.prototype.reset = function reset() {
    this.$article.empty();
    global.Colony = {};
    delete global.queen;
    delete global.writer;
    project.remove();
    return this;
  }

  Farm.prototype.bindEvents = function bindEvents() {
    var _this = this;

    this.btns.$start.bind('click', function(event) {
      event.preventDefault();
      _this.$loading.addClass('is-hidden');

      setTimeout(function() {
        global.currentState = AntHacker.states.marching;
      }, 1500);
    });

    this.btns.$order.bind('click', function(event) {
      event.preventDefault();
      global.live.reset().initialize();

      setTimeout(function() {
        global.wordMode = true;
        global.currentState = AntHacker.states.marching;
      }, 1500);
    });

    this.btns.$random.bind('click', function(event) {
      event.preventDefault();
      global.live.reset().initialize();

      setTimeout(function() {
        global.wordMode = false;
        global.currentState = AntHacker.states.marching;
      }, 1500);
    });

    return this;
  }

  global.Farm = Farm;
}(AntHacker);