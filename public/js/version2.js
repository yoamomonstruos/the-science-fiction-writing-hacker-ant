// Object Variables
var Balls, Ball, Box;

// Functions
var randomise, chanceIt, innit;

// Hold All The Ballz.
Balls = [];


// Randomise
randomise = function(to, from) {
  var lemons = Math.floor( Math.random() * (to - from + 1) + from );
  return lemons;
};


// Chance It
chanceIt = function(probs) {
  var pears = randomise(0, 100);
  
  if ( pears >= probs ) {
    return true;
  }
  else {
    return false;
  }
};


// Ball Object

Ball = Base.extend({
  
  initialize: function(id) {
    this.id = id;
    this.point = Point.random() * view.size;
    this.radius = 10;
    this.colour = new HsbColor(Math.random() * 360, 1, 1);
    
    this.directionX = chanceIt(50);
    this.directionY = chanceIt(50);
    this.speedX = randomise(2, 7);
    this.speedY = randomise(2, 7);
    
    this.draw();
  },
  
  draw: function() {
    this.ball = new Path.Circle(this.point, this.radius);
    this.ball.selected = true;
    
    Balls.push(this);
  },
  
  checkBounds: function() {
    var ball = this.ball;
    var bound = ball.bounds;
  
    // Check left boundary
    if ( bound.x <= 0 ) {
      this.directionX = true;
    }
    
    // Check right boundary
    if ( bound.x + bound.width >= view.bounds.width ) {
      this.directionX = false;
    }
    
    // Check top boundary
    if ( bound.y <= 0 ) {
      this.directionY = true;
    }
    
    // Check bottom boundary
    if ( bound.y + bound.height >= view.bounds.height ) {
      this.directionY = false;
    }
  },
  
  checkCollision: function() {
    for ( var i = 0; i < Balls.length; i++ ) {
      var bond = this.ball.bounds,
          iso = Balls[i].ball.bounds;
    
      if ( bond.x < iso.x && (bond.x + bond.width) > iso.x &&
           bond.y < iso.y && (bond.y + bond.width) > iso.y) {
        
        // this.directionY = Balls[i].directionY;
        // this.directionX = Balls[i].directionX;
        // this.speedY = Balls[i].speedY;
        // this.speedX = Balls[i].speedX;
        
        console.log("X");
        
      }
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
  
  iterate: function() {
    this.checkBounds();
    this.checkCollision();
    this.move();
  }
  
});


// Array.findById
Array.prototype.findById = function( value ) {
  var obj;
  
  for ( var i = 0; i < this.length; i++ ) {
    if (this[i].id === value) {
      return this[i];
    }
  }
}

// Array.removeById
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


// On frame

var onFrame = function(event) {
  for ( var i = 0; i < Balls.length; i++ ) {
    Balls[i].iterate();
  }
};


// Initialize funciton
innit = function() {
  for ( var i = 0; i < 2; i++ ) {
    var x = new Ball(i);
  }
};


innit();

window.x = Balls;