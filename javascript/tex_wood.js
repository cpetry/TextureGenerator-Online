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


$('#wood_color1').colpick({
	layout:'rgbhsbhex',
	color: {h:35, s:15, b:90},
	hue:200,
	onChange:function(hsb,hex,rgb,el) {
		$(el).css('background-color', '#'+hex);
		updateTexture();
	},
	onSubmit:function(hsb,hex,rgb,el) {
		$(el).colpickHide();
	}
}).css('background-color', '#e6d7c3');


$('#wood_color2').colpick({
	layout:'rgbhsbhex',
	color: {h:35, s:20, b:10},
	onChange:function(hsb,hex,rgb,el) {
		$(el).css('background-color', '#'+hex);
		updateTexture();
	},
	onSubmit:function(hsb,hex,rgb,el) {
		$(el).colpickHide();
	}
}).css('background-color', '#1a1714');

function updateWood(canvas, size){
	var color1 = rgb2hex($("#wood_color1").css("background-color"));
	var color2 = rgb2hex($("#wood_color2").css("background-color"));

	var scale = parseFloat($("#wood_scale").val());
	//var scale_y = parseFloat($("#perlin_noise_scale_y").val());
	
	var persistence = parseFloat($("#wood_detail").val());
	var percentage = 1;
	
	var seed = parseInt($("#wood_seed").val());
	var octaves = parseInt($("#wood_octaves").val());
	
	var type = $("#wood_type>option:selected").val();
	//document.write(type);
	setWood(canvas, size, color1, color2, type, octaves, persistence, scale, seed, percentage);
}

function setWood(canvas, size, color1, color2, type, octaves, persistence, scale, seed, percentage)
{
	var c = canvas;
	var ctx = c.getContext("2d");

	var max_w = size, max_h = size;
	
	var S = new SimplexNoise(seed);
	
	var imgData = ctx.getImageData(0,0, max_w, max_h);
	var d = imgData.data;
	
	var col1_rgb = hexToRgb(color1);
	var col2_rgb = hexToRgb(color2);
	var scale_s = scale;
	
	var before = new Date().getTime();
	
    for(var y = 0; y < max_h; y++)
	for(var x = 0; x < max_w; x++)
    {   
		var i = (x + y*max_w) * 4;
		var v = S.simplex(NoiseTypeEnum.PERLINNOISE, size, octaves, persistence, 1, scale_s, x*5, y*2);
        v = v * persistence* 20;
		v = v - parseInt(v);
		if (v < 0.1 || v > 0.9)
			v = v * (1-v);
			
        d[i]   = v * col1_rgb.r + ((1.0-v) * col2_rgb.r);
		d[i+1] = v * col1_rgb.g + ((1.0-v) * col2_rgb.g);
		d[i+2] = v * col1_rgb.b + ((1.0-v) * col2_rgb.b);
		d[i+3] = 255;
    }
	
	for(var y = 0; y < max_h; y++)
	for(var x = 0; x < max_w; x++)
    {   
		var i = (x + y*max_w) * 4;
		var v = S.simplex(NoiseTypeEnum.TURBULENCE, size, octaves, persistence, 1, scale_s, x*20, y);
		v = Math.min(v*20,1);
        v = v * (d[i]/255);
        d[i]   = v * col1_rgb.r + ((1.0-v) * col2_rgb.r);
		d[i+1] = v * col1_rgb.g + ((1.0-v) * col2_rgb.g);
		d[i+2] = v * col1_rgb.b + ((1.0-v) * col2_rgb.b);
		d[i+3] = 255;
    }
	

	var after = new Date().getTime();
	//console.log("noise: " + (after-before));
	
	ctx.putImageData(imgData, 0, 0);
}