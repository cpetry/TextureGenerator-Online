/*
 * Author: Christian Petry
 * Homepage: www.petry-christian.de
 *
 * License: MIT
 * Copyright (c) 2014 Christian Petry
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, 
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or 
 * substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR 
 * OTHER DEALINGS IN THE SOFTWARE.
 */

function rgb2hex(rgb){
	 rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	 return "#" +
	  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
	  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
	  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2);
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// 1 - sqrt(number)
function Q_rsqrt(number) {
  var x2 = number * 0.5;
  fv[0] = number;
  lv[0] = 0x5f3759df - ( lv[0] >> 1 );
  var y = fv[0];
  y = y * ( threehalfs - ( x2 * y * y ) );

  return y;
}

// result is either 1 or 0
function random10Seed(seed, percentage) {
	percentage = (typeof percentage === "undefined") ? 1.00 : percentage;
	
    var x = Math.sin(seed) * 10000;
    return parseInt((x - Math.floor(x)) + (1.00 - percentage));
}

function randomSeed(seed) {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}


// This method is a *lot* faster than using (int)Math.floor(x)
function fastfloor(x){
	var xi = parseInt(x);
	return x<xi ? xi-1 : xi;
}

Number.prototype.fastmod = function(n) {
return ((this % n) + n) % n;
}


function rational_tanh(x)
{
    if( x < -3 )
        return -1;
    else if( x > 3 )
        return 1;
    else
        return x * ( 27 + x * x ) / ( 27 + 9 * x * x );
}

function showType(type){
	var id = type.substring(5);
	console.log(id);
	if (!$('#' + id).attr('id'))
		return;

	$('.type_settings').each(function() {
		if ($(this).attr('id') != id)
			$(this).hide();
	});

	$('.texture_type_selected').each(function() {
		$(this).toggleClass('texture_type_selected texture_type');
	});

	$('#' + type).toggleClass('texture_type texture_type_selected');
	//elem.setAttribute('class', 'texture_type_selected');
	//document.write(type);
	$('#' + id).show();

	updateTexture();
}
							
function updateTexture(canvas, size, params){
	//console.log("UT");
	var rotation = parseInt($("#rotation").val()) * (Math.PI/180); //rad to deg

	var c = document.getElementById("texture_preview");
	if (!canvas || canvas == '')
		canvas = c;

	
	var max_w = 512, max_h = 512;
	if (size && size != ''){
		size = parseInt(size);
		max_w = size;
		max_h = size;
	}
	else
		size = 512;
	console.log(size);

	canvas.width  = max_w; 	// important! dimensions would be to small otherwise
	canvas.height = max_h;
	
	var ctx = canvas.getContext("2d");


	var type = $(".texture_type_selected").first().attr('id').substring(5);
	//console.log(type);

	switch(type){
		case "Brick":
			updateBrick(canvas, size, params);
			break;
		case "Clouds":
			updateClouds(canvas, size, params);
			break;
		case "Checker":
			updateChecker(canvas, size, params);
			break;
		case "Gradient":
			updateGradient(canvas, size, params);
			break;
		case "PerlinNoise":
			updatePerlinNoise(canvas, size, params);
			break;
		case "Textiles":
			updateTextiles(canvas, size, params);
			break;
		case "Terrain":
			updateTerrain(canvas, size, params);
			break;
		case "Tiles":
			updateTiling(canvas, size, params);
			break;
		case "Wood":
			updateWood(canvas, size, params);
			break;
	}
	
	if (rotation != 0){
		ctx.beginPath();
		ctx.rect(0,0,max_w,max_h);
		ctx.translate(max_w/2, max_h/2);
		ctx.rotate(rotation);
		ctx.translate(-max_w/2, -max_h/2);

		var pat=ctx.createPattern(canvas,"repeat");

		ctx.clearRect(-max_w/2,-max_h/2,max_w/2,max_h/2);
		ctx.fillStyle=pat;
		ctx.fill();
		ctx.translate(max_w/2, max_h/2);
		ctx.rotate(-rotation);
		ctx.translate(-max_w/2, -max_h/2);
	}	
}




function percentage_compare (a,b) {
  // I'm assuming all values are numbers
  return a[1] - b[1];
}



function setGradientColors(canvas, size, colors, gradient_type){
	//document.write(colors[0][1]);
	
	// only the one the browser supports, will be applied!
	
	colors.sort(percentage_compare);
	
	
	var c = canvas;
	var ctx = c.getContext("2d");
	
	var grad;
	if (gradient_type == 'linear')
		grad = ctx.createLinearGradient(0,0,size,0);
		
	else if (gradient_type == 'radial')
		grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2+size/4); //x1,y1,r1 ,x1,y1,r1
	
	var gradient_text = 'linear-gradient(to right';
	
	colors.forEach(function(col) {
		gradient_text += ', ' + col[0] + ' ' + Math.max(col[1],0) + '%';
		grad.addColorStop(Math.max(col[1],0) / 100, col[0]);
	});
	
	$(canvas).css('background', gradient_text); // W3C
	
	
	ctx.fillStyle = grad;
	ctx.fillRect(0, 0, size, size);
	
}



function createGradientSlider(pos, col, tex_type){
	
	var newslider = jQuery('<div/>', {
		class: "slider_" + tex_type,
		style: 'left:' + pos + 'px',
	}).appendTo(".slider_area_" + tex_type);
	
	newslider.colpick({
		layout:'rgbhsbhex',
		color: col,
		onChange:function(hsb,hex,rgb,el) {
			$(el).css('background-color', '#'+hex);
			updateTexture('', '', "color");
		},
		onSubmit:function(hsb,hex,rgb,el) {
			$(el).colpickHide();
		}
	}).css('background-color', '#' + col);
	
	
	newslider.draggable({ 
		//axis: "x", 
		grid: [ 1, 50 ],
		containment: ".slider_area_" + tex_type,
		scroll: false,
		drag: function() {
			updateTexture('', '', "color");
		},
	});
}


function multiplyCanvas(src1_canvas, src2_canvas, dest_canvas){
	var max_w = src1_canvas.width, max_h = src1_canvas.height;
	var ctx_src1 = src1_canvas.getContext("2d");
	var imgData_src1 = ctx_src1.getImageData(0,0, max_w, max_h);
	var s1 = imgData_src1.data;

	var ctx_src2;
	var imgData_src2;
	var s2;
	if (src2_canvas){
		ctx_src2 = src2_canvas.getContext("2d");
		imgData_src2 = ctx_src2.getImageData(0,0, max_w, max_h);
		s2 = imgData_src2.data;
	}

	var ctx_dst = dest_canvas.getContext("2d");
	var imgData = ctx_dst.getImageData(0,0, max_w, max_h);
	var d = imgData.data;

	for (var y=0; y<max_h; y++)
	for (var x=0; x<max_w; x++){
		// octaves, persistence, scale, loBound, hiBound, x, y
		var i = (x + y*max_w) * 4;

		d[i]   = (s1[i]/255) * (src2_canvas ? (s2[i]/255) : 1) * 255;
		d[i+1] = (s1[i+1]/255) * (src2_canvas ? (s2[i+1]/255) : 1)* 255;
		d[i+2] = (s1[i+2]/255) * (src2_canvas ? (s2[i+2]/255) : 1) * 255;
		d[i+3] = (s1[i+3]/255) * (src2_canvas ? (s2[i+3]/255) : 1) * 255;
	}
	ctx_dst.putImageData(imgData, 0, 0);
}


