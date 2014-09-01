

$('.tiles_color').colpick({
	layout:'rgbhsbhex',
	color: {h:200, s:0, b:100},
	hue:200,
	onSubmit:function(hsb,hex,rgb,el) {
		$(el).css('background-color', '#'+hex);
		$(el).colpickHide();
		updateTiling();
	}
}).css('background-color', '#ffffff');


$('.grout_color').colpick({
	layout:'rgbhsbhex',
	color: {h:200, s:0, b:0},
	onSubmit:function(hsb,hex,rgb,el) {
		$(el).css('background-color', '#'+hex);
		$(el).colpickHide();
		updateTiling();
	}
}).css('background-color', '#000000');

$('.tiles_smooth_color').colpick({
	layout:'rgbhsbhex',
	color: {h:200, s:0, b:0},
	onSubmit:function(hsb,hex,rgb,el) {
		$(el).css('background-color', '#'+hex);
		$(el).colpickHide();
		updateTiling();
	}
}).css('background-color', '#000000');


function updateTiling(){
	var hex1 = rgb2hex($(".tiles_color").css("background-color"));
	var hex2 = rgb2hex($(".grout_color").css("background-color"));
	var hex3 = rgb2hex($(".tiles_smooth_color").css("background-color"));
	
	var x_tiling = parseInt($("#tiles_x").val());
	var y_tiling = parseInt($("#tiles_y").val());
	var x_grout = parseInt($("#tiles_x_grout").val());
	var y_grout = parseInt($("#tiles_y_grout").val());
	var x_smooth = parseInt($("#tiles_x_smooth").val());
	var y_smooth = parseInt($("#tiles_y_smooth").val());

	if (!$('#Smoothness').prop('checked')){
		x_smooth = 0;
		y_smooth = 0;
	}
	
	setTiling(hex1, x_tiling, y_tiling, hex2, x_grout, y_grout, hex3, x_smooth, y_smooth);
}


function setTiling(tile_col_hex, hori_count, vert_count, grout_col_hex, hori_gap, vert_gap, tiles_smooth_col, x_smooth, y_smooth)
{
	var c = document.getElementById("texture_preview");
	var ctx = c.getContext("2d");

	var max_w = 512, max_h = 512;
	
	// grout
	ctx.fillStyle = grout_col_hex; // hex col
	ctx.fillRect(0,0,max_w,max_h); // fillRect(x,y,width,height)

	// Smoothness (gradients)
	
	var tile_part_x = Math.max((max_w / hori_count) - hori_gap - (x_smooth * 2), 0);
	var tile_part_y = Math.max((max_h / vert_count) - vert_gap - (y_smooth * 2), 0);	
	
	function gradient(dir, tile_d, gap_d, smooth_d, tile_col_hex, grout_col_hex, tiles_smooth_col) {
		var grad = ctx.createLinearGradient(dir[0], dir[1], dir[2], dir[3]);
		
		var max_d = tile_d + gap_d + smooth_d*2;
		var half_gap = gap_d / 2.0;
		grad.addColorStop(0, grout_col_hex);
		grad.addColorStop(half_gap / max_d, grout_col_hex);
		//grad.addColorStop(half_gap / max_d, tile_col_hex); // test
		//grad.addColorStop((half_gap + smooth_d) / max_d, tile_col_hex); // test
		//grad.addColorStop((half_gap + smooth_d) / max_d, grout_col_hex); // test
		//grad.addColorStop((half_gap + smooth_d + 0.001) / max_d, grout_col_hex); // test
		grad.addColorStop((half_gap + smooth_d) / max_d, tile_col_hex);
		grad.addColorStop((half_gap + smooth_d + tile_d) / max_d, tile_col_hex);
		grad.addColorStop((half_gap + smooth_d*2 + tile_d) / max_d, grout_col_hex);
		grad.addColorStop(1.0, grout_col_hex);
		
		return grad;
	}
	
	function drawRectangle(tile_part_x, tile_part_y, hori_count, vert_count, hori_gap, vert_gap, x_smooth, y_smooth, tile_col_hex, grout_col_hex, tiles_smooth_col, ctx, x, y, w, h){
		
		ctx.fillStyle = gradient([0, y, 0, h], tile_part_y, vert_gap, y_smooth, tile_col_hex, grout_col_hex, tiles_smooth_col);
		ctx.fillRect(x, y, w, h);

		ctx.save();
		
		var half_xgap = hori_gap/2.0; 
		var half_ygap = vert_gap/2.0;
		var mid_tile_x = (w-x)/2.0 + x;
		var mid_tile_y = (h-y)/2.0 + y;

		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(Math.min(x + half_xgap, mid_tile_x), Math.min(y + half_ygap, mid_tile_y));
		ctx.lineTo(Math.min(x + half_xgap + x_smooth, mid_tile_x), Math.min(y + half_ygap + y_smooth, mid_tile_y));
		ctx.lineTo(mid_tile_x, mid_tile_y);
		ctx.lineTo(Math.max(w - half_xgap - x_smooth, mid_tile_x), Math.max(h - half_ygap - y_smooth, mid_tile_y));
		ctx.lineTo(Math.max(w - half_xgap, mid_tile_x), Math.max(h - half_ygap, mid_tile_y));
		ctx.lineTo(w, h);
		ctx.lineTo(w, y);
		ctx.lineTo(Math.max(w - half_xgap, mid_tile_x), Math.min(y + half_ygap, mid_tile_y));
		ctx.lineTo(Math.max(w - half_xgap - x_smooth, mid_tile_x), Math.min(y + half_ygap + y_smooth, mid_tile_y));
		ctx.lineTo(mid_tile_x, mid_tile_y);
		ctx.lineTo(Math.min(x + half_xgap + x_smooth, mid_tile_x), Math.max(h - half_ygap - y_smooth, mid_tile_y));
		ctx.lineTo(Math.min(x + half_xgap, mid_tile_x), Math.max(h - half_ygap, mid_tile_y));
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
		ctx.fillStyle = gradient([x, 0, w, 0], tile_part_x, hori_gap, x_smooth, tile_col_hex, grout_col_hex, tiles_smooth_col);
		ctx.fillRect(x, y, w, h);

		ctx.restore();
	}
	
	for (var y=0; y < vert_count; y++){
		for (var x=0; x < hori_count; x++){
			drawRectangle(tile_part_x, tile_part_y, hori_count, vert_count, hori_gap, vert_gap,
			x_smooth, y_smooth, tile_col_hex, grout_col_hex, tiles_smooth_col,
			ctx, Math.floor(x*max_w/hori_count), Math.floor(y*max_h/vert_count), 
			Math.ceil((x+1)*max_w/hori_count), Math.ceil((y+1)*max_h/vert_count));
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