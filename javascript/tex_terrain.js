$(".slider_area_terrain" ).click(function(evt) {
	var x = Math.min(Math.max(evt.pageX - $(this).offset().left, 0), 255);
	
	createGradientSlider(x, 'ffffff', 'terrain');
	
	updateTexture();
	//alert( "Position: " + x );
});

$(".slider_area_terrain").droppable({
	out: function (event, ui) {
		//document.write($(ui.draggable).position().left);
		if ($(ui.draggable).position().left < 250)
			$(ui.draggable).remove();
    }
});

//createGradientSlider(256, 'eeeeee', 'terrain');
createGradientSlider(200, 'ffffff', 'terrain');
createGradientSlider(168, '618546', 'terrain');
createGradientSlider(50, '263b0c', 'terrain');
createGradientSlider(10, '524f21', 'terrain');
//createGradientSlider(0, '222222', 'terrain');





function updateTerrain(){
	var colors = [];
	var colors_hex = [];
	
	$(".slider_terrain").each(function( index ) {
		var pos = $(this).css("left");
		pos = pos.substring(0, pos.length - 2);
		var percentage = Math.min(parseFloat(pos), 255) / 2.56;
	
		colors.push([$(this).css("background-color").match(/\d+/g), percentage]);
		colors_hex.push([rgb2hex($(this).css("background-color")), percentage]);
	});

	colors.sort(percentage_compare);
	colors_hex.sort(percentage_compare);
	

	var gradient_text = 'linear-gradient(to right';
	colors_hex.forEach(function(col) {
		gradient_text += ', ' + col[0] + ' ' + Math.max(col[1],0) + '%';
	});
	$(".terrain_gradient_preview").css('background', gradient_text); // W3C




	console.log(colors);
	for (var c = 0; c < colors.length; c++) {
		colors[c][0][0] = parseFloat(colors[c][0][0]);
		colors[c][0][1] = parseFloat(colors[c][0][1]);
		colors[c][0][2] = parseFloat(colors[c][0][2]);
		colors[c][1] = colors[c][1] / 100;
		console.log("r: " + colors[c][0][0] +  " g:" + colors[c][0][1] + " b:" + colors[c][0][2] +" percentage: "  + colors[c][1]);
	}

	var octaves = parseInt($("#terrain_octaves").val());
	var scale = parseFloat($("#terrain_scale").val());
	//var scale_y = parseFloat($("#perlin_noise_scale_y").val());
	
	var persistence = parseFloat($("#terrain_detail").val());
	var percentage = parseFloat($("#terrain_percentage").val());

	var seed = parseInt($("#terrain_seed").val());
	
	

	//var persistence = 0.6;
	//var scale = 10;
	//var seed = 100;
	//var percentage = 0.80;

	setTerrainNoise(colors, "FractalNoise", 7, persistence, scale, seed, percentage);
}


function setTerrainNoise(colors, type, octaves, persistence, scale, seed, percentage)
{
	
	
	var c = document.getElementById("texture_preview");
	var ctx = c.getContext("2d");

	var max_w = 512, max_h = 512;
	
	var S = new SimplexNoise(seed);
	
	var imgData = ctx.getImageData(0,0, max_w, max_h);
	var d = imgData.data;
		
	var scale_s = scale;	
		
	
	var before = new Date().getTime();

	var noise_type;
	if (type == "PerlinNoise")
		noise_type = NoiseTypeEnum.PERLINNOISE;
	else if (type == "FractalNoise")
		noise_type = NoiseTypeEnum.FRACTALNOISE;
	else if (type == "Turbulence")
		noise_type = NoiseTypeEnum.TURBULENCE;
		
	//console.log(colors[1][1]);
	//console.log(colors[1][0][2]);
	
	for (var y=0; y<max_h; y++)
	for (var x=0; x<max_w; x++){
		// octaves, persistence, scale, loBound, hiBound, x, y
		var v = S.simplex(noise_type, octaves, persistence, percentage, scale_s, x, y);
		var i = (x + y*max_w) * 4;

		// searches for the lower and upper color
		if (colors[0][1] > v){
			d[i]   = colors[0][0][0];
			d[i+1] = colors[0][0][1];
			d[i+2] = colors[0][0][2];
			d[i+3] = 255;
		}
		else{
			for (var col = 1; col < colors.length; col++) {
				if (colors[col][1] > v){
					var per = 1-(v - colors[col-1][1]) / (colors[Math.min(col, colors.length-1)][1] - colors[col-1][1]);
					d[i]   = per * colors[col-1][0][0] + ((1.0-per) * colors[Math.min(col,colors.length-1)][0][0]);
					d[i+1] = per * colors[col-1][0][1] + ((1.0-per) * colors[Math.min(col,colors.length-1)][0][1]);
					d[i+2] = per * colors[col-1][0][2] + ((1.0-per) * colors[Math.min(col,colors.length-1)][0][2]);
					d[i+3] = 255;
					col = colors.length;
				}
			}
		}
		if (v > colors[colors.length-1][1]){
			d[i]   = colors[colors.length-1][0][0];
			d[i+1] = colors[colors.length-1][0][1];
			d[i+2] = colors[colors.length-1][0][2];
			d[i+3] = 255;
		}
	}
	
	var after = new Date().getTime();
	console.log(after - before);

	ctx.putImageData(imgData, 0, 0);
	
}