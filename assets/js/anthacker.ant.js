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

    this.paragraph = global.Paragraphs[this._id];

    return this;
  }

  Ant.prototype.buildAnt = function buildAnt() {
    this.path = new Path.RegularPolygon({
      center: this.pos.startPoint,
      sides: 6,
      radius: this.calculateRadius(),
      selected: true,
      selectedColor: "red"
    });

    return this;
  }

  Ant.prototype.calculateRadius = function calculateRadius() {
    return 5 + (20 - 5) * (this.paragraph.length - 0) / (2000 - 0);
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

        if (intersections.length && global.currentState === 1) {
          ant1.goCancerous(ant2);
          ant1.pos.directionLon = (ant1.pos.directionLon === true) ? false : true;
          ant1.pos.directionLat = (ant1.pos.directionLat === true) ? false : true;
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
      ant2.write();
      delete global.Colony[ant2._id];
    }
    else {
      ant2.path.scale(1.1);
      ant1.path.remove();
      ant1.write();
      delete global.Colony[ant1._id];
    }
  }

  Ant.prototype.goCancerous = function goCancerous(ant2) {
    var ant1 = this;
    if (ant1.path.area > ant2.path.area) {
      var _temp = ant1.path.unite(ant2.path);

      ant1.path.remove();
      ant2.path.remove();

      ant1.path = _temp;
      ant1.path.selectedColor = "red";
      ant1.path.selected = true;
      ant2.write();
      delete global.Colony[ant2._id];
    }
    else {
      var _temp = ant2.path.unite(ant1.path);

      ant1.path.remove();
      ant2.path.remove();

      ant2.path = _temp;
      ant2.path.selectedColor = "red";
      ant2.path.selected = true;
      ant1.write();
      delete global.Colony[ant1._id];
    }

    return this;
  }

  Ant.prototype.write = function write() {
    var $body = document.querySelector('#hemingway');


    if (global.wordMode === false) {
      $body.insertAdjacentHTML(
        'beforeend',
        global.converter.makeHtml(this.paragraph)
      );
    }
    else {
      $body.insertAdjacentHTML(
        'beforeend',
        global.converter.makeHtml(
          global.Paragraphs[global.paragraphsCount]
        )
      );
    }

    window.scrollBy(0, document.body.clientHeight);
    global.paragraphsCount += 1;
  }

  global.Ant = Ant;
}(AntHacker);
