
function setTiling(tile_col_hex, hori_count, vert_count, grout_col_hex, hori_gap, vert_gap)
{
	var c = document.getElementById("texture_preview");
	var ctx = c.getContext("2d");
	ctx.fillStyle = tile_col_hex; // hex col
	ctx.fillRect(0,0,256,20); // fillRect(x,y,width,height)

	ctx.fillStyle = grout_col_hex; // hex col
	ctx.fillRect(0,20,256,40); // fillRect(x,y,width,height)
}