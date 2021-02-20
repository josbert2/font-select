const injectSVG = () => {
    document.body.insertAdjacentHTML(
      "beforeend",
      `
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="display:none">
        <defs>
          <filter id="goo">
            <fegaussianblur
              in="SourceGraphic"
              stddeviation="10"
              result="blur"
            />
            <fecolormatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8"
              result="goo"
            />
            <fecomposite in="SourceGraphic" in2="goo" operator="atop"/>
          </filter>
        </defs>
      </svg>`
    );
  };
  
  const gooeyButtons = () => {
    const buttons = document.querySelectorAll("button[data-gooey]");
    const mouseDot = document.createElement("SPAN");
    const margin = 50;
    const size = 100;
  
    mouseDot.style.display = "block";
    mouseDot.style.position = "absolute";
    mouseDot.style.zIndex = -1;
    mouseDot.style.width = "30px";
    mouseDot.style.height = "30px";
    mouseDot.style.borderRadius = "50%";
    mouseDot.style.background = "palevioletred";
    mouseDot.style.visibility = "hidden";
    mouseDot.style.opacity = 0.5;
  
    injectSVG();
  
    document.body.style.filter = "url('#goo')";
  
    document.body.appendChild(mouseDot);
  
    const calcDistance = (mouse, bounds) => {
      const { clientX: mX, clientY: mY } = mouse;
      const distanceXLeft = Math.min(
        1,
        (mX - (bounds.x - margin)) / (margin + bounds.width / 2)
      );
      const distanceXRight = Math.min(
        1,
        -(mX - (bounds.x + bounds.width + margin)) / (margin + bounds.width / 2)
      );
      const distanceYTop = Math.min(
        1,
        (mY - (bounds.y - margin)) / (margin + bounds.height / 2)
      );
      const distanceYBottom = Math.min(
        1,
        -(mY - (bounds.y + bounds.height + margin)) / (margin + bounds.height / 2)
      );
      return Math.min(
        distanceXLeft,
        distanceXRight,
        distanceYTop,
        distanceYBottom
      );
    };
  
    window.addEventListener("mousemove", e => {
      const x = e.clientX;
      const y = e.clientY;
      let inside = buttons.length;
  
      buttons.forEach(button => {
        const bounds = button.getBoundingClientRect();
  
        if (
          x > bounds.x - margin &&
          x < bounds.x + bounds.width + margin &&
          y > bounds.y - margin &&
          y < bounds.y + bounds.height + margin
        ) {
          inside++;
          const distance = calcDistance(e, bounds);
          mouseDot.size = size * distance;
          mouseDot.style.width = `${size * distance}px`;
          mouseDot.style.height = `${size * distance}px`;
          mouseDot.style.background = window.getComputedStyle(
            button
          ).backgroundColor;
        } else {
          inside--;
        }
      });
  
      if (inside !== 0) {
        mouseDot.style.visibility = "visible";
        mouseDot.style.left = `${x - mouseDot.size / 2}px`;
        mouseDot.style.top = `${y - mouseDot.size / 2}px`;
      } else {
        mouseDot.style.visibility = "hidden";
      }
    });
  };
  
gooeyButtons();

// Gooey Buttons Source Code:
// https://codepen.io/garetmckinley/pen/vbRjdL
// Follow for more pens like this <3




$(document).ready(function() {
    var menu = $('.menu'); 
    var curve = 0, direction;
    function setPath(x, curve) {
      if(curve <= 0) {
        direction = 0;
      } else {
        direction = 1; 
      }
      var path = 'M0,0 L'+ x + ',0 a' + curve + ',255 0,0 ' + direction + ' 0,450 L0,450';
      return path;
    }
    function easeOutElastic(t, b, c, d) {
      var s=1.70158;var p=0;var a=c;
      if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
      if (a < Math.abs(c)) { a=c; var s=p/4; }
      else var s = p/(2*Math.PI) * Math.asin (c/a); 
      return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    } 
    function animate() {  
      var duration = 1000;
      var frameRate = 60/1000;
      var totalFrames = duration * frameRate; 
      var currentFrame = 0;  
      var endX = 200;  
      var newX, newCurve;  
      function animatePath() { 
        currentFrame++;  
        newX = easeOutElastic(currentFrame, 60, endX - 60, totalFrames); 
        newCurve = easeOutElastic(currentFrame, curve, 0 - curve, totalFrames);  
        menu.attr('d', setPath(newX, newCurve)); 
        if (currentFrame > totalFrames) { 
          return;
        }
        requestAnimationFrame(animatePath);
      }
      animatePath(); 
    }
    $(document).on('mousedown', '.menu', function(e) {
      var startX = e.pageX; 
      $(document).on('mousemove', function(e) {
        var currentX = e.pageX;
        var diff = currentX - startX;
        if(diff < 0) diff = 0;
        if(diff > 300) diff = 300; 
        curve = diff/2;
        menu.attr('d', setPath(60, curve));
      });
    });
    $(document).on('mouseup', function() {
      $(document).off('mousemove');
      animate();
    })
  })