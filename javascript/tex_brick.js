$('#brick_color').colpick({
	layout:'rgbhsbhex',
	color: {h:35, s:15, b:90},
	hue:200,
	onChange:function(hsb,hex,rgb,el) {
		$(el).css('background-color', '#'+hex);
		updateBrick();
	},
	onSubmit:function(hsb,hex,rgb,el) {
		$(el).colpickHide();
	}
}).css('background-color', '#e6d7c3');


$('#brick_grout_color').colpick({
	layout:'rgbhsbhex',
	color: {h:35, s:20, b:40},
	onChange:function(hsb,hex,rgb,el) {
		$(el).css('background-color', '#'+hex);
		updateBrick();
	},
	onSubmit:function(hsb,hex,rgb,el) {
		$(el).colpickHide();
	}
}).css('background-color', '#665e52');


function updateBrick(){
	var brick_color = rgb2hex($("#brick_color").css("background-color"));
	var grout_color = rgb2hex($("#brick_grout_color").css("background-color"));
	
	var pattern = $("input[name='brick_pattern']:checked").val();
	var groutspace = parseInt($("#brick_grout_width").val());

	var count_x = parseInt($("#brick_x").val());
	var count_y = parseInt($("#brick_y").val());

	var rotation = parseInt($("#brick_rotation").val()) * (Math.PI/180) * 0.5; //rad to deg

	var c = document.getElementById("texture_preview");
	var ctx = c.getContext("2d");

	var max_w = 512, max_h = 512;
	var width = parseInt(max_w / count_x + 0.5);
	var height = parseInt(max_h / count_y + 0.5);
	
	if (rotation != 0){
		ctx.beginPath();
		ctx.rect(0,0,max_w,max_h);
	}	

	switch(pattern){
		case "straight":
			createStraightPattern(ctx, width, height, count_x, count_y, groutspace, brick_color, grout_color);
			break;

		case "block_wide":
			createWideBlockPattern(ctx, width, height, count_x, count_y, groutspace, brick_color, grout_color);
			break;

		case "block":
			createBlockPattern(ctx, width, height, count_x, count_y, groutspace, brick_color, grout_color);
			break;

		case "circle":
			createCirclePattern(ctx, width, height, count_x, count_y, groutspace, brick_color, grout_color);
			break;

		case "edges":
			createEdgesPattern(ctx, width, height, count_x, count_y, groutspace, brick_color, grout_color);
			break;

		case "star":
			break;

		default:
			document.write("should not happen!");
			break;
	}

	if (rotation != 0){
		ctx.rotate(rotation);
		var pat=ctx.createPattern(document.getElementById("texture_preview"),"repeat");
		ctx.clearRect(0,0,max_w,max_h);
		ctx.fillStyle=pat;
		ctx.fill();
		ctx.rotate(-rotation);
	}
}


function createStraightPattern(ctx, width, height, count_x, count_y, groutspace, brick_color, grout_color){
	var half_height = parseInt(height/2.0 + 0.5);

	for (var y = 0; y < count_y+1; y++){
		for (var x = 0; x < count_x+1; x++){
			if (x%2 == 1){
				drawBrickRectangle(ctx, groutspace, brick_color, grout_color, x*width, y*height - half_height, width, (y == 0 ? height - half_height : height));
			}
			else
				drawBrickRectangle(ctx, groutspace, brick_color, grout_color, x*width, y*height, width, height);
		}
	}
}

function createWideBlockPattern(ctx, width, height, count_x, count_y, groutspace, brick_color, grout_color){
	width = parseInt(width / 2.0 + 0.5);
	height = parseInt(height / 2.0 + 0.5);
	count_y *= 2;
	count_x *= 2;

	ctx.fillStyle = grout_color;
	ctx.fillRect(0, 0, 256, 256);

	for (var y = 0; y < count_y+1; y+=2){
		for (var x = 0; x < count_x+1; x+=3){
			drawBrickRectangle(ctx, groutspace, brick_color, grout_color, x*width, y*height, width, height*2);
			drawBrickRectangle(ctx, groutspace, brick_color, grout_color, x*width + width, y*height, width*2, height);
			drawBrickRectangle(ctx, groutspace, brick_color, grout_color, x*width + width, y*height + height, width*2, height);
		}
	}
}

function createBlockPattern(ctx, width, height, count_x, count_y, groutspace, brick_color, grout_color){
	width = parseInt(width / 2.0 + 0.5);
	height = parseInt(height / 2.0 + 0.5);
	count_y *= 2;
	count_x *= 2;
	
	for (var y = 0; y < count_y+1; y+=2){
		for (var x = 0; x < count_x+1; x+=2){
			if ((x + y) % 4 == 0){
				drawBrickRectangle(ctx, groutspace, brick_color, grout_color, x*width, y*height, width, height*2);
				drawBrickRectangle(ctx, groutspace, brick_color, grout_color, x*width + width, y*height, width, height*2);
			}
			else{
				drawBrickRectangle(ctx, groutspace, brick_color, grout_color, x*width, y*height, width*2, height);
				drawBrickRectangle(ctx, groutspace, brick_color, grout_color, x*width, y*height + height, width*2, height);
			}
		}
	}
}

function createCirclePattern(ctx, width, height, count_x, count_y, groutspace, brick_color, grout_color){
	width = parseInt(width / 3.0 + 0.5);
	height = parseInt(height / 3.0 + 0.5);
	count_y *= 3;
	count_x *= 3;
	
	for (var y = 0; y < count_y+1; y+=3){
		for (var x = 0; x < count_x+1; x+=3){
			drawBrickRectangle(ctx, groutspace, brick_color, grout_color, x*width, y*height, width*2, height);
			drawBrickRectangle(ctx, groutspace, brick_color, grout_color, x*width + width, y*height + 2*height, width*2, height);
				
			drawBrickRectangle(ctx, groutspace, brick_color, grout_color, x*width, y*height + height, width, height*2);
			drawBrickRectangle(ctx, groutspace, brick_color, grout_color, x*width + 2*width, y*height, width, height*2);

			drawBrickRectangle(ctx, groutspace, brick_color, grout_color, x*width + width, y*height + height, width, height);
		}
	}
}

function createEdgesPattern(ctx, width, height, count_x, count_y, groutspace, brick_color, grout_color){
	width = parseInt(width / 2.0 + 0.5);
	height = parseInt(height / 2.0 + 0.5);
	count_y *= 2;
	count_x *= 2;

	ctx.translate(-width, -height);
	for (var y = 0; y < count_y+2; y++){
		for (var x = 0; x < count_x+2; x++){
			if (y % 4 == x % 4)
				drawBrickRectangle(ctx, groutspace, brick_color, grout_color, x*width, y*height, width*2, height);
			else if (y % 4 == (x % 4 + 1) 
				|| (y % 4 == 0 && x % 4 == 3))
				drawBrickRectangle(ctx, groutspace, brick_color, grout_color, x*width, y*height, width, height * 2);
			
		}
	}
	ctx.translate(width, height);
}


function drawBrickRectangle( ctx, groutspace, brick_col, brick_grout_col, x, y, w, h){
	ctx.fillStyle = brick_grout_col;
	ctx.fillRect(x, Math.max(y,0), w, h);

	ctx.fillStyle = brick_col;
	ctx.fillRect(x + groutspace, y + groutspace < 0 ? 0 : y + groutspace , w - groutspace*2, y + groutspace < 0 ? h - groutspace : h - groutspace*2);
}