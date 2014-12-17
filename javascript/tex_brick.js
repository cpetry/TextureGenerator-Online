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

$('#brick_color').colpick({
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


$('#brick_gradient_color').colpick({
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

$('#brick_grout_color').colpick({
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


function updateBrick(canvas, size){
	var brick_color = rgb2hex($("#brick_color").css("background-color"));
	var grout_color = rgb2hex($("#brick_grout_color").css("background-color"));
	var gradient_color = rgb2hex($("#brick_gradient_color").css("background-color"));
	
	var pattern = $("input[name='brick_pattern']:checked").val();
	var groutspace = parseInt($("#brick_grout_width").val());
	var brick_gradient = $('#BrickGradient').prop('checked') ? parseInt($("#brick_gradient").val()): 0;
	
	groutspace = groutspace*(size/512);
	brick_gradient = brick_gradient*(size/512);
	
	var count_x = parseInt($("#brick_x").val());
	var count_y = parseInt($("#brick_y").val());

	var c = canvas;
	var ctx = c.getContext("2d");

	var max_w = size, max_h = size;
	var width = parseInt(max_w / count_x + 0.5);
	var height = parseInt(max_h / count_y + 0.5);
	

	switch(pattern){
		case "straight":
			createStraightPattern(ctx, width, height, count_x, count_y, groutspace, brick_gradient, brick_color, grout_color, gradient_color);
			break;

		case "block_wide":
			createWideBlockPattern(ctx, width, height, count_x, count_y, groutspace, brick_gradient, brick_color, grout_color, gradient_color);
			break;

		case "block":
			createBlockPattern(ctx, width, height, count_x, count_y, groutspace, brick_gradient, brick_color, grout_color, gradient_color);
			break;

		case "circle":
			createCirclePattern(ctx, width, height, count_x, count_y, groutspace, brick_gradient, brick_color, grout_color, gradient_color);
			break;

		case "edges":
			createEdgesPattern(ctx, width, height, count_x, count_y, groutspace, brick_gradient, brick_color, grout_color, gradient_color);
			break;

		case "star":
			break;

		default:
			document.write("should not happen!");
			break;
	}

	
}


function createStraightPattern(ctx, width, height, count_x, count_y, groutspace, brick_gradient, brick_color, grout_color, gradient_color){
	var half_height = parseInt(height/2.0 + 0.5);

	for (var y = 0; y < count_y+1; y++){
		for (var x = 0; x < count_x+1; x++){
			if (x%2 == 1){
				drawBrickRectangle(ctx, groutspace, brick_gradient, brick_color, grout_color, gradient_color, x*width, y*height - half_height, width, height);
			}
			else
				drawBrickRectangle(ctx, groutspace, brick_gradient, brick_color, grout_color, gradient_color, x*width, y*height, width, height);
		}
	}
}

function createWideBlockPattern(ctx, width, height, count_x, count_y, groutspace, brick_gradient, brick_color, grout_color, gradient_color){
	width = parseInt(width / 2.0 + 0.5);
	height = parseInt(height / 2.0 + 0.5);
	count_y *= 2;
	count_x *= 2;

	ctx.fillStyle = grout_color;
	ctx.fillRect(0, 0, 256, 256);

	for (var y = 0; y < count_y+1; y+=2){
		for (var x = 0; x < count_x+1; x+=3){
			drawBrickRectangle(ctx, groutspace, brick_gradient, brick_color, grout_color, gradient_color, x*width, y*height, width, height*2);
			drawBrickRectangle(ctx, groutspace, brick_gradient, brick_color, grout_color, gradient_color, x*width + width, y*height, width*2, height);
			drawBrickRectangle(ctx, groutspace, brick_gradient, brick_color, grout_color, gradient_color, x*width + width, y*height + height, width*2, height);
		}
	}
}

function createBlockPattern(ctx, width, height, count_x, count_y, groutspace, brick_gradient, brick_color, grout_color, gradient_color){
	width = parseInt(width / 2.0 + 0.5);
	height = parseInt(height / 2.0 + 0.5);
	count_y *= 2;
	count_x *= 2;
	
	for (var y = 0; y < count_y+1; y+=2){
		for (var x = 0; x < count_x+1; x+=2){
			if ((x + y) % 4 == 0){
				drawBrickRectangle(ctx, groutspace, brick_gradient, brick_color, grout_color, gradient_color, x*width, y*height, width, height*2);
				drawBrickRectangle(ctx, groutspace, brick_gradient, brick_color, grout_color, gradient_color, x*width + width, y*height, width, height*2);
			}
			else{
				drawBrickRectangle(ctx, groutspace, brick_gradient, brick_color, grout_color, gradient_color, x*width, y*height, width*2, height);
				drawBrickRectangle(ctx, groutspace, brick_gradient, brick_color, grout_color, gradient_color, x*width, y*height + height, width*2, height);
			}
		}
	}
}

function createCirclePattern(ctx, width, height, count_x, count_y, groutspace, brick_gradient, brick_color, grout_color, gradient_color){
	width = parseInt(width / 3.0 + 0.5);
	height = parseInt(height / 3.0 + 0.5);
	count_y *= 3;
	count_x *= 3;
	
	for (var y = 0; y < count_y+1; y+=3){
		for (var x = 0; x < count_x+1; x+=3){
			drawBrickRectangle(ctx, groutspace, brick_gradient, brick_color, grout_color, gradient_color, x*width, y*height, width*2, height);
			drawBrickRectangle(ctx, groutspace, brick_gradient, brick_color, grout_color, gradient_color, x*width + width, y*height + 2*height, width*2, height);
				
			drawBrickRectangle(ctx, groutspace, brick_gradient, brick_color, grout_color, gradient_color, x*width, y*height + height, width, height*2);
			drawBrickRectangle(ctx, groutspace, brick_gradient, brick_color, grout_color, gradient_color, x*width + 2*width, y*height, width, height*2);

			drawBrickRectangle(ctx, groutspace, brick_gradient, brick_color, grout_color, gradient_color, x*width + width, y*height + height, width, height);
		}
	}
}

function createEdgesPattern(ctx, width, height, count_x, count_y, groutspace, brick_gradient, brick_color, grout_color, gradient_color){
	width = parseInt(width / 2.0 + 0.5);
	height = parseInt(height / 2.0 + 0.5);
	count_y *= 2;
	count_x *= 2;

	ctx.translate(-width, -height);
	for (var y = 0; y < count_y+2; y++){
		for (var x = 0; x < count_x+2; x++){
			if (y % 4 == x % 4)
				drawBrickRectangle(ctx, groutspace, brick_gradient, brick_color, grout_color, gradient_color, x*width, y*height, width*2, height);
			else if (y % 4 == (x % 4 + 1) 
				|| (y % 4 == 0 && x % 4 == 3))
				drawBrickRectangle(ctx, groutspace, brick_gradient, brick_color, grout_color, gradient_color, x*width, y*height, width, height * 2);
			
		}
	}
	ctx.translate(width, height);
}


function drawBrickRectangle( ctx, groutspace, brick_gradient, brick_col, brick_grout_col, gradient_color, x, y, w, h){

	brick_gradient = Math.min(brick_gradient, Math.min((h - groutspace*2)/2, (w - groutspace*2)/2));

	/*
	ctx.fillStyle = brick_grout_col;
	ctx.fillRect(x, Math.max(y,0), w, h);
	
	ctx.fillStyle = brick_col;
	ctx.fillRect(x + groutspace, y + groutspace < 0 ? 0 : y + groutspace , w - groutspace*2, y + groutspace < 0 ? h - groutspace : h - groutspace*2);
	*/
	
	ctx.fillStyle = brick_grout_col;
	ctx.fillRect(x, Math.max(y,0), w, h);

	var grad = ctx.createLinearGradient(0, y, 0, y+h);
	var max_d = h;
	grad.addColorStop(0, brick_grout_col);
	grad.addColorStop(groutspace / max_d, brick_grout_col);
	grad.addColorStop(groutspace / max_d, gradient_color);
	grad.addColorStop((groutspace + brick_gradient) / max_d, brick_col);
	grad.addColorStop((h - groutspace - brick_gradient) / max_d, brick_col);
	grad.addColorStop((h - groutspace) / max_d, gradient_color);
	grad.addColorStop((h - groutspace) / max_d, brick_grout_col);	
	grad.addColorStop(1.0, brick_grout_col);

	ctx.fillStyle = grad;
	ctx.fillRect(x + groutspace, y + groutspace < 0 ? 0 : y + groutspace , w - groutspace*2, y + groutspace < 0 ? h - groutspace : h - groutspace*2);
	//ctx.fillStyle = gradient([0, y, 0, h], ctx, y, groutspace, brick_col, brick_grout_col, gradient_color);
	//ctx.fillRect(x, y, w, h);

	
	ctx.save();
	
	var mid_x = w / 2 + x;
	var mid_y = h / 2 + y;

	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x + groutspace, y + groutspace);
	ctx.lineTo(x + groutspace + brick_gradient, y + groutspace + brick_gradient);
	ctx.lineTo(mid_x , mid_y);
	ctx.lineTo(w+x - brick_gradient - groutspace, h+y - brick_gradient - groutspace);
	ctx.lineTo(w+x - brick_gradient, h+y - brick_gradient);
	ctx.lineTo(w+x, y+h);
	ctx.lineTo(w+x, y);
	ctx.lineTo(w+x - groutspace, y + groutspace);
	ctx.lineTo(w+x - brick_gradient - groutspace, y + groutspace + brick_gradient);
	ctx.lineTo(mid_x, mid_y);
	ctx.lineTo(x + brick_gradient + groutspace, h+y - brick_gradient - groutspace);
	ctx.lineTo(x + groutspace, h+y - groutspace);
	ctx.lineTo(x, h+y);
	ctx.lineTo(x, y);
	ctx.clip();
	
	grad = ctx.createLinearGradient(x, 0, x+w, 0);
	max_d = w;
	grad.addColorStop(0, brick_grout_col);
	grad.addColorStop(groutspace / max_d, brick_grout_col);
	grad.addColorStop(groutspace / max_d, gradient_color);
	grad.addColorStop((groutspace + brick_gradient) / max_d, brick_col);
	grad.addColorStop((w - groutspace - brick_gradient) / max_d, brick_col);
	grad.addColorStop((w - groutspace) / max_d, gradient_color);
	grad.addColorStop((w - groutspace) / max_d, brick_grout_col);	
	grad.addColorStop(1.0, brick_grout_col);
	ctx.fillStyle = grad;
	//ctx.fillStyle = gradient([x, 0, w, 0], ctx, tile_part_x, hori_gap, x_tiles_gradient, tile_col_hex, grout_col_hex, tiles_smooth_col, grout_gradient_color);
	ctx.fillRect(x + groutspace, y + groutspace < 0 ? 0 : y + groutspace , w - groutspace*2, y + groutspace < 0 ? h - groutspace : h - groutspace*2);

	ctx.restore();
	
}

/*
function drawTilingRectangle(tile_part_x, tile_part_y, hori_gap, vert_gap, x_tiles_gradient, y_tiles_gradient, tile_col_hex, grout_col_hex, tiles_smooth_col, grout_gradient_color, ctx, x, y, w, h){
		
	ctx.fillStyle = gradient([0, y, 0, h], ctx, tile_part_y, vert_gap, y_tiles_gradient, tile_col_hex, grout_col_hex, tiles_smooth_col, grout_gradient_color);
	ctx.fillRect(x, y, w, h);

	ctx.save();
	
	var half_xgap = hori_gap/2.0; 
	var half_ygap = vert_gap/2.0;
	var mid_tile_x = (w-x)/2.0 + x;
	var mid_tile_y = (h-y)/2.0 + y;

	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(Math.min(x + half_xgap, mid_tile_x), Math.min(y + half_ygap, mid_tile_y));
	ctx.lineTo(Math.min(x + half_xgap + x_tiles_gradient, mid_tile_x), Math.min(y + half_ygap + y_tiles_gradient, mid_tile_y));
	ctx.lineTo(mid_tile_x, mid_tile_y);
	ctx.lineTo(Math.max(w - half_xgap - x_tiles_gradient, mid_tile_x), Math.max(h - half_ygap - y_tiles_gradient, mid_tile_y));
	ctx.lineTo(Math.max(w - half_xgap, mid_tile_x), Math.max(h - half_ygap, mid_tile_y));
	ctx.lineTo(w, h);
	ctx.lineTo(w, y);
	ctx.lineTo(Math.max(w - half_xgap, mid_tile_x), Math.min(y + half_ygap, mid_tile_y));
	ctx.lineTo(Math.max(w - half_xgap - x_tiles_gradient, mid_tile_x), Math.min(y + half_ygap + y_tiles_gradient, mid_tile_y));
	ctx.lineTo(mid_tile_x, mid_tile_y);
	ctx.lineTo(Math.min(x + half_xgap + x_tiles_gradient, mid_tile_x), Math.max(h - half_ygap - y_tiles_gradient, mid_tile_y));
	ctx.lineTo(Math.min(x + half_xgap, mid_tile_x), Math.max(h - half_ygap, mid_tile_y));
	ctx.lineTo(x, h);
	ctx.lineTo(x, y);
	ctx.clip();
	
	//ctx.fillStyle = "#ff7700";
	ctx.fillStyle = gradient([x, 0, w, 0], ctx, tile_part_x, hori_gap, x_tiles_gradient, tile_col_hex, grout_col_hex, tiles_smooth_col, grout_gradient_color);
	ctx.fillRect(x, y, w, h);

	ctx.restore();
}


function gradient(dir, ctx, tile_d, gap_d, tiles_gradient_d, tile_col_hex, grout_col_hex, tiles_smooth_col, grout_gradient_color) {
	var grad = ctx.createLinearGradient(dir[0], dir[1], dir[2], dir[3]);
	
	var max_d = tile_d + gap_d + tiles_gradient_d*2;
	var half_gap = gap_d / 2.0;
	grad.addColorStop(0, grout_gradient_color);
	grad.addColorStop(half_gap / max_d, grout_col_hex);
	grad.addColorStop(half_gap / max_d, tiles_smooth_col);
	grad.addColorStop((half_gap + tiles_gradient_d) / max_d, tile_col_hex);
	grad.addColorStop((half_gap + tiles_gradient_d + tile_d) / max_d, tile_col_hex);
	grad.addColorStop((half_gap + tiles_gradient_d*2 + tile_d) / max_d, tiles_smooth_col);
	grad.addColorStop((half_gap + tiles_gradient_d*2 + tile_d) / max_d, grout_col_hex);
	grad.addColorStop(1.0, grout_gradient_color);
	
	return grad;
}*/