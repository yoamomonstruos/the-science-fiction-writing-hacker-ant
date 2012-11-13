// Hold all our balls
var Balls = [];

// Randomise function
var randomise = function( to, from ) {
  var x = Math.floor( Math.random() * ( to - from + 1 ) + from );
  return x;
};

// Chance function :-)
var chance = function ( probs ) {
  var n = randomise( 0, 100 );
  if ( n >= probs ) {
    return true;
  }
  else {
    return false;
  }
};

// Ball Object
var Ball = Base.extend({

  initialize: function( id ) {
    this.id = id;
    this.point = Point.random() * view.size;
    this.radius = 10;
    this.colour = new HsbColor(Math.random() * 360, 1, 1 );

    this.directionX = chance(50);
    this.directionY = chance(50);
    this.speedX = randomise( 2, 10 );
    this.speedY = randomise( 2, 10 );

    this.draw();
  },

  draw: function() {
    this.ball = new Path.Circle( this.point, this.radius );
    this.ball.fillColor = this.colour;

    Balls.push( this );
  },

  iterate: function() {
    this.checkBounds();
    this.checkCollision();
    this.move();
    
    if ( Balls.length === 1 ) {
      
    }
  },

  move: function() {

    if ( this.directionX === true ) {
      this.ball.position.x += this.speedX;
    }
    else {
      this.ball.position.x -= this.speedX;
    }

    if ( this.directionY === true ) {
      this.ball.position.y += this.speedY;
    }
    else {
      this.ball.position.y -= this.speedY;
    }

  },

  checkBounds: function() {
    if ( this.ball.bounds.x <= 0 ) { this.directionX = true; }
    if ( this.ball.bounds.x + this.ball.bounds.width >= view.bounds.width ) { this.directionX = false; }
    if ( this.ball.bounds.y <= 0 ) { this.directionY = true; }
    if ( this.ball.bounds.y + this.ball.bounds.height >= view.bounds.height ) { this.directionY = false; }
  },

  checkCollision: function() {
    for ( var i = 0; i < Balls.length; i++ ) {
      var bond = this.ball.bounds,
          iso = Balls[i].ball.bounds;

      if ( bond.x < iso.x && (bond.x + bond.width) > iso.x &&
           bond.y < iso.y && (bond.y + bond.width) > iso.y) {

        var newColour = new HsbColor(this.colour.hue + Balls[i].colour.hue / 2, 1, 1 );
        Balls[i].ball.fillColor = newColour;

        Balls.removeById( this.id );
      }

    }
  }

});

Array.prototype.removeById = function( value ) {
  var id;

  for ( var i = 0; i < this.length; i++ ) {
    if ( this[i].id === value ) {
      id = i;
      this[i].ball.remove();
    }
  }

  this.splice(id, 1);
};



function onFrame( event ) {
  if ( Balls.length < 1 ) { 
    return false;
  }
  for ( var i = 0; i < Balls.length; i++ ) {
    Balls[i].iterate();
  }
}

function onMouseDown(event) { init(60); }