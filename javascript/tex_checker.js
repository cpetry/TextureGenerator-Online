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


$('#checker_color1').colpick({
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


$('#checker_color2').colpick({
	layout:'rgbhsbhex',
	color: {h:35, s:20, b:40},
	onChange:function(hsb,hex,rgb,el) {
		$(el).css('background-color', '#'+hex);
		updateTexture();
	},
	onSubmit:function(hsb,hex,rgb,el) {
		$(el).colpickHide();
	}
}).css('background-color', '#665e52');


function updateChecker(canvas, size){
	var color1 = rgb2hex($("#checker_color1").css("background-color"));
	var color2 = rgb2hex($("#checker_color2").css("background-color"));

	var x_checker = parseInt($("#checker_x").val());
	var y_checker = parseInt($("#checker_y").val());
	
	var seed = parseInt($("#checker_seed").val());
	var percentage1 = parseInt($("#checker_percentage").val()) / 100.0;

	setChecker(canvas, size, x_checker, y_checker, color1, color2, seed, percentage1);
}

function setChecker(canvas, size, x_checker, y_checker, color1, color2, seed, percentage1)
{
	var c = canvas;
	var ctx = c.getContext("2d");

	var max_w = size, max_h = size;
	
	// color2
	ctx.fillStyle = color2; // hex col
	ctx.fillRect(0,0,max_w,max_h); // fillRect(x,y,width,height)

	var checker_width  = max_w / x_checker; 
	var checker_height = max_h / y_checker; 
	var incr_seed = seed;

	for (var y=0; y < y_checker; y++)
		for (var x=0; x < x_checker; x++)
			if ((x+y) % 2 == 0 && random10Seed(incr_seed++, percentage1) < 1)
				drawCheckerRectangle(ctx, checker_width * x, checker_height * y, checker_width, checker_height, color1);
}

function drawCheckerRectangle(ctx, start_x, start_y, width, height, col){
	ctx.fillStyle = col;
	ctx.fillRect(start_x, start_y, width, height);
}