var terrain_height_canvas = document.createElement("canvas");
var terrain_color_canvas = document.createElement("canvas");
var terrain_shadow_canvas = document.createElement("canvas");

$(".slider_area_terrain" ).click(function(evt) {
	var x = Math.min(Math.max(evt.pageX - $(this).offset().left, 0), 255);
	
	createGradientSlider(x, 'ffffff', 'terrain');
	
	updateTerrainColor();
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


function updateTerrain(color_changed){
	

	var octaves = parseInt($("#terrain_octaves").val());
	var scale = parseFloat($("#terrain_scale").val());
	//var scale_y = parseFloat($("#perlin_noise_scale_y").val());
	
	var persistence = parseFloat($("#terrain_detail").val());
	var percentage = parseFloat($("#terrain_percentage").val());

	var seed = parseInt($("#terrain_seed").val());
	

	if (!color_changed){
		var before = new Date().getTime();
		setTerrainNoise("FractalNoise", 7, persistence, scale, seed, percentage, 0.45);
		var after = new Date().getTime();
		console.log(after - before);

		before = new Date().getTime();
		updateTerrainShadow();
		after = new Date().getTime();
		console.log(after - before);
	}

	updateTerrainColor();

	multiplyCanvas(terrain_color_canvas, terrain_shadow_canvas, document.getElementById("texture_preview"));
}

function updateTerrainShadow(){
	setTerrainShadow(new Array(-50, -50, 600), new Array(150,150,150));
}


function updateTerrainColor(){
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


	//console.log(colors);
	for (var c = 0; c < colors.length; c++) {
		colors[c][0][0] = parseFloat(colors[c][0][0]);
		colors[c][0][1] = parseFloat(colors[c][0][1]);
		colors[c][0][2] = parseFloat(colors[c][0][2]);
		colors[c][1] = colors[c][1] / 100;
		//console.log("r: " + colors[c][0][0] +  " g:" + colors[c][0][1] + " b:" + colors[c][0][2] +" percentage: "  + colors[c][1]);
	}

	before = new Date().getTime();
	setTerrainColor(colors);
	after = new Date().getTime();
	console.log(after - before);
}


function setTerrainNoise(type, octaves, persistence, scale, seed, percentage, min_height)
{
	var max_w = 512, max_h = 512;

	terrain_height_canvas.width  = max_w; 	// important! dimensions would be to small otherwise
	terrain_height_canvas.height = max_h;

	var dst = terrain_height_canvas;
	var ctx_dst = dst.getContext("2d");
	var imgData = ctx_dst.getImageData(0,0, max_w, max_h);
	var d = imgData.data;
		
	var scale_s = scale;
	
	var noise_type;
	if (type == "PerlinNoise")
		noise_type = NoiseTypeEnum.PERLINNOISE;
	else if (type == "FractalNoise")
		noise_type = NoiseTypeEnum.FRACTALNOISE;
	else if (type == "Turbulence")
		noise_type = NoiseTypeEnum.TURBULENCE;
		
	var S = new SimplexNoise(seed);

	for (var y=0; y<max_h; y++)
	for (var x=0; x<max_w; x++){
		// octaves, persistence, scale, loBound, hiBound, x, y
		var v = S.simplex(noise_type, octaves, persistence, percentage, scale_s, x, y);
		v = Math.max(min_height, v);
		var i = (x + y*max_w) * 4;

		d[i]   = v * 255 + ((1.0-v) * 0);
		d[i+1] = v * 255 + ((1.0-v) * 0);
		d[i+2] = v * 255 + ((1.0-v) * 0);
		d[i+3] = 255;
	}
	
	ctx_dst.putImageData(imgData, 0, 0);
}

function setTerrainShadow(sun_position, shadow_color)
{
	var max_w = 512, max_h = 512;

	terrain_shadow_canvas.width  = max_w; 	// important! dimensions would be to small otherwise
	terrain_shadow_canvas.height = max_h;

	var dst = terrain_shadow_canvas;
	var ctx_dst = dst.getContext("2d");
	var imgData_dst = ctx_dst.getImageData(0,0, max_w, max_h);
	var d = imgData_dst.data;

	var src = terrain_height_canvas;
	var ctx_src = src.getContext("2d");
	var imgData_src = ctx_src.getImageData(0,0, max_w, max_h);
	var s = imgData_src.data;

	for (var y=0; y<max_h; y++)
	for (var x=0; x<max_w; x++){
		var i = (x + y*max_w) * 4;
		d[i] = 255;
		d[i+1] = 255;
		d[i+2] = 255;

		// sqrt (xd^2 + yd^2)
		var dist = Math.sqrt(Math.pow(x-sun_position[0],2), Math.pow(y-sun_position[0],2));
		currentPos = new Array (x,y);
		var height = s[i];
		while(currentPos[0] >= 0 && currentPos[1] >= 0
			&& height <= 255){
			if (s[(currentPos[0] + currentPos[1]*max_w) * 4] > height ) {
				d[i] = shadow_color[0];
				d[i+1] = shadow_color[1];
				d[i+2] = shadow_color[2];
			}
			height++;
			currentPos[0]--;
			currentPos[1]--;
		}
		d[i+3] = 255;
	}
	ctx_dst.putImageData(imgData_dst, 0, 0);
	/*//Set current position in terrain
      CurrentPos.Set((float)x, hmap.Get(x, z), (float)z);
  
      //Calc new direction of lightray
      LightDir = Sun - CurrentPos;
      LightDir.Normalize();
  
      ShadowMap.Set(x, z, 255);
  
      //Start the test
      while ( CurrentPos.x() >= 0 &&
          CurrentPos.x() < MapWidth && 
          CurrentPos.z() >= 0 && 
          CurrentPos.z() < MapHeight && 
          CurrentPos != Sun && CurrentPos.y() < 255 )
      {
        CurrentPos+=LightDir;
    
        LerpX = round(CurrentPos.x());
        LerpZ = round(CurrentPos.z());
  
        //Hit?
        if(CurrentPos.y() <= hmap.Get(LerpX, LerpZ))
        { 
          ShadowMap.Set(x, z, 0);
          break;
        }
    }*/


}

function setTerrainColor(colors){
	var max_w = 512, max_h = 512;

	terrain_color_canvas.width  = max_w; 	// important! dimensions would be to small otherwise
	terrain_color_canvas.height = max_h;

	var dest = terrain_color_canvas;
	var ctx_dest = dest.getContext("2d");
	var imgData_dest = ctx_dest.getImageData(0,0, max_w, max_h);
	var d = imgData_dest.data;
	
	var src = terrain_height_canvas;
	var ctx_src = src.getContext("2d");
	var imgData_src = ctx_src.getImageData(0,0, max_w, max_h);
	var s = imgData_src.data;

	for (var y=0; y<max_h; y++)
	for (var x=0; x<max_w; x++){
		var i = (x + y*max_w) * 4;
		var v = s[i] / 255;

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

	ctx_dest.putImageData(imgData_dest, 0, 0);
}