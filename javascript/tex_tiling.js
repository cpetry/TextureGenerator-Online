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


$('#tiles_color').colpick({
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


$('#grout_color').colpick({
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

$('#tiles_gradient_color').colpick({
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

$('#grout_gradient_color').colpick({
	layout:'rgbhsbhex',
	color: {h:35, s:0, b:15},
	onChange:function(hsb,hex,rgb,el) {
		$(el).css('background-color', '#'+hex);
		updateTexture();
	},
	onSubmit:function(hsb,hex,rgb,el) {
		$(el).colpickHide();
	}
}).css('background-color', '#262626');



function updateTiling(){
	var tiles_color = rgb2hex($("#tiles_color").css("background-color"));
	var grout_color = rgb2hex($("#grout_color").css("background-color"));
	var tiles_gradient_color = rgb2hex($("#tiles_gradient_color").css("background-color"));
	var grout_gradient_color = rgb2hex($("#grout_gradient_color").css("background-color"));
	
	var x_tiling = parseInt($("#tiles_x").val());
	var y_tiling = parseInt($("#tiles_y").val());
	var x_grout = parseInt($("#tiles_x_grout").val());
	var y_grout = parseInt($("#tiles_y_grout").val());
	var x_tiles_gradient = parseInt($("#tiles_x_gradient").val());
	var y_tiles_gradient = parseInt($("#tiles_y_gradient").val());

	if (!$('#TilesGradient').prop('checked')){
		x_tiles_gradient = 0;
		y_tiles_gradient = 0;
	}

	if (!$('#GroutGradient').prop('checked')){
		grout_gradient_color = grout_color;
	}
	
	setTiling(tiles_color, x_tiling, y_tiling, grout_color, x_grout, y_grout, tiles_gradient_color, x_tiles_gradient, y_tiles_gradient, grout_gradient_color);
}


function setTiling(tile_col_hex, hori_count, vert_count, grout_col_hex, hori_gap, vert_gap, tiles_gradient_color, x_tiles_gradient, y_tiles_gradient, grout_gradient_color)
{
	var c = document.getElementById("texture_preview");
	var ctx = c.getContext("2d");

	var max_w = 512, max_h = 512;
	
	// grout
	ctx.fillStyle = grout_col_hex; // hex col
	ctx.fillRect(0,0,max_w,max_h); // fillRect(x,y,width,height)

	// Smoothness (gradients)
	
	var tile_part_x = Math.max((max_w / hori_count) - hori_gap - (x_tiles_gradient * 2), 0);
	var tile_part_y = Math.max((max_h / vert_count) - vert_gap - (y_tiles_gradient * 2), 0);	
	
	for (var y=0; y < vert_count; y++){
		for (var x=0; x < hori_count; x++){
			drawTilingRectangle(tile_part_x, tile_part_y, hori_gap, vert_gap,
			x_tiles_gradient, y_tiles_gradient, tile_col_hex, grout_col_hex, tiles_gradient_color, grout_gradient_color,
			ctx, Math.floor(x*max_w/hori_count), Math.floor(y*max_h/vert_count), 
			Math.ceil((x+1)*max_w/hori_count), Math.ceil((y+1)*max_h/vert_count));
		}
	}
}

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
}