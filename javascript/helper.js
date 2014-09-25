function rgb2hex(rgb){
	 rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	 return "#" +
	  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
	  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
	  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2);
}

// result is either 1 or 0
function randomSeed(seed, percentage) {
	percentage = (typeof percentage === "undefined") ? 1.00 : percentage;
	
    var x = Math.sin(seed) * 10000;
    return parseInt((x - Math.floor(x)) + (1.00 - percentage));
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
		case "Tiles":
			updateTiling();
			break;
		case "Gradient":
			updateGradient();
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