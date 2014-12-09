
$('#clouds_color1').colpick({
	layout:'rgbhsbhex',
	color: {h:300, s:0, b:100},
	hue:200,
	onChange:function(hsb,hex,rgb,el) {
		$(el).css('background-color', '#'+hex);
		updateTexture();
	},
	onSubmit:function(hsb,hex,rgb,el) {
		$(el).colpickHide();
	}
}).css('background-color', '#ffffff');


$('#clouds_color2').colpick({
	layout:'rgbhsbhex',
	color: {h:216, s:68, b:51},
	onChange:function(hsb,hex,rgb,el) {
		$(el).css('background-color', '#'+hex);
		updateTexture();
	},
	onSubmit:function(hsb,hex,rgb,el) {
		$(el).colpickHide();
	}
}).css('background-color', '#2a4d82');

function updateClouds(){
	var color1 = rgb2hex($("#clouds_color1").css("background-color"));
	var color2 = rgb2hex($("#clouds_color2").css("background-color"));

	var scale = parseFloat($("#clouds_scale").val()) * 2;
	
	var persistence = parseFloat($("#clouds_detail").val());
	var percentage = parseFloat($("#clouds_percentage").val());
	
	var seed = parseInt($("#clouds_seed").val());
	var octaves = parseInt($("#clouds_octaves").val());
	
	var type = "PerlinNoise";//$("#perlin_noise_type>option:selected").val();
	//document.write(type);
	setPerlinNoise(color1, color2, type, 7, persistence, scale, seed, percentage);
}