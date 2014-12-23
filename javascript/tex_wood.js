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
	color: {h:35, s:46, b:29},
	onChange:function(hsb,hex,rgb,el) {
		$(el).css('background-color', '#'+hex);
		updateTexture();
	},
	onSubmit:function(hsb,hex,rgb,el) {
		$(el).colpickHide();
	}
}).css('background-color', '#4a3c28');


$('#wood_color3').colpick({
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
	var color3 = rgb2hex($("#wood_color3").css("background-color"));

	var scale = parseFloat($("#wood_scale").val());
	//var scale_y = parseFloat($("#perlin_noise_scale_y").val());
	
	var persistence = parseFloat($("#wood_detail").val());
	var percentage = 1;
	
	var seed = parseInt($("#wood_seed").val());
	var x_scale = parseInt($("#wood_x").val());wood_planks
	var nmb_planks = parseInt($("#wood_planks").val());
	var type = $("#wood_type>option:selected").val();
	//document.write(type);
	setWood(canvas, size, color1, color2, color3, type, x_scale, persistence, scale, seed, percentage, nmb_planks);
}

function setWood(canvas, size, color1, color2, color3, type, x_scale, persistence, scale, seed, percentage, nmb_planks)
{
	var c = canvas;
	var ctx = c.getContext("2d");

	var max_w = size, max_h = size;
	
	var S = new SimplexNoise(seed);
	
	var imgData = ctx.getImageData(0,0, max_w, max_h);
	var d = imgData.data;
	
	var col1_rgb = hexToRgb(color1);
	var col2_rgb = hexToRgb(color2);
	var col3_rgb = hexToRgb(color3);
	var scale_s = scale;
	
	var before = new Date().getTime();
	var i=0;
	for(var y = 0; y < max_h; y++)
	for(var x = 0; x < max_w; x++)
    {   
		var v = S.simplex(NoiseTypeEnum.PERLINNOISE, size, 1*2, persistence, 1, scale_s*55, x*x_scale*2, y/x_scale);
		v = v * (S.simplex(NoiseTypeEnum.PERLINNOISE, size, 1, persistence, 1, scale_s*5, x*x_scale, y) - 0.5) ;
		v += 0.5;
		
        d[i]   = v * 255;
		d[i+1] = v * 255;
		d[i+2] = v * 255;
		d[i+3] = 255;
		i += 4;
    }
    
	i =0;
	/**/
    for(var y = 0; y < max_h; y++)
	for(var x = 0; x < max_w; x++)
    {   
		var v = S.simplex(NoiseTypeEnum.PERLINNOISE, size, 1, persistence, 1, scale_s, x*x_scale, y);
		v = v * persistence * 20;
		v = v - parseInt(v);
		//v = 6 * Math.pow(v,5) - 15 * Math.pow(v,4) + 10 * Math.pow(v,3);
		//if (v < 0.1 || v > 0.9){
		//	v = v/2 * (2-v*2);
		//}
		v *= d[i]/255;
		v = Math.sqrt(v);
		//v -= 0.5;
		//v *= 2;
		var trg = 1 - 2*Math.acos((1 - 0.1)*Math.sin(2*Math.PI*((2*v - 1)/4)))/Math.PI;
		v = (trg*Math.sqrt(v));
		//v += 1;
		//v *= 2;
		
        d[i]   = v * col1_rgb.r + ((1.0-v) * col2_rgb.r);
		d[i+1] = v * col1_rgb.g + ((1.0-v) * col2_rgb.g);
		d[i+2] = v * col1_rgb.b + ((1.0-v) * col2_rgb.b);
		d[i+3] = 255;
		i += 4;
    }

    //gaussianblur(imgData, size, size, 2);
	
	
	i=0;
	for(var y = 0; y < max_h; y++)
	for(var x = 0; x < max_w; x++)
    {   
		i += 4;
		var v = S.simplex(NoiseTypeEnum.TURBULENCE, size, 1, persistence, 1, (nmb_planks-1)*(nmb_planks-1), x, y/size);
		v = Math.min(v*20,1);
        //v = v * (d[i]/255);
        d[i]   = v * d[i]   + ((1.0-v) * col3_rgb.r);
		d[i+1] = v * d[i+1] + ((1.0-v) * col3_rgb.g);
		d[i+2] = v * d[i+2] + ((1.0-v) * col3_rgb.b);
		d[i+3] = 255;
    }
	

	var after = new Date().getTime();
	//console.log("noise: " + (after-before));
	
	ctx.putImageData(imgData, 0, 0);
}