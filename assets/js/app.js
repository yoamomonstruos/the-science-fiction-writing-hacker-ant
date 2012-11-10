var DSB = {},
    el = document.getElementById("content"),
    boxes = [],
    Ball;

Ball = (function() {
  
  function Ball(id) {
    this._id = id;
    this.cid = "p" + id;
    this.directionRight = 1;
    this.directionleft = 0;
    this.x = el.clientWidth / 2 - 20;
    this.y = el.clientHeight / 2 - 20;
    
    this.build();
    boxes.push(this);
  }
  
  Ball.prototype.build = function() {
    var box = document.createElement("div");
    
    box.classList.add("box");
    box.id = this.cid;
    box.style.left = this.x + "px";
    box.style.top = this.y + "px";
    
    el.appendChild(box);
  }
  
  Ball.prototype.animate = function() {
    var _this = this;
    
    $( _this ).animate({
      
    });
  }
  
  return Ball;
  
})();

DSB.buildBoxes = function( el, count ) {
  var widthCentre = el.clientWidth / 2 - 20,
      heightCentre = el.clientHeight / 2 - 20;
      
  DSB.boxes = [];
  
  for( var _i = 1; _i <= count; _i++ ) {
    var box = document.createElement("div");
    
    
    
    DSB.boxes.push(box);
  }
};


DSB.setBoundaries = function() {
  var el = document.getElementById("content");
  
  DSB.boundaries = {
    top: el.offsetTop,
    left: el.offsetLeft,
    bottom: el.offsetTop + el.clientHeight,
    right: el.offsetLeft + el.clientWidth
  };
  
  return;
};

DSB.checkBoundaries = function(el, x, y, s) {
  var _this = el;
  el = document.getElementById("content");

  // Check if it colides with boundaries
  if ( _this.offsetTop <= 0 ) {
    animateBall(x, "+=", s);
  }
  else if ( _this.offsetLeft <= 0) {
    animateBall("+=", y, s);
  }
  else if ( (_this.offsetTop + _this.clientHeight) >= DSB.boundaries.bottom ) {
    animateBall(x, "-=", s);
  }
  else if( (_this.offsetLeft + _this.clientWidth) >= el.clientWidth  ) {
    animateBall("-=", y, s);
  }
  else {
    animateBall(x, y, s);
  }
};

function animateBall(x, y, s) {
  var balls = $(".box");
  var el = document.getElementById("content");
  
  balls.animate({
    left: x + s,
    top: y + s
  }, 5, function() {
    var _this = this;
    DSB.checkBoundaries(_this, x, y, s);
  });
}

window.addEventListener("resize", function() {
  DSB.setBoundaries();
});

document.addEventListener("DOMContentLoaded", function() {  
  DSB.setBoundaries();
  DSB.buildBoxes(el, 1);
  
  var ball = new Ball(1);
  
  console.log(boxes);
  
  // animateBall("-=", "-=", 4);
});