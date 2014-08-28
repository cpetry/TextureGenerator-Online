

$('.color-box1').colpick({
	layout:'rgbhsbhex',
	color: {h:200, s:0, b:100},
	hue:200,
	onSubmit:function(hsb,hex,rgb,el) {
		$(el).css('background-color', '#'+hex);
		$(el).colpickHide();
		updateTiling();
	}
}).css('background-color', '#ffffff');


$('.color-box2').colpick({
	layout:'rgbhsbhex',
	color: {h:200, s:0, b:0},
	onSubmit:function(hsb,hex,rgb,el) {
		$(el).css('background-color', '#'+hex);
		$(el).colpickHide();
		updateTiling();
	}
}).css('background-color', '#000000');


function updateTiling(){
	var hex1 = rgb2hex($("#1").css("background-color"));
	var hex2 = rgb2hex($("#2").css("background-color"));
	
	var x_tiling = parseInt($("#x_tiling").val());
	var y_tiling = parseInt($("#y_tiling").val());
	var x_grout = parseInt($("#x_grout").val());
	var y_grout = parseInt($("#y_grout").val());
	var x_smooth = parseInt($("#x_smooth").val());
	var y_smooth = parseInt($("#y_smooth").val());
	//document.write(x_tiling);
	
	// tile_col_hex, hori_count, vert_count, grout_col_hex, hori_gap, vert_gap
	setTiling(hex1, x_tiling, y_tiling, hex2, x_grout, y_grout, x_smooth, y_smooth);
}


function setTiling(tile_col_hex, hori_count, vert_count, grout_col_hex, hori_gap, vert_gap, x_smooth, y_smooth)
{
	var c = document.getElementById("texture_preview");
	var ctx = c.getContext("2d");

	// grout
	ctx.fillStyle = grout_col_hex; // hex col
	ctx.fillRect(0,0,256,256); // fillRect(x,y,width,height)

	// Smoothness (gradients)
	
	var tile_part_x = Math.max(256 / hori_count - hori_gap, 0);
	var tile_part_y = Math.max(256 / vert_count - vert_gap, 0);	
	
	function gradient(dir, tile_d, gap_d, smooth_d, grout_col_hex, tile_col_hex) {
		var grad = ctx.createLinearGradient(dir[0], dir[1], dir[2], dir[3]);
		
		var max_d = tile_d + gap_d + smooth_d*2;
		
		grad.addColorStop(0, grout_col_hex);
		grad.addColorStop(gap_d/2 / max_d, grout_col_hex);
		grad.addColorStop((gap_d/2 + smooth_d) / max_d, tile_col_hex);
		grad.addColorStop((gap_d/2 + smooth_d + tile_d) / max_d, tile_col_hex);
		grad.addColorStop((gap_d/2 + smooth_d*2 + tile_d) / max_d, grout_col_hex);
		grad.addColorStop(1.0, grout_col_hex);
		
		return grad;
	}
	
	function drawRectangle(tile_part_x, tile_part_y, hori_count, vert_count, hori_gap, vert_gap, x_smooth, y_smooth, grout_col_hex, tile_col_hex, ctx, x, y, w, h){
		
		ctx.fillStyle = gradient([0, y, 0, h], tile_part_y, vert_gap, y_smooth, grout_col_hex, tile_col_hex);
		ctx.fillRect(x, y, w, h);

		
		ctx.save();

		var offset_x = 0, offset_y = 0;
		
		if ((hori_gap/2 + x_smooth) * hori_count < (vert_gap/2 + y_smooth) * vert_count){
			// tan = geg / an => geg = tan * an
			var rad = Math.atan((hori_gap + x_smooth) / (vert_gap + y_smooth));
			var geg = Math.tan(rad) * ((h-y)/2);
			
			offset_x = Math.max((w-x)/2 - geg, 0);
		}
		else{
			var rad = Math.atan((vert_gap + y_smooth) / (hori_gap + x_smooth));
			var geg = Math.tan(rad) * ((w-x)/2);
			
			offset_y = Math.max((h-y)/2 - geg, 0);
		}
		
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo((w-x)/2 + x - offset_x,(h-y)/2 + y - offset_y);
		ctx.lineTo((w-x)/2 + x,(h-y)/2 + y - offset_y);
		ctx.lineTo((w-x)/2 + x + offset_x,(h-y)/2 + y - offset_y);
		ctx.lineTo(w, y);
		ctx.lineTo(w, h);
		ctx.lineTo((w-x)/2 + x + offset_x,(h-y)/2 + y + offset_y);
		ctx.lineTo((w-x)/2 + x,(h-y)/2 + y + offset_y);
		ctx.lineTo((w-x)/2 + x - offset_x,(h-y)/2 + y + offset_y);
		ctx.lineTo(x, h);
		ctx.lineTo(x, y);
		ctx.clip();
		
		/*
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x, y + vert_gap/2);
		ctx.lineTo(w/2, h/2);
		ctx.lineTo(w, h - vert_gap/2);
		ctx.clip();
		ctx.moveTo(w, h);
		ctx.lineTo(w, y);
		ctx.lineTo(x, h);
		ctx.clip();
		*/
    
		//ctx.fillStyle = "#ff7700";
		ctx.fillStyle = gradient([x, 0, w, 0], tile_part_x, hori_gap, x_smooth, grout_col_hex, tile_col_hex);
		ctx.fillRect(x, y, w, h);

		ctx.restore();
	}
	
	for (var y=0; y < vert_count; y++){
		for (var x=0; x < hori_count; x++){
			drawRectangle(tile_part_x, tile_part_y, hori_count, vert_count, hori_gap, vert_gap,
			x_smooth, y_smooth, grout_col_hex, tile_col_hex, 
			ctx, x*256/hori_count, y*256/vert_count, (x+1)*256/hori_count, (y+1)*256/vert_count);
		}
	}
	
	
	
	/*
	for(var y=0; y<vert_count; y++){
		y_start = Math.min(vert_gap/2 + y * tile_part_y + y * vert_gap, 256);
		for(var x=0; x<hori_count; x++){
			x_start = Math.min(hori_gap/2 + x * tile_part_x  + x * hori_gap, 256);
			ctx.fillRect(x_start - x_smooth, y_start - y_smooth, tile_part_x + 2*x_smooth, tile_part_y + 2*y_smooth); // fillRect(x,y,width,height)
		}
	}*/
	
	
	// tiles
	/*
	var x_start = 0;
	var y_start = 0;
	var tile_part_x = Math.max(256 / hori_count - hori_gap, 0);
	var tile_part_y = Math.max(256 / vert_count - vert_gap, 0);
	
	ctx.fillStyle = tile_col_hex; // hex col
	
	for(var y=0; y<vert_count; y++){
		y_start = Math.min(vert_gap/2 + y * tile_part_y + y * vert_gap, 256);
		for(var x=0; x<hori_count; x++){
			x_start = Math.min(hori_gap/2 + x * tile_part_x  + x * hori_gap, 256);
			ctx.fillRect(x_start, y_start, tile_part_x, tile_part_y); // fillRect(x,y,width,height)
		}
	}*/
}


function rgb2hex(rgb){
	 rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	 return "#" +
	  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
	  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
	  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2);
}