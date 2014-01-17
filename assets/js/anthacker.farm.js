/* Basic Little Stuffs */
var AntHacker = AntHacker || {
  Colony: {}
};


!function(global) {
  'use strict';

  function Farm(options) {
    this.options = options || {};
    this.$canvas = document.getElementById(this.options.canvasId);
    this.initialize();
  }

  Farm.prototype.initialize = function initialize() {
    paper.setup(this.$canvas);

    for ( var _i = 0; _i < 60; _i++ ) {
      new global.Ant({ _id: _i });
    }

    var Queen = new global.Queen();
    return this;
  }

  global.Farm = Farm;
}(AntHacker);