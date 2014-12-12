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


$('#perlin_noise_color1').colpick({
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


$('#perlin_noise_color2').colpick({
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

function updatePerlinNoise(){
	var color1 = rgb2hex($("#perlin_noise_color1").css("background-color"));
	var color2 = rgb2hex($("#perlin_noise_color2").css("background-color"));

	var scale = parseFloat($("#perlin_noise_scale").val());
	//var scale_y = parseFloat($("#perlin_noise_scale_y").val());
	
	var persistence = parseFloat($("#perlin_noise_detail").val());
	var percentage = 1;
	
	var seed = parseInt($("#perlin_noise_seed").val());
	var octaves = parseInt($("#perlin_noise_octaves").val());
	
	var type = $("#perlin_noise_type>option:selected").val();
	//document.write(type);
	setPerlinNoise(color1, color2, type, octaves, persistence, scale, seed, percentage);
}

function setPerlinNoise(color1, color2, type, octaves, persistence, scale, seed, percentage)
{
	
	
	var c = document.getElementById("texture_preview");
	var ctx = c.getContext("2d");

	var max_w = 512, max_h = 512;
	
	var S = new SimplexNoise(seed);
	
	var imgData = ctx.getImageData(0,0, max_w, max_h);
	var d = imgData.data;
	
	var col1_rgb = hexToRgb(color1);
	var col2_rgb = hexToRgb(color2);
	console.log (col1_rgb);
	var scale_s = scale;
	
	
	
	var before = new Date().getTime();

	var noise_type;
	if (type == "PerlinNoise")
		noise_type = NoiseTypeEnum.PERLINNOISE;
	else if (type == "FractalNoise")
		noise_type = NoiseTypeEnum.FRACTALNOISE;
	else if (type == "Turbulence")
		noise_type = NoiseTypeEnum.TURBULENCE;
	
	for (var y=0; y<max_h; y++)
	for (var x=0; x<max_w; x++){
		// octaves, persistence, scale, loBound, hiBound, x, y
		var v = S.simplex(noise_type, octaves, persistence, percentage, scale_s, x, y);
		//v = v * lo_hi_mul + lo_hi_add; // not sure what this does...
		//if (type == "PerlinNoise")
			//v = (v + 1.0) / 2.0; //interval [0,1]. 
		var i = (x + y*max_w) * 4;
		d[i]   = v * col1_rgb.r + ((1.0-v) * col2_rgb.r);
		d[i+1] = v * col1_rgb.g + ((1.0-v) * col2_rgb.g);
		d[i+2] = v * col1_rgb.b + ((1.0-v) * col2_rgb.b);
		d[i+3] = 255;
	}
	
	/*
	for (var i=0; i<d.length; i += 4) {
		// octaves, persistence, scale, loBound, hiBound, x, y
		var pix = (i/4);
		var v = S.simplex(type, octaves, 1.0-persistence, scale_s, 0, 1, pix.fastmod(max_w), pix / max_w);
		v = (v + 1) / 2; //interval [0,1]. 
		v = Math.min(v+(1-percentage), 1);
		d[i] = v * col1_rgb.r + ((1.0-v) * col2_rgb.r);
		d[i+1] = v * col1_rgb.g + ((1.0-v) * col2_rgb.g);
		d[i+2] = v * col1_rgb.b + ((1.0-v) * col2_rgb.b);
		d[i+3] = 255;
	}*/
	
	var after = new Date().getTime();
	//console.log("noise: " + (after-before));
	
	ctx.putImageData(imgData, 0, 0);
	
	
	/* one solution
	
	var imageObject=new Image();
    imageObject.onload=function(){
        
        ctx.clearRect(0,0, max_w, max_h);
        ctx.scale(scale_x, scale_y);
        ctx.drawImage(imageObject, 0, 0);
		ctx.scale(1/scale_x, 1/scale_y);
		
		var new_img_data = ctx.getImageData(0,0, max_w, max_h);
		gaussianblur(new_img_data, max_w, max_h, (scale_x-1 + scale_y-1));
		
		ctx.putImageData(new_img_data, 0, 0);
        
    }
    imageObject.src=c.toDataURL();
	*/
}