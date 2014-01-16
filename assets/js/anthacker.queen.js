/* Basic Little Stuffs */
var AntHacker = AntHacker || {
  Colony: {}
};

!function(global) {
  'use strict';

  function Queen(options) {
    this.options = options || {};

    view.onFrame = function(event) {
      for (var key in global.Colony) {
        global.Colony[key].checkBounds().goCannibal().march();
      }
    }
  }

  global.Queen = Queen;
}(AntHacker);