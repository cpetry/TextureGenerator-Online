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


var terrain_height_canvas = document.createElement("canvas");
var terrain_color_canvas = document.createElement("canvas");
var terrain_shadow_canvas = document.createElement("canvas");
var terrain_type = "mountains";
var terrain_colored = true;
var terrain_shadow = true;
var terrain_shadow_x = -1400.0;
var terrain_shadow_y = -1400.0;

drawSunPositionCanvas(terrain_shadow_x/100, terrain_shadow_y/100);

$(".slider_area_terrain" ).click(function(evt) {
	var x = Math.min(Math.max(evt.pageX - $(this).offset().left, 0), 255);
	
	createGradientSlider(x, 'ffffff', 'terrain');
	
	updateTerrainColor();
	//alert( "Position: " + x );
});

$(".slider_area_terrain").droppable({
	out: function (event, ui) {
		//document.write($(ui.draggable).position().left);
		if ($(ui.draggable).position().left < 250)
			$(ui.draggable).remove();
    }
});

//createGradientSlider(256, 'eeeeee', 'terrain');
createGradientSlider(240, 'ffffff', 'terrain');
createGradientSlider(180, '686359', 'terrain');
createGradientSlider(125, '809A60', 'terrain');
createGradientSlider(40, '3A4F22', 'terrain');
createGradientSlider(10, '60632e', 'terrain');
//createGradientSlider(0, '222222', 'terrain');


function updateTerrain(canvas, size, effect){
	

	var scale = parseFloat($("#terrain_scale_slider").val());	
	var persistence = parseFloat($("#terrain_detail_slider").val());
	var seed = parseInt($("#terrain_seed").val());
	var height = 1-parseFloat($("#terrain_height_slider").val());
	var shadow_strength = (1-parseInt($("#terrain_shadow_strength_slider").val()) / 100);

	var sun_height = parseInt($("#terrain_shadow_sun_height_slider").val()) * 40 + 255;
	sun_height = sun_height*(512/size);
	//var sun_posx = parseInt($("#terrain_shadow_xpos").val());
	//var sun_posy = parseInt($("#terrain_shadow_ypos").val());

	
	if (!effect){
		var before = new Date().getTime();
		if (terrain_type == "mountains")
			setTerrainMountain(size, persistence, scale, seed, height);
		else if(terrain_type == "sand")
			setTerrainSand(size, persistence, scale, seed, height);
		
		var after = new Date().getTime();
		
		if (terrain_shadow)
			updateTerrainShadow(size, terrain_shadow_x, terrain_shadow_y, sun_height, shadow_strength);
		if (terrain_colored)
			updateTerrainColor(size);
	}
	else if (effect == "shadow"){
		before = new Date().getTime();
		updateTerrainShadow(size, terrain_shadow_x, terrain_shadow_y, sun_height, shadow_strength);
		after = new Date().getTime();
	}
	else if (effect == "shadow_strength"){
		setShadowStrength(shadow_strength);
	}
	else if (effect == "color"){
		before = new Date().getTime();
		updateTerrainColor(size);
		after = new Date().getTime();
	}
	
	before = new Date().getTime();
	//console.log(terrain_colored);
	if (terrain_colored && terrain_shadow)
		multiplyCanvas(terrain_color_canvas, terrain_shadow_canvas, canvas);
	else if (terrain_colored && !terrain_shadow)
		multiplyCanvas(terrain_color_canvas, null, canvas);
	else if (!terrain_colored && terrain_shadow)
		multiplyCanvas(terrain_shadow_canvas, null, canvas);
	else
		multiplyCanvas(terrain_height_canvas, null, canvas);

	after = new Date().getTime();
}

function updateTerrainShadow(size, shadow_posx, shadow_posy, sun_height, shadow_strength){
	setTerrainShadow(size, new Array(shadow_posx, shadow_posy, sun_height), shadow_strength);
}


function updateTerrainColor(size){
	if (!size)
		size = 512;
	
	var colors = [];
	var colors_hex = [];
	
	$(".slider_terrain").each(function( index ) {
		var pos = $(this).css("left");
		pos = pos.substring(0, pos.length - 2);
		var percentage = Math.min(parseFloat(pos), 255) / 2.56;
	
		colors.push([$(this).css("background-color").match(/\d+/g), percentage]);
		colors_hex.push([rgb2hex($(this).css("background-color")), percentage]);
	});

	colors.sort(percentage_compare);
	colors_hex.sort(percentage_compare);
	

	var gradient_text = 'linear-gradient(to right';
	colors_hex.forEach(function(col) {
		gradient_text += ', ' + col[0] + ' ' + Math.max(col[1],0) + '%';
	});
	$(".terrain_gradient_preview").css('background', gradient_text); // W3C


	//console.log(colors);
	for (var c = 0; c < colors.length; c++) {
		colors[c][0][0] = parseFloat(colors[c][0][0]);
		colors[c][0][1] = parseFloat(colors[c][0][1]);
		colors[c][0][2] = parseFloat(colors[c][0][2]);
		colors[c][1] = colors[c][1] / 100;
		//console.log("r: " + colors[c][0][0] +  " g:" + colors[c][0][1] + " b:" + colors[c][0][2] +" percentage: "  + colors[c][1]);
	}

	before = new Date().getTime();
	setTerrainColor(size, colors);
	after = new Date().getTime();
}


function setTerrainSand(size, persistence, scale, seed, min_height){
	var max_w = size, max_h = size;

	terrain_height_canvas.width  = max_w; 	// important! dimensions would be to small otherwise
	terrain_height_canvas.height = max_h;

	console.log(size);
	
	var dst = terrain_height_canvas;
	var ctx_dst = dst.getContext("2d");
	var imgData = ctx_dst.getImageData(0,0, max_w, max_h);
	var d = imgData.data;
		
	var scale_s = scale;
	
	var noise_type = NoiseTypeEnum.FRACTALNOISE;
	var octaves = 7;
	var percentage = 1;
	var S = new SimplexNoise(seed);

	var max_v = 0, min_v = 255;

	for (var y=0; y<max_h; y++)
	for (var x=0; x<max_w; x++){
		// octaves, persistence, scale, loBound, hiBound, x, y
		var v = S.simplex(noise_type, size, octaves, persistence, percentage, scale_s, x, y);
		max_v = Math.max(v*255, max_v);
		min_v = Math.min(v*255, min_v);

		var i = (x + y*max_w) * 4;

		d[i]   = v * 255 + ((1.0-v) * 0);
		d[i+1] = v * 255 + ((1.0-v) * 0);
		d[i+2] = v * 255 + ((1.0-v) * 0);
		d[i+3] = 255;
	}

	for (var y=0; y<max_h; y++)
	for (var x=0; x<max_w; x++){
		var i = (x + y*max_w) * 4;
		var v = ((d[i] + min_v) / max_v) * 255;
		d[i] = v;
		d[i+1] = v;
		d[i+2] = v;
	}

	for (var y=0; y<max_h; y++)
	for (var x=0; x<max_w; x++){
		// octaves, persistence, scale, loBound, hiBound, x, y
		var v = S.simplex(NoiseTypeEnum.PERLINNOISE, size, 3, 0.2, 1, 0.8*scale_s, x, y);
		v=Math.min(v*(1+(1-min_height/4)) - min_height,1);//v = v / 255;
		v = Math.max(v, 0 );
		v = v*v;
		var i = (x + y*max_w) * 4;
		var old = d[i];
		//var v = Math.max((1-v) - 0.7, 0);

		d[i]   = v * old;
		d[i+1] = v * old;
		d[i+2] = v * old;
	}

	
	
	ctx_dst.putImageData(imgData, 0, 0);
}

function setTerrainMountain(size, persistence, scale, seed, min_height)
{
	var max_w = size, max_h = size;

	terrain_height_canvas.width  = max_w; 	// important! dimensions would be to small otherwise
	terrain_height_canvas.height = max_h;

	console.log(size);
	
	var dst = terrain_height_canvas;
	var ctx_dst = dst.getContext("2d");
	var imgData = ctx_dst.getImageData(0,0, max_w, max_h);
	var d = imgData.data;
		
	var scale_s = scale;
	
	var noise_type = NoiseTypeEnum.FRACTALNOISE;
	var octaves = 7;
	var percentage = 1;
	var S = new SimplexNoise(seed);

	var max_v = 0, min_v = 255;

	for (var y=0; y<max_h; y++)
	for (var x=0; x<max_w; x++){
		// octaves, persistence, scale, loBound, hiBound, x, y
		var v = S.simplex(noise_type, size, octaves, persistence, percentage, scale_s, x, y);
		max_v = Math.max(v*255, max_v);
		min_v = Math.min(v*255, min_v);

		var i = (x + y*max_w) * 4;

		d[i]   = v * 255 + ((1.0-v) * 0);
		d[i+1] = v * 255 + ((1.0-v) * 0);
		d[i+2] = v * 255 + ((1.0-v) * 0);
		d[i+3] = 255;
	}

	for (var y=0; y<max_h; y++)
	for (var x=0; x<max_w; x++){
		var i = (x + y*max_w) * 4;
		var v = ((d[i] + min_v) / max_v) * 255;
		d[i] = v;
		d[i+1] = v;
		d[i+2] = v;
	}

	for (var y=0; y<max_h; y++)
	for (var x=0; x<max_w; x++){
		// octaves, persistence, scale, loBound, hiBound, x, y
		var v = S.simplex(NoiseTypeEnum.PERLINNOISE, size, 3, 0.2, 1, 0.8*scale_s, x, y);
		v=Math.min(v*Math.max((1+(1-min_height/4)) - min_height, 0),1);//v = v / 255;
		v = v*v;
		var i = (x + y*max_w) * 4;
		var old = d[i];
		//var v = Math.max((1-v) - 0.7, 0);

		d[i]   = v * old;
		d[i+1] = v * old;
		d[i+2] = v * old;
	}

	
	
	ctx_dst.putImageData(imgData, 0, 0);
}


var buf = new ArrayBuffer(Float32Array.BYTES_PER_ELEMENT);
var fv = new Float32Array(buf);
var lv = new Uint32Array(buf);
var threehalfs = 1.5;



function drawSunPositionCanvas(x, y){
	var canvas = document.getElementById("terrain_shadow_position_canvas");
	var context = canvas.getContext('2d');
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var radius = 24;
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    var grd = context.createRadialGradient(x+centerX, y+centerY, 2, x+centerX, y+centerY, 25);
    // light blue
    grd.addColorStop(0, '#8EA6EF');
    // dark blue
    grd.addColorStop(1, '#003C73');
    context.fillStyle = grd;
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = '#444444';
    context.stroke();
}

$("#terrain_shadow_position_canvas").mousedown(function(e){
	x=(e.pageX - $(this).offset().left) - $(this).width()/2;
	y=(e.pageY - $(this).offset().top) - $(this).height()/2;
	terrain_shadow_x = x * 100;
	terrain_shadow_y = y * 100;
	w=Math.round(Math.atan2(x,y)*(180/Math.PI));
	w=180-w;
	drawSunPositionCanvas(x,y);
});

function setTerrainShadow(size, sun_position, shadow_strengh)
{
	var max_w = size, max_h = size;

	terrain_shadow_canvas.width  = max_w; 	// important! dimensions would be to small otherwise
	terrain_shadow_canvas.height = max_h;

	var dst = terrain_shadow_canvas;
	var ctx_dst = dst.getContext("2d");
	var imgData_dst = ctx_dst.getImageData(0,0, max_w, max_h);
	var d = imgData_dst.data;

	var src = terrain_height_canvas;
	var ctx_src = src.getContext("2d");
	var imgData_src = ctx_src.getImageData(0,0, max_w, max_h);
	var s = imgData_src.data;

	shadow_strengh *= 255.0;

	//var Sun = new Vec3(sun_position[0], sun_position[1], sun_position[2]);
	//var CurrentPos = new Vec3(max_w/2.0, max_h/2.0, 0.0);
	//var LightDir = new Vec3(0.0,0.0,0.0);
	//subtractVec3(LightDir, Sun, CurrentPos);
	//normalizeVec3(LightDir);

	var LerpX = 0.0;
	var LerpY = 0.0;
	var i = 0;
	
	for (var y=0; y<max_h; y++)
	for (var x=0; x<max_w; x++){
		d[i] = 255;
		d[i+1] = 255;
		d[i+2] = 255;
		d[i+3] = 255;

		// midpoint algorithm
		var dx = Math.abs(x - sun_position[0]);
		var dy = Math.abs(y - sun_position[1]);
		var curr_height = s[i];
		var dz = Math.abs(sun_position[2] - curr_height);
		var dz_x = dx * 1.0/(dx+dy) * dz  / dx;
		var dz_y = dy * 1.0/(dx+dy) * dz  / dy;
		var f = dy - parseInt(dx / 2.0);

		var incrfar=0;
		var incrnear=0;
		var incr_z_far = 0.0;
		var incr_z_near = 0.0;

		var lfar, lnear, deltafar, deltanear;
		if (dy > dx){
			deltafar = dy;
			deltanear = dx;
			lfar = y;
			lnear = x;
			if (y > sun_position[1])
				incrfar = -1;
			else
				incrfar = 1;
			if (x > sun_position[0])
				incrnear = -1;
			else
				incrnear = 1;
			incr_z_far = dz_y;
			incr_z_near = dz_x;
		}
		else{
			deltafar = dx;
			deltanear = dy;
			lfar = x;
			lnear = y;
			if (y > sun_position[1])
				incrnear = -1;
			else
				incrnear = 1;
			if (x > sun_position[0])
				incrfar = -1;
			else
				incrfar = 1;
			incr_z_far = dz_x;
			incr_z_near = dz_y;
		}

		for (var p = 1; p < deltafar; p++) {
			var i_x=0, i_y=0;
			if (dy > dx){
				i_x = lnear;
				i_y = lfar;
			}
			else{
				i_x = lfar;
				i_y = lnear;
			}
				

			if (i_x >= 0.0 && i_y >= 0.0 && i_x < max_w && i_y < max_h && curr_height < 255){
				if ( curr_height < s[(i_x + i_y*max_w) * 4]) {
					var shadow = shadow_strengh;// * (1-(1/(p)));
					d[i] = shadow;
					d[i+1] = shadow;
					d[i+2] = shadow;
					//console.log("x = " + i_x + ", y = " + i_y + ", h =" + curr_height + " s[i]=" +  s[(i_x + i_y*max_w) * 4]);
					break;
				}
			}
			else
				break;

			lfar += incrfar;
			curr_height += incr_z_far;
			if (f > 0) {
				lnear += incrnear;
				curr_height += incr_z_near;
				f -= deltafar;
			}
			f += deltanear;
		}
		i += 4;
	}
	//gaussianblur(imgData_dst, max_w, max_h, 1);
	ctx_dst.putImageData(imgData_dst, 0, 0);
}


function setShadowStrength(size, strength){
	var max_w = size, max_h = size;

	var dst = terrain_shadow_canvas;
	var ctx_dst = dst.getContext("2d");
	var imgData_dst = ctx_dst.getImageData(0,0, max_w, max_h);
	var d = imgData_dst.data;

	strength *= 255;
	var i = 0;
	for (var y=0; y<max_h; y++)
	for (var x=0; x<max_w; x++){
		
		if (d[i] < 255){
			d[i] = strength;
			d[i+1] = strength;
			d[i+2] = strength;
		}
		i += 4;
	}
	ctx_dst.putImageData(imgData_dst, 0, 0);
}

function setTerrainColor(size, colors){
	var max_w = size, max_h = size;

	terrain_color_canvas.width  = max_w; 	// important! dimensions would be to small otherwise
	terrain_color_canvas.height = max_h;

	var dest = terrain_color_canvas;
	var ctx_dest = dest.getContext("2d");
	var imgData_dest = ctx_dest.getImageData(0,0, max_w, max_h);
	var d = imgData_dest.data;
	
	var src = terrain_height_canvas;
	var ctx_src = src.getContext("2d");
	var imgData_src = ctx_src.getImageData(0,0, max_w, max_h);
	var s = imgData_src.data;

	for (var y=0; y<max_h; y++)
	for (var x=0; x<max_w; x++){
		var i = (x + y*max_w) * 4;
		var v = s[i] / 255;

		if (colors[0][1] > v){
			d[i]   = colors[0][0][0];
			d[i+1] = colors[0][0][1];
			d[i+2] = colors[0][0][2];
			d[i+3] = 255;
		}
		else{
			for (var col = 1; col < colors.length; col++) {
				if (colors[col][1] > v){
					var per = 1-(v - colors[col-1][1]) / (colors[Math.min(col, colors.length-1)][1] - colors[col-1][1]);
					d[i]   = per * colors[col-1][0][0] + ((1.0-per) * colors[Math.min(col,colors.length-1)][0][0]);
					d[i+1] = per * colors[col-1][0][1] + ((1.0-per) * colors[Math.min(col,colors.length-1)][0][1]);
					d[i+2] = per * colors[col-1][0][2] + ((1.0-per) * colors[Math.min(col,colors.length-1)][0][2]);
					d[i+3] = 255;
					col = colors.length;
				}
			}
		}
		if (v > colors[colors.length-1][1]){
			d[i]   = colors[colors.length-1][0][0];
			d[i+1] = colors[colors.length-1][0][1];
			d[i+2] = colors[colors.length-1][0][2];
			d[i+3] = 255;
		}
	}

	ctx_dest.putImageData(imgData_dest, 0, 0);
}


function switchTerrainColored(){
	terrain_colored = !terrain_colored;

	if (terrain_colored){
		$(".terrain_gradient_preview").show();
		$(".slider_area_terrain").show();
	}
	else{
		$(".terrain_gradient_preview").hide();
		$(".slider_area_terrain").hide();
	}
}


function setTerrainType(){
	var select_terrain_type = document.getElementById('terrain_type');
	terrain_type = select_terrain_type.options[select_terrain_type.selectedIndex].value;
}

function switchTerrainShadow(){
	terrain_shadow = !terrain_shadow;
}