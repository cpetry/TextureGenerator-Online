
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

function updateTextiles(){
	var color1 = rgb2hex($("#textiles_color1").css("background-color"));
	var color2 = rgb2hex($("#textiles_color2").css("background-color"));

	var scale_x = parseFloat($("#textiles_x").val());
	var scale_y = parseFloat($("#textiles_y").val());
	
	var facetlength = parseFloat($("#textiles_tightness").val()); // [0,1] , default 0.5
	var delta = parseFloat($("#textiles_thickness").val()); // thickness, (0, 1]
	var smoothness = 1.0 - parseFloat($("#textiles_smoothness").val()); // [0,1]
	var offset = parseFloat($("#textiles_offset").val()); // [0,1] , default 0.3
	var steepness = facetlength; // default facetlength, can be anything else

	// own parameter
	var depth = 1; // [1,3] , default 1
	var round = true;
	var max_w = 512;
	var max_h = 512;
	var c = document.getElementById("texture_preview");
	var ctx = c.getContext("2d");
	
	var col_bg = 0;
	var col1_rgb = hexToRgb(color1);
	var col2_rgb = hexToRgb(color2);

	//ctx.drawImage(can2, 0, 0, max_w, max_h);

	var img = document.createElement('img');
	img.src = './pattern/pat1.png';
	img.onload = function() {
		var c_p1 = document.createElement('canvas');
	    c_p1.width = parseInt(max_w / this.width + 0.5);
	    c_p1.height = parseInt(max_h / this.height + 0.5);
	    var ctx_p1 = c_p1.getContext('2d');
	    var imgData1 = ctx_p1.getImageData(0,0, c_p1.width, c_p1.height);
		var data1 = imgData1.data;

		for (var x=0; x < c_p1.width; x++){
			for (var y=0; y < c_p1.height; y++){
				var v = setTextiles(x / c_p1.width, y / c_p1.height, facetlength, delta, smoothness, offset, steepness, depth, round);
				data1[(x + y*c_p1.width) * 4 + 0] = v * col1_rgb.r + ((1.0-v) * col_bg);
				data1[(x + y*c_p1.width) * 4 + 1] = v * col1_rgb.g + ((1.0-v) * col_bg);
				data1[(x + y*c_p1.width) * 4 + 2] = v * col1_rgb.b + ((1.0-v) * col_bg);
				data1[(x + y*c_p1.width) * 4 + 3] = 255;
			}
		}
		ctx_p1.putImageData(imgData1, 0, 0);
		//ctx_p1.scale( max_w/ this.width, this.height);
		//ctx_p1.drawImage(c_p1, 0,0);
		var pat1=ctx_p1.createPattern(c_p1,"repeat");

		var c_p2 = document.createElement('canvas');
	    c_p2.width = parseInt(max_w / this.width + 0.5);
	    c_p2.height = parseInt(max_h / this.height + 0.5);
	    var ctx_p2 = c_p2.getContext('2d');
	    var imgData2 = ctx_p2.getImageData(0,0, c_p2.width, c_p2.height);
		var data2 = imgData2.data;

		for (var x=0; x < c_p2.width; x++){
			for (var y=0; y < c_p2.height; y++){
				var v = setTextiles(x / c_p2.width, y / c_p2.height, facetlength, delta, smoothness, offset, steepness, depth, round);
				data2[(x + y*c_p2.width) * 4 + 0] = v * col2_rgb.r + ((1.0-v) * col_bg);
				data2[(x + y*c_p2.width) * 4 + 1] = v * col2_rgb.g + ((1.0-v) * col_bg);
				data2[(x + y*c_p2.width) * 4 + 2] = v * col2_rgb.b + ((1.0-v) * col_bg);
				data2[(x + y*c_p2.width) * 4 + 3] = 255;
			}
		}

		ctx_p2.putImageData(imgData2, 0, 0);
		var pat2=ctx_p2.createPattern(c_p2,"repeat");

		var c_ptrn = document.createElement('canvas');
		var ctx_ptrn = c_ptrn.getContext('2d');
		ctx_ptrn.drawImage(this, 0, 0 );
		var imgData3 = ctx_ptrn.getImageData(0, 0, this.width, this.height);
		var data3 = imgData3.data;

		console.log(this.width);
		ctx.fillStyle = pat1;
		ctx.fillRect(0, 0, max_w / this.width, max_h / this.height);

		for (var y=0; y < this.height; y++){
			for (var x=0; x < this.width; x++){
				if (data3[x * 4 + y * this.width * 4 + 0] == 0){
					ctx.fillStyle = pat1;
					ctx.fillRect(x * max_w / this.width, y * max_h / this.height, max_w / this.width, max_h / this.height);
				}
				else{
					ctx.fillStyle = pat2;
					ctx.fillRect(x * max_w / this.width, y * max_h / this.height, max_w / this.width, max_h / this.height);
				}
			}
		}
		delete c_p2;
		delete c_p1;
		delete c_ptrn;
		delete this;
	};
	
	
}

/*
	Thanks to : A Procedural Thread Texture Model
	Neeharika Adabala and Nadia Magnenat-Thalmann
	MIRALab - University of Geneva
*/
function setTextiles(x, y, facetlength, delta, smoothness, offset, steepness, depth, round){
	var TwistTrajectory = ((Math.asin(2.0*y - 1.0) / (Math.PI/2.0) + 1.0) * facetlength) / 2.0;
	var displacement = 2.0 * ((x + TwistTrajectory) - parseInt((x + TwistTrajectory) / delta) * delta) / delta - 1.0; // added an extra "/ delta " to fix sth

	var rand_value = Math.random() * delta; // [0, delta)
	var pdisplacement = smoothness * displacement + (1.0 - smoothness) * rand_value;

	//console.log(pdis_quad);
	var TwistShading = Math.exp(-Math.abs(Math.pow(pdisplacement * depth, round ? 2 : 1)));

	var YShading = offset + (1.0 - offset) * Math.sin(y * Math.PI);

	var tanh_value = ((x < 0.5) ? x : (1.0 - x)) * steepness;
	//var tanh = (Math.exp(tanh_value) - Math.exp(-tanh_value)) / (Math.exp(tanh_value) + Math.exp(-tanh_value));
	var XShading = offset + (1.0 - offset) * rational_tanh(tanh_value);
	
	var ThreadShading = TwistShading * XShading * YShading;

	return ThreadShading;
}