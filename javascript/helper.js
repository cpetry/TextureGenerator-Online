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
	$("#types>option").map(function() {
		if ($(this).val() != type)
			$('#' + $(this).val()).hide(); 
	});
	//document.write(type);
	$('#' + type).show();

	updateTexture();
}
							
function updateTexture(){
	var rotation = parseInt($("#rotation").val()) * (Math.PI/180); //rad to deg

	var c = document.getElementById("texture_preview");
	var ctx = c.getContext("2d");

	var max_w = 512, max_h = 512;
	
	

	switch($("#types>option:selected").val()){
		case "Brick":
			updateBrick();
			break;
		case "Checker":
			updateChecker();
			break;
		case "Textiles":
			updateTextiles();
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