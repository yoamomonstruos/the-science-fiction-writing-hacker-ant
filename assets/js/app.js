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
    this.horizontal_speed = randomise(1, 10);
    this.vertical_speed = randomise(1, 10);
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
  };
  
  Ball.prototype.checkCollisions = function() {
    var _this = this,
        cid = _this.cid,
        cel = document.getElementById( cid ),
        x = cel.offsetLeft,
        y = cel.offsetTop;
    
    for ( var _i = 0; _i < boxes.length; _i++ ) {
      var box = boxes[_i],
          el = document.getElementById( box.cid );
      
      if ( box.cid === cid ) { return false; }
      
      if ( x > el.offsetLeft && x < (el.offsetLeft + el.clientWidth) && y > el.offsetTop && y < (el.offsetTop + el.clientHeight) ) {
        if ( _this._id === (box._id + 1) && box._id === count ) {
          console.log(box._id, _this._id, count);
          boxes.shift();
          count++;
        }
      }
    }
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
    }, 20, function() {
      _this.checkBoundaries();
      if (timed === true ) { _this.checkCollisions(); }
      _this.shakeIt();
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
  
  setTimeout( function() {
    timed = true;
    console.log(timed);
  }, 1000);
  
  for( var _i = 1; _i <= 3; _i++ ) {
    var ball = new Ball(_i);
    ball.build();
    ball.shakeIt();
    
    boxes.push(ball);
  }
  
  console.log(boxes);
});