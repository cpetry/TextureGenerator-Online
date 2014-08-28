
function setTiling(tile_col_hex, hori_count, vert_count, grout_col_hex, hori_gap, vert_gap)
{
	var c = document.getElementById("texture_preview");
	var ctx = c.getContext("2d");

	// grout
	ctx.fillStyle = grout_col_hex; // hex col
	ctx.fillRect(0,0,256,256); // fillRect(x,y,width,height)

	// tiles
	var x_start = 0;
	var y_start = 0;
	var tile_partx = 256 / hori_count - hori_gap;
	var tile_party = 256 / vert_count - vert_gap;
	ctx.fillStyle = tile_col_hex; // hex col
	for(var y=0; y<vert_count; y++){
		y_start = vert_gap/2 + y * tile_party + y * vert_gap;
		for(var x=0; x<hori_count; x++){
			x_start = hori_gap/2 + x * tile_partx  + x * hori_gap;
			ctx.fillRect(x_start, y_start, tile_partx, tile_party); // fillRect(x,y,width,height)
		}
	}	
}