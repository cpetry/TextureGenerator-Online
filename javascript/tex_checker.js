
$('.checker_color1').colpick({
	layout:'rgbhsbhex',
	color: {h:35, s:15, b:90},
	hue:200,
	onChange:function(hsb,hex,rgb,el) {
		$(el).css('background-color', '#'+hex);
		updateTiling();
	},
	onSubmit:function(hsb,hex,rgb,el) {
		$(el).colpickHide();
	}
}).css('background-color', '#e6d7c3');


$('.checker_color2').colpick({
	layout:'rgbhsbhex',
	color: {h:35, s:20, b:40},
	onChange:function(hsb,hex,rgb,el) {
		$(el).css('background-color', '#'+hex);
		updateTiling();
	},
	onSubmit:function(hsb,hex,rgb,el) {
		$(el).colpickHide();
	}
}).css('background-color', '#665e52');


function updateChecker(){
	var color1 = rgb2hex($(".checker_color1").css("background-color"));
	var color2 = rgb2hex($(".checker_color2").css("background-color"));
	
	//setChecker(tiles_color, x_tiling, y_tiling, grout_color, x_grout, y_grout, tiles_gradient_color, x_tiles_gradient, y_tiles_gradient, grout_gradient_color);
}