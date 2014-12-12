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

$('#clouds_color1').colpick({
	layout:'rgbhsbhex',
	color: {h:300, s:0, b:100},
	hue:200,
	onChange:function(hsb,hex,rgb,el) {
		$(el).css('background-color', '#'+hex);
		updateTexture();
	},
	onSubmit:function(hsb,hex,rgb,el) {
		$(el).colpickHide();
	}
}).css('background-color', '#ffffff');


$('#clouds_color2').colpick({
	layout:'rgbhsbhex',
	color: {h:216, s:68, b:51},
	onChange:function(hsb,hex,rgb,el) {
		$(el).css('background-color', '#'+hex);
		updateTexture();
	},
	onSubmit:function(hsb,hex,rgb,el) {
		$(el).colpickHide();
	}
}).css('background-color', '#2a4d82');

function updateClouds(){
	var color1 = rgb2hex($("#clouds_color1").css("background-color"));
	var color2 = rgb2hex($("#clouds_color2").css("background-color"));

	var scale = parseFloat($("#clouds_scale").val()) * 2;
	
	var persistence = parseFloat($("#clouds_detail").val());
	var percentage = parseFloat($("#clouds_percentage").val());
	
	var seed = parseInt($("#clouds_seed").val());
	var octaves = parseInt($("#clouds_octaves").val());
	
	var type = "PerlinNoise";//$("#perlin_noise_type>option:selected").val();
	//document.write(type);
	setPerlinNoise(color1, color2, type, 7, persistence, scale, seed, percentage);
}