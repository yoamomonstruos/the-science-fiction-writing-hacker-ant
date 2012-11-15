// Object Variables
var Ball,
    Box,
    Essay;

// Done
var mode, done, allowCollisions, donePoint;
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
  var count = secs,
      el = $("#timer");
      
  el.css({
    top: (view.bounds.height / 2) - (el.height() / 2),
    left: (view.bounds.width / 2) - el.width()
  }).show();


  var interval = setInterval(function() {
    console.log("Fired");
    if ( count === 0 ) {
      allowCollisions = true;
      clearInterval(interval);
      el.html("&nbsp;").hide();
      return false;
    }
    
    el.html(count);
    count--;
  }, 1000);
}

// Initialize funciton
function setup() {
  if ( Balls.length === 1 ) {
    Balls[0].ball.remove();
  }
  
  mode = 0;
  done = false;
  allowCollisions = false;
  donePoint = new Point(view.center.x + 250, view.center.y);
  
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
        
        this.ball.join( Balls[i].ball );
        
        this.renderEssay( bid );
      }
    }
  },
  
  renderEssay: function( id ) {
    var para = Essay[id];
    
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
    var id = Balls[0].id,
        para = Essay[id];
    
    // Set animation to done
    // and next mode :-)
    mode = 3;
    done = true;
    
    $("#essay .body").append(para);
    window.scrollBy(0, -$(document).height());
    
    $("#buttons").show();
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

setup();

$("#start-button").click(function(event) {
  var el = $(event.target),
      intro = $(".intro");
  
  intro.hide();
  
  countDown(3);
  
  mode = 1;
});

$("#restart-button").click(function(event) {
  var el = $(event.target),
      intro = $(".intro");;
  
  setup();
  
  $("#buttons").hide();
  
  countDown(3);
  mode = 1;
  
});