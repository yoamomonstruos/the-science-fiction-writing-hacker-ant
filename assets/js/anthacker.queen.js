/* Basic Little Stuffs */
var AntHacker = AntHacker || {
  Colony: {}
};

!function(global) {
  'use strict';

  function Queen(options) {
    var _this = this;
    this.options = options || {};

    this.finishLine = new Point(view.center.x + 230, view.center.y);

    view.onResize = function(event) {
      _this.finishLine = new Point(view.center.x + 230, view.center.y);
    }

    view.onFrame = function(event) {
      var colonySize = _this.monitorTheColony();

      if (colonySize === 1) {
        global.currentState = 2;

        for (var key in global.Colony) {
          var _x = _this.finishLine.x - global.Colony[key].path.position.x,
              _y = _this.finishLine.y - global.Colony[key].path.position.y;

          if (global.paragraphsCount === global.Paragraphs.length - 1) {
            global.live.$controls.addClass('is-active');
            global.Colony[key].write();
            window.scrollBy(0, -document.body.clientHeight);
          }

          global.Colony[key].path.position.x += _x / 30;
          global.Colony[key].path.position.y += _y / 30;
          global.Colony[key].path.rotate(1);
        }
      }
      else {
        for (var key in global.Colony) {
          global.Colony[key].checkBounds().checkCollisions().march();
        }
      }
    }
  }

  Queen.prototype.monitorTheColony = function monitorTheColony() {
    var size = 0,
        key;

    for (key in global.Colony) {
      if (global.Colony.hasOwnProperty(key)) {
        size++
      }
    }

    return size;
  }

  global.Queen = Queen;
}(AntHacker);