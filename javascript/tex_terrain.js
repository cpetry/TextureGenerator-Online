$(".slider_area_terrain" ).click(function(evt) {
	var x = Math.min(Math.max(evt.pageX - $(this).offset().left, 0), 255);
	
	createGradientSlider(x, 'ffffff', 'terrain');
	
	updateTexture();
	//alert( "Position: " + x );
});

$(".slider_area_terrain").droppable({
	out: function (event, ui) {
		//document.write($(ui.draggable).position().left);
		if ($(ui.draggable).position().left < 250)
			$(ui.draggable).remove();
    }
});

createGradientSlider(0, 'e6d7c3', 'terrain');
createGradientSlider(96, '262626', 'terrain');
createGradientSlider(178, '665e52', 'terrain');

function updateTerrain(){
	var colors = [];
	
	$(".slider_terrain").each(function( index ) {
		var pos = $(this).css("left");
		pos = pos.substring(0, pos.length - 2);
		var percentage = Math.min(parseFloat(pos) - 5, 255) / 2.56;
	
		colors.push([rgb2hex($(this).css("background-color")), percentage]);
	});
	
	
	gradient_type = "linear";//$("select#gradient_type option:selected").val();
	//document.write(gradient_type);
	setGradientColors(colors, gradient_type, 'terrain');
}