// Object Variables
var Balls, Ball, Box, Essay;

// Functions
var randomise, chanceIt, innit;

// Done
var start = false;
var done = false;
var donePoint = new Point(view.center.x + 250, view.center.y);

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
    this.radius = 20;
    this.colour = new HsbColor(Math.random() * 360, 1, 1);
    
    this.directionX = chanceIt(50);
    this.directionY = chanceIt(50);
    this.speedX = randomise(2, 5);
    this.speedY = randomise(2, 5);
    
    this.draw();
  },
  
  draw: function() {
    this.ball = new Path.Rectangle(this.point, this.radius);
    this.ball.selected = false;
    this.ball.strokeColor = "#00ADEF";
    
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
          iso = Balls[i].ball.bounds,
          bid = Balls[i].id;
    
      if ( bond.x < iso.x && (bond.x + bond.width) > iso.x &&
           bond.y < iso.y && (bond.y + bond.width) > iso.y) {
        
        this.directionY = Balls[i].directionY;
        this.directionX = Balls[i].directionX;
        this.speedY = Balls[i].speedY;
        this.speedX = Balls[i].speedX;
        
        this.ball.join( Balls[i].ball );
        
        var para = Essay[bid];
        
        $("#essay").append(para);
        window.scrollBy(0, $(document).height());
        
        Balls.removeById( Balls[i].id );
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
    if( Balls.length === 1 ) { return false; }
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
    }
  }

  this.splice(id, 1);
};


// On frame

var onFrame = function(event) {
  if ( done === true ) {
    var vektor = donePoint - Balls[0].ball.position;
    
    Balls[0].ball.position += vektor / 30;
    return false;
  }
  else if ( Balls.length === 1) {
    var id = Balls[0].id;
    var para = Essay[id];
    
    $("#essay").append(para);
    done = true;
    window.scrollBy(0, -$(document).height());
  }
  else if ( start === true ){
    for ( var i = 0; i < Balls.length; i++ ) {
      Balls[i].iterate();
    }
  }
};


// Initialize funciton
innit = function() {
  $.ajax({
    url: "/disso",
    success: function(data) {
      var showy = new Showdown.converter;
      Essay = data.split("\n\n");
      
      for ( var i = 0; i < Essay.length; i++ ) {
        var that = Essay[i];
        Essay[i] = showy.makeHtml(that);
      }
      
      Balls = [];
      
      for ( var i = 0; i < Essay.length; i++ ) {
        var x = new Ball(i);
      } 
    }
  });
};


var button = document.getElementById("start-button");

button.addEventListener("click", function( event ) {
  var el = $(event.target);
  
  $('.intro').remove();
  
  start = true;
  
  el.remove();
  
});

innit();

window.x = Balls;