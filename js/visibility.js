var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.addEventListener('mousemove', mouse_track);

var mouse_pos_x = 0;
var mouse_pos_y = 0;

function mouse_track(event) {
  mouse_pos_x = event.clientX;
  mouse_pos_y = event.clientY;
}

// create some random triangles and add corresponding
// line segements to barriers array
var barriers = [];

// this array defines the 
var vertices = [];

var corners = [];

var dx = 1e-6;

// initialise some segments
// for(i=0; i<10; i++) {
//

// var segment1 = {
// 	points: [{x_: 450, y_: 500},{x_: 420, y_: 420}], // these need to be actual values not variables defined within 
//   x1: 450,
//   y1: 500,
//   x2: 420,
//   y2: 420
// }

// var segment2 = {
// 	points: [{x_: 140, y_: 140},{x_: 170, y_: 170}], // these need to be actual values not variables defined within 
//   x1: 140,
//   y1: 140, 
//   x2: 170,
//   y2: 170
// }
// var segment3 = {
// 	points: [{x_: 380, y_: 240},{x_: 270, y_: 270}], // these need to be actual values not variables defined within 
//   x1: 380,
//   y1: 240, 
//   x2: 270,
//   y2: 270
// }

var segment4 = {
	points: [{x_: 340, y_: 540},{x_: 341, y_: 770}], // these need to be actual values not variables defined within 
  x1: 340,
  y1: 540, 
  x2: 340,
  y2: 770,
	
}

function dist(a, b){
 return Math.sqrt(a*a + b*b);
}


// barriers.push(segment1);
// barriers.push(segment2);
// barriers.push(segment3);
barriers.push(segment4);
console.log(barriers.length);

function getRand(min, max) {
      return Math.random() * (max - min) + min;
}

function getIntersection(x1,  y1,  x2,  y2,  x3,  y3,  x4,  y4)
{
  var x;
  var y;
  var b = false;
  var denom = (x3 - x4) * (y2 - y1) + (x2 - x1) * (y4 - y3);

  var s = ((y1 - y2) * (x1 - x3) + (x2 - x1) * (y1 - y3)) / denom;

  // "local" ray frame  
  var r = ((x4 - x3) * (y1 - y3) + (y3 - y4) * (x1 - x3)) / denom;

  //not colinear or parallel
  if (denom != 0)
  {
    if (s >= 0 && s <= 1 && r >= 0)
    {
      // Collision detected
      x = x1 + (r * (x2 - x1));
      y = y1 + (r * (y2 - y1));
      b = true;
    }
  }
  var p;
  p = [b, x, y]
  return p;
}

function draw() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var corners = [{x: 0,y: 0},{x:window.innerWidth,y:0},{x:window.innerWidth,y:window.innerHeight},{x:0, y:window.innerHeight}]

  vertices = [];
  // if (canvas.getContext) {
  //   ctx.fillStyle = "rgb(255,0,0)";
  // }
  for(i=0; i < barriers.length;i++){
    ctx.beginPath();
    var points = barriers[0].points;
    for(j=0; j < points.length-1; j++){
      ctx.moveTo(points[j].x_,points[j].y_);
      ctx.lineTo(points[j+1].x_,points[j+1].y_);
      ctx.stroke();
    }
  }

  ctx.beginPath();
  ctx.arc(mouse_pos_x, mouse_pos_y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
 
	vertices.push(corners[0]);
	vertices.push(corners[1]);
	vertices.push(corners[2]);
	vertices.push(corners[3]);


	//Add all the vertices of the barriers to an array to construct rays to them from the light source
	for (i = 0; i < barriers.length; i++) {
		for (j = 0; j < barriers[i].points.length; j++) { // number of points in each barrier
			var vertex = {
				x: barriers[i].points[j].x_,
				y: barriers[i].points[j].y_
			};
			vertices.push(vertex); 
      var vertexp = {
        x: barriers[i].points[j].x_ + dx,
        y: barriers[i].points[j].y_ + dx
      }
			vertices.push(vertexp); 
      var vertexm = {
        x: barriers[i].points[j].x_ - dx,
        y: barriers[i].points[j].y_ - dx
      }
			vertices.push(vertexm); 
      // we need to add a slight offset here for all of the 
      // vertices 
		}
	}

  var m_x = mouse_pos_x;
  var m_y = mouse_pos_y;
  
  //pseudocode
  //first determine the maxlimits - corners and the intersection with the 
  //boundaries of the domain 
  //for each vertex attempt to draw lines from mouse to vertex
  //if barrier intersects line going to vertex
  //draw line to intersection point

  //minlimits
  var intersect;
  var maxLimits = [];
  // add the corners
  maxLimits.push([true, corners[0].x, corners[0].y]);
  maxLimits.push([true, corners[1].x, corners[1].y]);
  maxLimits.push([true, corners[2].x, corners[2].y]);
  maxLimits.push([true, corners[3].x, corners[3].y]);

  // determine intersection of each vertex with the limits of the domain
  // so segments that determine the edge of the domain
  // only one of these will 
  // first 4 vertices correspond to the corners 
  for(i = 4; i < vertices.length; i++)
  {
    p = getIntersection(m_x, m_y, vertices[i].x, vertices[i].y, 0, 0, canvas.width, 0);
    if(p[0])
      maxLimits.push(p);
    p = getIntersection(m_x, m_y, vertices[i].x, vertices[i].y, canvas.width, 0, canvas.width, canvas.height);
    if(p[0])
      maxLimits.push(p);
    p = getIntersection(m_x, m_y, vertices[i].x, vertices[i].y, canvas.width, canvas.height, 0, canvas.height);
    if(p[0])
      maxLimits.push(p);
    p = getIntersection(m_x, m_y, vertices[i].x, vertices[i].y, 0, canvas.height, 0, 0);
    if(p[0])
      maxLimits.push(p);
  }

  
  // for(i = 0; i < vertices.length; i++)
  // {
  //   // initialise to maxlimit
  //   for(j = 0; j < barriers.length; j++)
  //   {
  //      p = getIntersection(m_x, m_y, vertices[i].x, vertices[i].y, barriers[j].points[0].x_, barriers[j].points[0].y_, barriers[j].points[1].x_, barriers[j].points[1].y_)
  //     {
  //       if(p[0])
  //       {
  //         // determine if this is less than the  
  //       }

  //     }
  //   }
  //   closestPts.push(temp);
  // } 
  
  ctx.strokeStyle = "rgb(255,0,0)";

  console.log("maxlimits " + maxLimits.length)
  for(i=0; i < maxLimits.length; i++){
    ctx.beginPath(); 
    ctx.moveTo(m_x, m_y);
    ctx.lineTo(maxLimits[i][1],maxLimits[i][2]);
    ctx.stroke();
  }


  window.requestAnimationFrame(draw);
}
window.requestAnimationFrame(draw);
