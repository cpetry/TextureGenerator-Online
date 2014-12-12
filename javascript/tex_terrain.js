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
var terrain_colored = true;
var terrain_shadow = true;
var terrain_shadow_x = 100.0;
var terrain_shadow_y = 100.0;

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
createGradientSlider(180, '474038', 'terrain');
createGradientSlider(125, '516b31', 'terrain');
createGradientSlider(40, '22360a', 'terrain');
createGradientSlider(10, '524f21', 'terrain');
//createGradientSlider(0, '222222', 'terrain');


function updateTerrain(effect){
	

	var scale = parseFloat($("#terrain_scale_slider").val());	
	var persistence = parseFloat($("#terrain_detail_slider").val());
	var seed = parseInt($("#terrain_seed").val());
	var min_height = parseFloat($("#terrain_min_height_slider").val());
	var shadow_strength = (1-parseInt($("#terrain_shadow_strength").val()) / 100);

	var sun_height = parseInt($("#terrain_sun_height").val()) * 20 + 255 ;
	var sun_posx = parseInt($("#terrain_shadow_xpos").val());
	var sun_posy = parseInt($("#terrain_shadow_ypos").val());

	if (!effect){
		var before = new Date().getTime();
		setTerrainNoise("FractalNoise", 7, persistence, scale, seed, 1, min_height);
		var after = new Date().getTime();
		
		if (terrain_shadow)
			updateTerrainShadow(terrain_shadow_x, terrain_shadow_y, sun_height, shadow_strength);
		if (terrain_colored)
			updateTerrainColor();
		console.log(after - before);
	}
	else if (effect == "shadow"){
		before = new Date().getTime();
		updateTerrainShadow(terrain_shadow_x, terrain_shadow_y, sun_height, shadow_strength);
		after = new Date().getTime();
		console.log(after - before);
	}
	else if (effect == "shadow_strength"){
		setShadowStrength(shadow_strength);
	}
	else if (effect == "color"){
		before = new Date().getTime();
		updateTerrainColor();
		after = new Date().getTime();
		console.log(after - before);
	}
	
	before = new Date().getTime();
	//console.log(terrain_colored);
	if (terrain_colored && terrain_shadow)
		multiplyCanvas(terrain_color_canvas, terrain_shadow_canvas, document.getElementById("texture_preview"));
	else if (terrain_colored && !terrain_shadow)
		multiplyCanvas(terrain_color_canvas, null, document.getElementById("texture_preview"));
	else if (!terrain_colored && terrain_shadow)
		multiplyCanvas(terrain_shadow_canvas, null, document.getElementById("texture_preview"));
	else
		multiplyCanvas(terrain_height_canvas, null, document.getElementById("texture_preview"));

	after = new Date().getTime();
	console.log(after - before);
}

function updateTerrainShadow(shadow_posx, shadow_posy, sun_height, shadow_strength){
	setTerrainShadow(new Array(shadow_posx, shadow_posy, sun_height), shadow_strength);
}


function updateTerrainColor(){
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
	setTerrainColor(colors);
	after = new Date().getTime();
	console.log(after - before);
}


function setTerrainNoise(type, octaves, persistence, scale, seed, percentage, min_height)
{
	var max_w = 512, max_h = 512;

	terrain_height_canvas.width  = max_w; 	// important! dimensions would be to small otherwise
	terrain_height_canvas.height = max_h;

	var dst = terrain_height_canvas;
	var ctx_dst = dst.getContext("2d");
	var imgData = ctx_dst.getImageData(0,0, max_w, max_h);
	var d = imgData.data;
		
	var scale_s = scale;
	
	var noise_type;
	if (type == "PerlinNoise")
		noise_type = NoiseTypeEnum.PERLINNOISE;
	else if (type == "FractalNoise")
		noise_type = NoiseTypeEnum.FRACTALNOISE;
	else if (type == "Turbulence")
		noise_type = NoiseTypeEnum.TURBULENCE;
		
	var S = new SimplexNoise(seed);

	var max_v = 0, min_v = 255;

	for (var y=0; y<max_h; y++)
	for (var x=0; x<max_w; x++){
		// octaves, persistence, scale, loBound, hiBound, x, y
		var v = S.simplex(noise_type, octaves, persistence, percentage, scale_s, x, y);
		max_v = Math.max(v*255, max_v);
		min_v = Math.min(v*255, min_v);

		v = Math.max(min_height, v);
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
		var v = S.simplex(NoiseTypeEnum.FRACTALNOISE, 1, 0.1, 1, 0.6*scale_s, x, y);
		v=Math.min(v*1.6,1);//v = v / 255;
		var i = (x + y*max_w) * 4;

		d[i]   = v * min_v*20 + ((1.0-v) * d[i]);
		d[i+1] = v * min_v*20 + ((1.0-v) * d[i+1]);
		d[i+2] = v * min_v*20 + ((1.0-v) * d[i+2]);
		//d[i]   = v*255;
		//d[i+1] = v*255;
		//d[i+2] = v*255;
	}

	console.log("max_v: " + max_v);

	
	
	ctx_dst.putImageData(imgData, 0, 0);
}


var buf = new ArrayBuffer(Float32Array.BYTES_PER_ELEMENT);
var fv = new Float32Array(buf);
var lv = new Uint32Array(buf);
var threehalfs = 1.5;

$("#shadow_direction").mousedown(function(e){
	x=(e.pageX - $(this).offset().left) - $(this).width()/2;
	y=(e.pageY - $(this).offset().top) - $(this).height()/2;
	terrain_shadow_x = x * 100;
	terrain_shadow_y = y * 100;
	w=Math.round(Math.atan2(x,y)*(180/Math.PI));
	w=180-w;
	console.log("x: " + x + ", y: " + y);
	console.log("w: " + w);
});

function setTerrainShadow(sun_position, shadow_strengh)
{
	var max_w = 512.0, max_h = 512.0;

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

	var Sun = new Vec3(sun_position[0], sun_position[1], sun_position[2]);
	var CurrentPos = new Vec3(max_w/2.0, max_h/2.0, 0.0);
	var LightDir = new Vec3(0.0,0.0,0.0);
	subtractVec3(LightDir, Sun, CurrentPos);
	normalizeVec3(LightDir);

	var LerpX = 0.0;
	var LerpY = 0.0;

	for (var y=0; y<max_h; y++)
	for (var x=0; x<max_w; x++){

		var i = (x + y*max_w) * 4;
		setVec3(CurrentPos, x, y, s[i]);
		
		d[i] = 255;
		d[i+1] = 255;
		d[i+2] = 255;
		d[i+3] = 255;

		while(CurrentPos.z < 255.0 
			&& CurrentPos.x >= 0.0 && CurrentPos.y >= 0.0
			&& CurrentPos.x < max_w && CurrentPos.y < max_h
			&& CurrentPos != Sun){
			addVec3(CurrentPos, CurrentPos, LightDir);
			LerpX = parseInt(CurrentPos.x + 0.5, 10);
			LerpY = parseInt(CurrentPos.y + 0.5, 10);

			// check for hit
			if ( CurrentPos.z <= s[(LerpX + LerpY*max_w) * 4] ) {
				d[i] = shadow_strengh;
				d[i+1] = shadow_strengh;
				d[i+2] = shadow_strengh;
				break;
			}
		}
	}
	ctx_dst.putImageData(imgData_dst, 0, 0);
}


function setShadowStrength(strength){
	var max_w = 512, max_h = 512;

	var dst = terrain_shadow_canvas;
	var ctx_dst = dst.getContext("2d");
	var imgData_dst = ctx_dst.getImageData(0,0, max_w, max_h);
	var d = imgData_dst.data;

	strength *= 255;

	for (var y=0; y<max_h; y++)
	for (var x=0; x<max_w; x++){
		var i = (x + y*max_w) * 4;
		if (d[i] < 255){
			d[i] = strength;
			d[i+1] = strength;
			d[i+2] = strength;
		}
	}
	ctx_dst.putImageData(imgData_dst, 0, 0);
}

function setTerrainColor(colors){
	var max_w = 512, max_h = 512;

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


function switchTerrainShadow(){
	terrain_shadow = !terrain_shadow;
}