
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
	var percentage1 = 1;

	var x_checker = parseInt($("#checker_x").val());
	var y_checker = parseInt($("#checker_y").val());
	
	var seed = parseInt($("#checker_seed").val());
	var percentage1 = parseFloat($("#checker_percentage").val());

	setChecker(x_checker, y_checker, color1, color2, seed, percentage1);
}

function setChecker(x_checker, y_checker, color1, color2, seed, percentage1)
{
	var c = document.getElementById("texture_preview");
	var ctx = c.getContext("2d");

	var max_w = 512, max_h = 512;
	
	// color2
	ctx.fillStyle = color2; // hex col
	ctx.fillRect(0,0,max_w,max_h); // fillRect(x,y,width,height)

	var checker_width  = max_w / x_checker; 
	var checker_height = max_h / y_checker; 
	var incr_seed = seed;

	for (var y=0; y < y_checker; y++)
		for (var x=0; x < x_checker; x++)
			if ((x+y) % 2 == 0 && randomSeed(incr_seed++, percentage1) < 1)
				drawCheckerRectangle(ctx, checker_width * x, checker_height * y, checker_width, checker_height, color1);
}

function drawCheckerRectangle(ctx, start_x, start_y, width, height, col){
	ctx.fillStyle = col;
	ctx.fillRect(start_x, start_y, width, height);
}