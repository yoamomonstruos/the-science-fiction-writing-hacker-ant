/* Basic Little Stuffs */
var AntHacker = AntHacker || {
  Colony: {}
};


!function(global) {
  'use strict';

  function Farm(options) {
    this.options = options || {};
    this.$canvas = document.getElementById(this.options.canvasId);
    global.wordMode = this.options.wordMode;
    this.initialize();
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

  global.Farm = Farm;
}(AntHacker);