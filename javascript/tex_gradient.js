$('.slider').colpick({
	layout:'rgbhsbhex',
	color: {h:35, s:15, b:90},
	hue:200,
	onChange:function(hsb,hex,rgb,el) {
		$(el).css('background-color', '#'+hex);
		updateGradient();
	},
	onSubmit:function(hsb,hex,rgb,el) {
		$(el).colpickHide();
	}
}).css('background-color', '#e6d7c3');


$(".slider_area" ).click(function(evt) {
	var x = Math.max(evt.pageX - $(this).offset().left, 0);
	var new_slider = $('.slider')[0].cloneNode(true);
	$(new_slider).css('left', Math.max(x - 5, 0));
	
	$(new_slider).draggable({ 
		//axis: "x", 
		grid: [ 1, 50 ],
		//containment: ".slider_area", 
		//scroll: false,
		drag: function() {
			updateGradient();
		},
	});
	
	$(new_slider).colpick({
		layout:'rgbhsbhex',
		color: {h:0, s:100, b:0},
		hue:200,
		onChange:function(hsb,hex,rgb,el) {
			$(el).css('background-color', '#'+hex);
			updateGradient();
		},
		onSubmit:function(hsb,hex,rgb,el) {
			$(el).colpickHide();
		}
	}).css('background-color', '#ffffff');
	
	$('.slider_area').append(new_slider);
	
	updateGradient();
	//alert( "Position: " + x );
});


$( ".slider" ).draggable({ 
	axis: "x", 
	grid: [ 1, 40 ],
	//cursorAt: { left: -5 },
	drag: function() {
        updateGradient();
    },
});
	
$(".slider_area").droppable({
	out: function (event, ui) {
        $(ui.draggable).remove();
    }
});


function updateGradient(){
	var colors = [];
	
	$(".slider").each(function( index ) {
		var pos = $(this).css("left");
		pos = pos.substring(0, pos.length - 2);
		var percentage = Math.min(parseFloat(pos) + 5, 256) / 2.56;
	
		colors.push([rgb2hex($(this).css("background-color")), percentage]);
	});
	
	
	gradient_type = $("select#gradient_type option:selected").val();
	//document.write(gradient_type);
	setGradientColors(colors, gradient_type);
}

function percentage_compare (a,b) {
  // I'm assuming all values are numbers
  return a[1] - b[1];
}

function setGradientColors(colors, gradient_type){
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
		grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256); //x1,y1,r1 ,x1,y1,r1
	
	var gradient_text = 'linear-gradient(to right';
	
	colors.forEach(function(col) {
		gradient_text += ', ' + col[0] + ' ' + Math.max(col[1],0) + '%';
		grad.addColorStop(Math.max(col[1],0) / 100, col[0]);
	});
	
	$(".gradient_preview").css('background', gradient_text); // W3C
	
	
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

