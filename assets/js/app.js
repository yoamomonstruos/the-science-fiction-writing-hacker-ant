var boundaries = {},
    el = document.getElementById("content"),
    boxes = [],
    timed = false,
    count = 1;

var randomise = function( to, from ) {
  return Math.floor( Math.random() * ( to-from + 1 ) + from );
};

var chances = function( chance ) {
  var n = randomise( 0, 100 );
  
  if ( n >= chance ) {
    return true;
  }
  else {
    return false;
  }
};

var Ball = (function() {
  
  function Ball(id) {
    this._id = id;
    this.cid = "c" + this._id;
    this.direction_top = chances(50);
    this.direction_left = chances(50);
    this.horizontal_speed = randomise(1, 15);
    this.vertical_speed = randomise(1, 15);
    this.remove = false;
  }
  
  Ball.prototype.build = function() {
    var box = document.createElement( "div" ),
        el = document.getElementById( "content" );
    
    box.classList.add( "box" );
    box.id = this.cid;
    box.style.left = this.x + "px";
    box.style.top = this.y + "px";
    box.innerHTML = this._id;
    
    el.appendChild( box );
  };
  
  Ball.prototype.checkBoundaries = function() {
    var box = document.getElementById( this.cid );

    if ( !box ) { return false; }

    if ( box.offsetTop <= 0 ) {
      this.direction_top = true;
    }
    else if ( box.offsetLeft <= 0 ) {
      this.direction_left = true;
    }
    else if ( (box.offsetTop + box.clientHeight) >= boundaries.bottom ) {
      this.direction_top = false;
    }
    else if ( (box.offsetLeft + box.clientWidth) >= boundaries.right ) {
      this.direction_left = false;
    }
    
    this.checkCollisions();
  };
  
  Ball.prototype.checkCollisions = function() {
    // if ( timed === false ) { return false; }
        
    for ( var _i = 0; _i < boxes.length; _i++ ) {
      var outerBox = boxes[_i],
          outerEl = document.getElementById( outerBox.cid );
      
      for ( var _k = 0; _k < boxes.length; _k++ ) {
        var innerBox = boxes[_k],
            innerEl = document.getElementById( innerBox.cid );
              
        if ( outerEl.offsetLeft < innerEl.offsetLeft && ( outerEl.offsetLeft + outerEl.clientWidth ) > innerEl.offsetLeft &&
             outerEl.offsetTop < innerEl.offsetTop && ( outerEl.offsetTop + outerEl.clientHeight ) > innerEl.offsetTop ) {
          
          if ( outerBox._id === innerBox._id + 1 && innerBox._id === count) {
            console.log("marked to be removed: " + innerBox._id);
            innerBox.remove = true;
            count++;
          }
          else {
            if ( outerBox.direction_top !== innerBox.direction_top ) {
              outerBox.direction_top = chances(50);
              innerBox.direction_top = chances(50);
            }
            
            if ( outerBox.direction_left !== innerBox.direction_left ) {
              outerBox.direction_left = chances(50);
              innerBox.direction_left = chances(50);
            }
          }
        }
      }
    }
    
    this.cleanUp();
    this.shakeIt();
  };
  
  Ball.prototype.cleanUp = function() {
    var container = document.getElementById("content");
    
    for ( var _i = 0; _i < boxes.length; _i++ ) {
      var outerBox = boxes[_i],
          outerEl = document.getElementById( outerBox.cid );
      
      if ( outerBox.remove === true ) {
        boxes.shift();
        container.removeChild(outerEl);
      }
    }
    
    var el = document.getElementById("c" + count);
    el.classList.add("active");
  };
  
  Ball.prototype.shakeIt = function() {
    var x, y;
    
    if( this.direction_top === true ) { x = "+="; }
    if( this.direction_top === false ) { x = "-="; }
    if( this.direction_left === true ) { y = "+="; }
    if( this.direction_left === false ) { y = "-="; }
    
    this.animate( x, y );
  };
  
  Ball.prototype.animate = function( x, y ) {
    var _this = this;
    
    $("#" + _this.cid ).animate({
      left: y + _this.horizontal_speed,
      top: x + _this.vertical_speed
    }, 5, function() {
      _this.checkBoundaries();
    });
  };
  
  return Ball;
  
})();


var setBoundaries = function() {
  var el = document.getElementById("content");
  
  boundaries = {
    top: el.offsetTop,
    left: el.offsetLeft,
    bottom: el.offsetTop + el.clientHeight,
    right: el.offsetLeft + el.clientWidth - 500
  };
  
  return;
};

window.addEventListener("resize", function() {
  setBoundaries();
});

document.addEventListener("DOMContentLoaded", function() {
  setBoundaries();
  
  for( var _i = 1; _i <= 20; _i++ ) {
    var ball = new Ball(_i);
    ball.build();
    ball.shakeIt();
    
    boxes.push(ball);
  }
  
  console.log(boxes);
});