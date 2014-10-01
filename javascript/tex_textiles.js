
$('#textiles_color1').colpick({
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


$('#textiles_color2').colpick({
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


$('#textiles_bgcolor').colpick({
	layout:'rgbhsbhex',
	color: {h:0, s:0, b:0},
	onChange:function(hsb,hex,rgb,el) {
		$(el).css('background-color', '#'+hex);
		updateTexture();
	},
	onSubmit:function(hsb,hex,rgb,el) {
		$(el).colpickHide();
	}
}).css('background-color', '#000000');

PatternPart = {
    TOP : 0,
    MIDDLE : 1,
    BOTTOM : 2,
    BLOCK : 3
}

PatternDirection = {
    HORIZONTAL : 0,
    VERTICAL : 1
}

function textiles_select_pattern(elem){
	$(".textiles_pattern_selected").toggleClass('textiles_pattern_selected textiles_pattern');
	elem.setAttribute('class', 'textiles_pattern_selected');
	updateTexture();
}

function updateTextiles(){
	var color1 = rgb2hex($("#textiles_color1").css("background-color"));
	var color2 = rgb2hex($("#textiles_color2").css("background-color"));
	var bgcolor = '#000000'; //$("#textiles_bgcolor").css("background-color")

	var scale = $('#textiles_double').prop('checked') ? 2 : 1;
	//var scale_y = parseFloat($("#textiles_y").val());
	
	var facetlength = parseFloat($("#textiles_tightness").val()); // [0,1] , default 0.5
	var delta = parseFloat($("#textiles_thickness").val()); // thickness, (0, 1]
	var smoothness = 1.0 - parseFloat($("#textiles_smoothness").val()); // [0,1]
	var offset = parseFloat($("#textiles_offset").val()); // [0,1] , default 0.3
	var steepness = 2; // default facetlength, can be anything else

	// own parameter
	var depth = 1; // [1,3] , default 1
	var round = true;
	var max_w = 512;
	var max_h = 512;
	var c = document.getElementById("texture_preview");
	var ctx = c.getContext("2d");
	
	var col1_rgb = hexToRgb(color1);
	var col2_rgb = hexToRgb(color2);
	var col_bg = hexToRgb(bgcolor);
	
	var current_pattern = $(".textiles_pattern_selected").first().next()[0];
	console.log(current_pattern);
	//ctx.drawImage(can2, 0, 0, max_w, max_h);
	if (current_pattern !== undefined)
		setTextiles(ctx, current_pattern, max_w, max_h, scale, col1_rgb, col2_rgb, col_bg, facetlength, delta, smoothness, offset, steepness, depth, round);
}

function setTextiles(ctx, img, max_w, max_h, scale, col1_rgb, col2_rgb, col_bg, facetlength, delta, smoothness, offset, steepness, depth, round){
	
	var width = parseInt(max_w / (img.width * scale) + 0.5);
    var height = parseInt(max_h / (img.height * scale) + 0.5);

	var c_p1_block = document.createElement('canvas');
	var pat1_block = createTextilesPattern(c_p1_block, PatternDirection.VERTICAL, PatternPart.BLOCK, width, height, facetlength, delta, smoothness, offset, steepness, depth, round, col1_rgb, col_bg);

	var c_p1_middle = document.createElement('canvas');
	var pat1_middle = createTextilesPattern(c_p1_middle, PatternDirection.VERTICAL, PatternPart.MIDDLE, width, height, facetlength, delta, smoothness, offset, steepness, depth, round, col1_rgb, col_bg);

	var c_p1_top = document.createElement('canvas');
	var pat1_top = createTextilesPattern(c_p1_top, PatternDirection.VERTICAL, PatternPart.TOP, width, height, facetlength, delta, smoothness, offset, steepness, depth, round, col1_rgb, col_bg);

	var c_p1_bottom = document.createElement('canvas');
	var pat1_bottom = createTextilesPattern(c_p1_bottom, PatternDirection.VERTICAL, PatternPart.BOTTOM, width, height, facetlength, delta, smoothness, offset, steepness, depth, round, col1_rgb, col_bg);

	var c_p2_block = document.createElement('canvas');
	var pat2_block = createTextilesPattern(c_p2_block, PatternDirection.HORIZONTAL, PatternPart.BLOCK, height, width, facetlength, delta, smoothness, offset, steepness, depth, round, col2_rgb, col_bg);

	var c_p2_middle = document.createElement('canvas');
	var pat2_middle = createTextilesPattern(c_p2_middle, PatternDirection.HORIZONTAL, PatternPart.MIDDLE, height, width, facetlength, delta, smoothness, offset, steepness, depth, round, col2_rgb, col_bg);

	var c_p2_top = document.createElement('canvas');
	var pat2_top = createTextilesPattern(c_p2_top, PatternDirection.HORIZONTAL, PatternPart.TOP, height, width, facetlength, delta, smoothness, offset, steepness, depth, round, col2_rgb, col_bg);

	var c_p2_bottom = document.createElement('canvas');
	var pat2_bottom = createTextilesPattern(c_p2_bottom, PatternDirection.HORIZONTAL, PatternPart.BOTTOM, height, width, facetlength, delta, smoothness, offset, steepness, depth, round, col2_rgb, col_bg);

	var c_ptrn = document.createElement('canvas');
	var ctx_ptrn = c_ptrn.getContext('2d');
	ctx_ptrn.imageSmoothingEnabled = false;
	for (var i=0; i<scale; i++){
		ctx_ptrn.drawImage(img, 0, 0, img.width, img.height);
		if (i >= 1){
			for(var x=0; x<i; x++)
				ctx_ptrn.drawImage(img, img.width*x, img.height*i, img.width, img.height);
			for(var y=0; y<i; y++)
				ctx_ptrn.drawImage(img, img.width*i, img.height*y, img.width, img.height);
			ctx_ptrn.drawImage(img, img.width*i, img.height*i, img.width, img.height);
		}
	}
	var imgData3 = ctx_ptrn.getImageData(0, 0, img.width*scale, img.height*scale);
	var data3 = imgData3.data;

	//console.log(img.width);
	//ctx.fillStyle = pat1;
	//ctx.fillRect(0, 0, max_w / img.width, max_h / img.height);
	var width_mul = max_w / imgData3.width;
	var height_mul = max_h / imgData3.height;

	for (var y=0; y < imgData3.height; y++){
		for (var x=0; x < imgData3.width; x++){
			var pos = x * 4 + y * imgData3.width * 4 + 0;

			// vertical color
			if (data3[pos] == 0){
				var top = x * 4 + ((y-1) < 0 ? y-1+imgData3.width : y-1) * imgData3.width * 4;
				var bottom = x * 4 + ((y+1) == imgData3.width ? 0 : y+1) * imgData3.width * 4;
			
				if (data3[top] == 0 && data3[bottom] == 0){
					ctx.fillStyle = pat1_middle;
					ctx.fillRect(x * width_mul, y * height_mul, width_mul, height_mul);
				}
				else if (data3[top] == 0 && data3[bottom] != 0){
					ctx.fillStyle = pat1_bottom;
					ctx.fillRect(x * width_mul, y * height_mul, width_mul, height_mul);
				}
				else if (data3[top] != 0 && data3[bottom] == 0){
					ctx.fillStyle = pat1_top;
					ctx.fillRect(x * width_mul, y * height_mul, width_mul, height_mul);
				}
				else{
					ctx.fillStyle = pat1_block;
					ctx.fillRect(x * width_mul, y * height_mul, width_mul, height_mul);
				}
			}

			// horizontal color
			else{
				var left = ((x-1) < 0 ? x-1+imgData3.width : x-1) * 4 + y * imgData3.width * 4;
				var right = ((x+1) == imgData3.width ? 0 : x+1)   * 4 + y * imgData3.width * 4;
			
				if (data3[left] != 0 && data3[right] == 0){
					ctx.fillStyle = pat2_bottom;
					ctx.fillRect(x * width_mul, y * height_mul, width_mul, height_mul);
				}
				else if (data3[left] == 0 && data3[right] != 0){
					ctx.fillStyle = pat2_top;
					ctx.fillRect(x * width_mul, y * height_mul, width_mul, height_mul);
				}
				else if (data3[left] != 0 && data3[right] != 0){
					ctx.fillStyle = pat2_middle;
					ctx.fillRect(x * width_mul, y * height_mul, width_mul, height_mul);
				}
				else{
					ctx.fillStyle = pat2_block;
					ctx.fillRect(x * width_mul, y * height_mul, width_mul, height_mul);
				}
			}
		}
	}
	
	delete c_p1_block;
	delete c_p1_middle;
	delete c_p1_top;
	delete c_p1_bottom;

	delete c_p2_block;
	delete c_p2_middle;
	delete c_p2_top;
	delete c_p2_bottom;

	delete c_ptrn;
	delete img;
};


function createTextilesPattern(canvas, patterndirection, patternpart, width, height, facetlength, delta, smoothness, offset, steepness, depth, round, col, col_bg){
	canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    var imgData1 = ctx.getImageData(0,0, canvas.width, canvas.height);
	var data1 = imgData1.data;

	for (var x=0; x < canvas.width; x++){
		for (var y=0; y < canvas.height; y++){
			var first = (patterndirection == PatternDirection.VERTICAL ? y / canvas.height : x / canvas.width);
			var second = (patterndirection == PatternDirection.VERTICAL ? x / canvas.height : y / canvas.width);
			var v = calcTextilesPattern(first, second, patterndirection, patternpart, facetlength, delta, smoothness, offset, steepness, depth, round);
			data1[(x + y*canvas.width) * 4 + 0] = v * col.r + ((1.0-v) * col_bg.r);
			data1[(x + y*canvas.width) * 4 + 1] = v * col.g + ((1.0-v) * col_bg.g);
			data1[(x + y*canvas.width) * 4 + 2] = v * col.b + ((1.0-v) * col_bg.b);
			data1[(x + y*canvas.width) * 4 + 3] = 255;
		}
	}
	ctx.putImageData(imgData1, 0, 0);
	//ctx.scale( max_w/ img.width, img.height);
	//ctx.drawImage(canvas, 0,0);
	return ctx.createPattern(canvas,"repeat");
}

/*
	Thanks to : A Procedural Thread Texture Model
	Neeharika Adabala and Nadia Magnenat-Thalmann
	MIRALab - University of Geneva
*/
function calcTextilesPattern(x, y, patterndirection, patternpart, facetlength, delta, smoothness, offset, steepness, depth, round){
	var delta = 1.0 / (8.0 - delta);
	var TwistTrajectory = ((Math.asin(2.0*y - 1.0) / (Math.PI/2.0) + 1.0) * facetlength) / 2.0;
	var displacement = 2.0 * ((x + TwistTrajectory) - parseInt((x + TwistTrajectory) / delta) * delta) / delta - 1.0; // added an extra "/ delta " to fix sth

	var rand_value = Math.random() * delta; // [0, delta)
	var pdisplacement = smoothness * displacement + (1.0 - smoothness) * rand_value;

	//console.log(pdis_quad);
	var TwistShading = Math.exp(-Math.abs(Math.pow(pdisplacement * depth, round ? 2 : 1)));

	var YShading = offset + (1.0 - offset) * Math.sin(y * Math.PI);
	/*if (patterndirection == PatternDirection.HORIZONTAL){
		if ((patternpart == PatternPart.TOP && x < 0.5)
			|| (patternpart == PatternPart.BOTTOM && x > 0.5)
			|| (patternpart == PatternPart.BLOCK))
			YShading = offset + (1.0 - offset) * Math.sin(y * Math.PI);
		else
			YShading = 1;
	}*/

	var tanh_value = 0.5 * steepness;
	//var tanh = (Math.exp(tanh_value) - Math.exp(-tanh_value)) / (Math.exp(tanh_value) + Math.exp(-tanh_value));

	if (patterndirection == PatternDirection.VERTICAL)
		if ((patternpart == PatternPart.TOP && x < 0.5 - (offset * 0.5) * 0.5/delta)
			|| (patternpart == PatternPart.BOTTOM && x > 0.5 + (offset * 0.5) * 0.5/delta)
			|| (patternpart == PatternPart.BLOCK))
			tanh_value = ((x < 0.5) ? x : (1.0 - x)) * steepness;
	
	if (patterndirection == PatternDirection.HORIZONTAL)
		if ((patternpart == PatternPart.TOP && x < 0.5 - (offset * 0.5) * 0.5/delta)
			|| (patternpart == PatternPart.BOTTOM && x > 0.5 + (offset * 0.5) * 0.5/delta)
			|| (patternpart == PatternPart.BLOCK))
			tanh_value = ((x < 0.5) ? x : (1.0 - x)) * steepness;

	var XShading = offset + (1.0 - offset) * rational_tanh(tanh_value);
	
	
	var ThreadShading = TwistShading * XShading * YShading;

	return ThreadShading;
}