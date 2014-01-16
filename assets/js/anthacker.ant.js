/* Basic Little Stuffs */
var AntHacker = AntHacker || {
  Colony: {}
};

!function(global) {
  'use strict';

  function Ant(options) {
    this.options = options || {};
    this.initialize().buildAnt().joinColony();
  }

  Ant.prototype.initialize = function initialize() {
    this._id = this.options._id;

    var _randomPoint = new Point(
      this.thinkOfANumber(0, view.size.width),
      this.thinkOfANumber(0, view.size.height)
    );

    this.pos = {
      startPoint: _randomPoint,
      directionLat: this.flipTheCoin(50),
      directionLon: this.flipTheCoin(50),
      speedLat: this.thinkOfANumber(1, 6),
      speedLon: this.thinkOfANumber(1, 6),
      rotation: this.thinkOfANumber(-3, 3)
    };

    return this;
  }

  Ant.prototype.buildAnt = function buildAnt() {
    this.path = new Path.RegularPolygon({
      center: this.pos.startPoint,
      sides: 6,
      radius: (view.size.width / view.size.height) * 10,
      selected: true,
      selectedColor: this.grabWarPaint()
    });

    return this;
  }

  Ant.prototype.joinColony = function joinColony() {
    global.Colony[this._id] = this;
    return this;
  }

  Ant.prototype.flipTheCoin = function flipTheCoin(probability) {
    var _random = this.thinkOfANumber(0, 100),
        _result = (_random >= probability) ? true : false;

    return _result;
  }

  Ant.prototype.thinkOfANumber = function thinkOfANumber(start, end) {
    return Math.floor(
      Math.random() * (end - start + 1) + start
    );
  }

  Ant.prototype.march = function march() {
    var _mv = this.pos;

    if (_mv.directionLat === true) {
      this.path.position.x += _mv.speedLat;
    }
    else {
      this.path.position.x -= _mv.speedLat;
    }

    if (_mv.directionLon === true) {
      this.path.position.y += _mv.speedLon;
    }
    else {
      this.path.position.y -= _mv.speedLon;
    }

    this.path.rotate(this.pos.rotation);

    return this;
  }

  Ant.prototype.checkBounds = function checkBounds() {
    if (this.path.bounds.x <= 0) {
      this.pos.directionLat = true;
      this.pos.rotation = this.thinkOfANumber(-3, 3);
    }

    if (this.path.bounds.x + this.path.bounds.width >= view.bounds.width) {
      this.pos.directionLat = false;
      this.pos.rotation = this.thinkOfANumber(-3, 3)
    }

    if (this.path.bounds.y <= 0) {
      this.pos.directionLon = true;
      this.pos.rotation = this.thinkOfANumber(-3, 3)
    }

    if (this.path.bounds.y + this.path.bounds.height >= view.bounds.height) {
      this.pos.directionLon = false;
      this.pos.rotation = this.thinkOfANumber(-3, 3)
    }

    return this;
  }

  Ant.prototype.checkCollisions = function checkCollisions() {
    var ant1 = this,
        _i,
        ant2,
        intersections;

    for (var key in global.Colony) {
      if (parseFloat(key) !== ant1._id) {
        ant2 = global.Colony[key];

        intersections = ant1.path.getIntersections(ant2.path);

        if (intersections.length) {
          ant1.goCannibal(ant2);
        }
      }
    }

    return this;
  }

  Ant.prototype.goCannibal = function goCannibal(ant2) {
    var ant1 = this;
    if (ant1.path.area > ant2.path.area) {
      ant1.path.scale(1.1);
      ant2.path.remove();
      delete global.Colony[ant2._id];
    }
    else {
      ant2.path.scale(1.1);
      ant1.path.remove();
      delete global.Colony[ant1._id];
    }
  }

  Ant.prototype.grabWarPaint = function grabWarPaint() {
    var letters = '0123456789ABCDEF'.split(''),
        color = '#';

    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }

    return color;
  }

  global.Ant = Ant;
}(AntHacker);
