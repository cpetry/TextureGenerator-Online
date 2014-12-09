function rgb2hex(rgb){
	 rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	 return "#" +
	  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
	  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
	  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2);
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// result is either 1 or 0
function random10Seed(seed, percentage) {
	percentage = (typeof percentage === "undefined") ? 1.00 : percentage;
	
    var x = Math.sin(seed) * 10000;
    return parseInt((x - Math.floor(x)) + (1.00 - percentage));
}

function randomSeed(seed) {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}


// This method is a *lot* faster than using (int)Math.floor(x)
function fastfloor(x){
	var xi = parseInt(x);
	return x<xi ? xi-1 : xi;
}

Number.prototype.fastmod = function(n) {
return ((this % n) + n) % n;
}


function rational_tanh(x)
{
    if( x < -3 )
        return -1;
    else if( x > 3 )
        return 1;
    else
        return x * ( 27 + x * x ) / ( 27 + 9 * x * x );
}

function showType(type){
	var id = type.substring(5);
	console.log(id);
	if (!$('#' + id).attr('id'))
		return;

	$('.type_settings').each(function() {
		if ($(this).attr('id') != id)
			$(this).hide();
	});

	$('.texture_type_selected').each(function() {
		$(this).toggleClass('texture_type_selected texture_type');
	});

	$('#' + type).toggleClass('texture_type texture_type_selected');
	//elem.setAttribute('class', 'texture_type_selected');
	//document.write(type);
	$('#' + id).show();

	updateTexture();
}
							
function updateTexture(){
	//console.log("UT");
	var rotation = parseInt($("#rotation").val()) * (Math.PI/180); //rad to deg

	var c = document.getElementById("texture_preview");
	var ctx = c.getContext("2d");

	var max_w = 512, max_h = 512;
	
	var type = $(".texture_type_selected").first().attr('id').substring(5);
	//console.log(type);

	switch(type){
		case "Brick":
			updateBrick();
			break;
		case "Clouds":
			updateClouds();
			break;
		case "Checker":
			updateChecker();
			break;
		case "Textiles":
			updateTextiles();
			break;
		case "Terrain":
			updateTerrain();
			break;
		case "Tiles":
			updateTiling();
			break;
		case "Gradient":
			updateGradient();
			break;
		case "PerlinNoise":
			updatePerlinNoise();
			break;
	}
	
	if (rotation != 0){
		ctx.beginPath();
		ctx.rect(0,0,max_w,max_h);
		ctx.translate(max_w/2, max_h/2);
		ctx.rotate(rotation);
		ctx.translate(-max_w/2, -max_h/2);

		var pat=ctx.createPattern(document.getElementById("texture_preview"),"repeat");

		ctx.clearRect(-max_w/2,-max_h/2,max_w/2,max_h/2);
		ctx.fillStyle=pat;
		ctx.fill();
		ctx.translate(max_w/2, max_h/2);
		ctx.rotate(-rotation);
		ctx.translate(-max_w/2, -max_h/2);
	}	
}




function percentage_compare (a,b) {
  // I'm assuming all values are numbers
  return a[1] - b[1];
}



function setGradientColors(colors, gradient_type, tex_type){
	//document.write(colors[0][1]);
	
	// only the one the browser supports, will be applied!
	
	//$(".gradient_preview").css('background', colors[0][0]); // Old browsers 
	//$(".gradient_preview").css('background', '-webkit-linear-gradient(top, ' + colors[0][0] + ' ' + colors[0][1] + '%, #7db9e8 100%)'); // Chrome10+,Safari5.1+
	//$(".gradient_preview").css('background', '-webkit-gradient(linear, left top, right top, color-stop(' + colors[0][1] + '%,' + colors[0][0] + '),color-stop(100%, #7db9e8)'); // Chrome10+,Safari5.1+
	//$(".gradient_preview").css('background', 'linear-gradient(to right, ' + colors[0][0] + ' ' + colors[0][1] + '%, #7db9e8 100%)'); // W3C
	colors.sort(percentage_compare);
	
	
	var c = document.getElementById("texture_preview");
	var ctx = c.getContext("2d");
	
	var grad;
	if (gradient_type == 'linear')
		grad = ctx.createLinearGradient(0,0,512,0);
		
	else if (gradient_type == 'radial')
		grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 362); //x1,y1,r1 ,x1,y1,r1
	
	var gradient_text = 'linear-gradient(to right';
	
	colors.forEach(function(col) {
		gradient_text += ', ' + col[0] + ' ' + Math.max(col[1],0) + '%';
		grad.addColorStop(Math.max(col[1],0) / 100, col[0]);
	});
	
	$("." + tex_type + "_gradient_preview").css('background', gradient_text); // W3C
	
	
	ctx.fillStyle = grad;
	ctx.fillRect(0, 0, 512, 512);
	
	/*
	background: #1e5799; // Old browsers 
	background: -moz-linear-gradient(top, #1e5799 0%, #1e5799 22%, #2989d8 50%, #207cca 51%, #1e5799 71%, #1e5799 71%, #7db9e8 100%); // FF 3.6+ 
	background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#1e5799), color-stop(22%,#1e5799), color-stop(50%,#2989d8), 
				color-stop(51%,#207cca), color-stop(71%,#1e5799), color-stop(71%,#1e5799), color-stop(100%,#7db9e8)); // Chrome,Safari4+ 
				
	background: -webkit-linear-gradient(top, #1e5799 0%,#1e5799 22%,#2989d8 50%,#207cca 51%,#1e5799 71%,#1e5799 71%,#7db9e8 100%); // Chrome10+,Safari5.1+
	background: -o-linear-gradient(top, #1e5799 0%,#1e5799 22%,#2989d8 50%,#207cca 51%,#1e5799 71%,#1e5799 71%,#7db9e8 100%); // Opera 11.10+ 
	background: -ms-linear-gradient(top, #1e5799 0%,#1e5799 22%,#2989d8 50%,#207cca 51%,#1e5799 71%,#1e5799 71%,#7db9e8 100%); // IE10+
	background: linear-gradient(to bottom, #1e5799 0%,#1e5799 22%,#2989d8 50%,#207cca 51%,#1e5799 71%,#1e5799 71%,#7db9e8 100%); // W3C
	filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#1e5799', endColorstr='#7db9e8',GradientType=0 ); // IE6-9 
	*/
}



function createGradientSlider(pos, col, tex_type){
	
	var newslider = jQuery('<div/>', {
		class: "slider_" + tex_type,
		style: 'left:' + pos + 'px',
	}).appendTo(".slider_area_" + tex_type);
	
	newslider.colpick({
		layout:'rgbhsbhex',
		color: col,
		onChange:function(hsb,hex,rgb,el) {
			$(el).css('background-color', '#'+hex);
			updateTexture();
		},
		onSubmit:function(hsb,hex,rgb,el) {
			$(el).colpickHide();
		}
	}).css('background-color', '#' + col);
	
	
	newslider.draggable({ 
		//axis: "x", 
		grid: [ 1, 50 ],
		containment: ".slider_area_" + tex_type,
		scroll: false,
		drag: function() {
			updateTexture();
		},
	});
}