// Object Variables
var Ball,
    Box,
    Essay;

// Done
var mode, count, ordered, done, allowCollisions, donePoint;
var Balls = [];

// Randomise
function randomise(to, from) {
  var lemons = Math.floor( Math.random() * (to - from + 1) + from );
  return lemons;
};

// Chance It
function chanceIt(probs) {
  var pears = randomise(0, 100);
  
  if ( pears >= probs ) {
    return true;
  }
  else {
    return false;
  }
};

function countDown(secs) {
  var count = secs;

  var interval = setInterval(function() {
    if ( count === 0 ) {
      allowCollisions = true;
      clearInterval(interval);
      return false;
    }

    count--;
  }, 1000);
}

// Initialize funciton
function setup() {
  $(".references").hide();
  
  if ( Balls.length === 1 ) {
    Balls[0].ball.remove();
  }
  
  mode = 0;
  count = 0;
  done = false;
  ordered = false;
  allowCollisions = false;
  donePoint = new Point(view.center.x + 300, view.center.y);
  
  $("#essay .body").empty()
  
  Balls = new Array();
  
  $.ajax({
    url: "/disso",
    success: function(data) {
      var showy = new Showdown.converter;
      Essay = data.split("\n\n");

      for ( var i = 0; i < Essay.length; i++ ) {
        var that = Essay[i];
        Essay[i] = showy.makeHtml(that);
      }

      createBalls( Essay.length );
    }
  });
};

// Setup balls
function createBalls(amount) {
  Balls = [];

  for ( var _i = 0; _i < amount; _i++ ) {
    new Ball(_i);
  }
}


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


// Ball Object

Ball = Base.extend({
  
  initialize: function(id) {
    this.id = id;
    this.radius = 20;
    this.point = Point.random() * view.size
    
    this.directionX = chanceIt(50);
    this.directionY = chanceIt(50);
    this.speedX = randomise(1, 6);
    this.speedY = randomise(1, 6);
    
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
  
  checkCollisions: function() {
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
        
        // Render shiz.
        this.ball.join( Balls[i].ball );
        this.renderEssay( bid );
        
        if( ordered === true ) {
          count++;
        }
      }
    }
  },
  
  renderEssay: function( id ) {
    var para;
    
    if( ordered === true ) {
      para = Essay[count];
    }
    else {
      para = Essay[id];
    }
    
    $("#essay .body").append(para);
    window.scrollBy(0, $(document).height());
    
    Balls.removeById( id );
  },

  animateBall: function() {
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
  
  bounce: function() {
    this.checkBounds();
    if ( allowCollisions === true ) {
      this.checkCollisions();
    }
    this.animateBall();
  }
});


// On frame
function onFrame(event) {
  // Start Point
  if ( mode === 0 || mode === 1 ) {
    for ( var i = 0; i < Balls.length; i++ ) {
      Balls[i].bounce();
    }
  }
  
  if ( Balls.length === 1 && mode === 1 ) { mode = 2; return false; }
  
  // Finish Animation
  if ( mode === 2 && done === false ) {
    // Setup some variables to make life easier
    var id = Balls[0].id;
    
    var para;
    
    if( ordered === true ) {
      para = Essay[count];
    }
    else {
      para = Essay[id];
    }
    
    // Set animation to done
    // and next mode :-)
    mode = 3;
    done = true;
    
    $("#essay .body").append(para);
    window.scrollBy(0, -$(document).height());
    
    $("#buttons").show();
    
    if ( ordered === true ) {
      $(".references").show();
    }
  }
  
  // Move crazy squares
  if ( mode === 3 && done === true ) {
    var vektor = donePoint - Balls[0].ball.position;

    Balls[0].ball.position += vektor / 30;
    return false;
  }
};

function onResize(event) {
  donePoint = new Point(view.center.x + 250, view.center.y);
}

$("#start-button").click(function(event) {
  var el = $(event.target),
      intro = $(".intro");
  
  intro.hide();
  // ordered = true;

  
  countDown(1);
  
  mode = 1;
});

$("#restart-button").click(function(event) {
  var el = $(event.target),
      intro = $(".intro");
  
  setup();
  
  $("#buttons").hide();
  
  countDown(1);
  ordered = false;
  mode = 1;
  
});

$("#real-button").click(function(event) {
  var el = $(event.target),
      intro = $(".intro");
  
  setup();
  
  $("#buttons").hide();
  
  countDown(1);
  ordered = true;
  mode = 1;
});

// Little bits n bobs
Mousetrap.bind('f', function() {
  for ( var i = 0; i < Balls.length; i++ ) {
    Balls[i].speedX += 3;
    Balls[i].speedY += 3;
  }
});

Mousetrap.bind('s', function() {
  for ( var i = 0; i < Balls.length; i++ ) {
    Balls[i].speedX -= 3;
    Balls[i].speedY -= 3;
  }
});

Mousetrap.bind('r', function() {
  for ( var i = 0; i < Balls.length; i++ ) {
    Balls[i].speedX = randomise(1, 6);
    Balls[i].speedY = randomise(1, 6);
    Balls[i].directionX = chanceIt(50);
    Balls[i].directionY = chanceIt(50);
  }
});

$(document).ready(function() {
  setup();
});