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
      speedLon: this.thinkOfANumber(1, 6)
    };

    return this;
  }

  Ant.prototype.buildAnt = function buildAnt() {
    this.path = new Path.RegularPolygon({
      center: this.pos.startPoint,
      sides: 7,
      radius: (view.size.width / 2) / 50,
      selected: true,
      selectedColor: "red"
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

    return this;
  }

  Ant.prototype.checkBounds = function checkBounds() {
    if (this.path.bounds.x <= 0) {
      this.pos.directionLat = true }

    if (this.path.bounds.x + this.path.bounds.width >= view.bounds.width) {
      this.pos.directionLat = false }

    if (this.path.bounds.y <= 0) {
      this.pos.directionLon = true }

    if (this.path.bounds.y + this.path.bounds.height >= view.bounds.height) {
      this.pos.directionLon = false }

    return this;
  }

  Ant.prototype.checkCollisions = function checkCollisions() {
    var baseAnt = this,
        _i,
        _testAnt,
        intersections;

    for (var key in global.Colony) {
      if (parseFloat(key) !== baseAnt._id) {
        _testAnt = global.Colony[key];

        intersections = baseAnt.path.getIntersections(_testAnt.path);

        if (intersections.length) {
          if (baseAnt.path.area > _testAnt.path.area) {
            baseAnt.path.scale(1.25);
            _testAnt.path.remove();
            delete global.Colony[key];
          }
          else {
            _testAnt.path.scale(1.25);
            baseAnt.path.remove();
            delete global.Colony[baseAnt._id];
          }
        }
      }
    }

    return this;
  }

  global.Ant = Ant;
}(AntHacker);
