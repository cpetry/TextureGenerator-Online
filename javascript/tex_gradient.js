$('.test_color').colpick({
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


function updateGradient(){
	var colors = [];
	colors.push([rgb2hex($(".test_color").css("background-color")), 0]);
	
	setPreviewColors(colors);
}

$(".slider_area" ).click(function(evt) {
	var x = evt.pageX - $(this).offset().left;
	alert( "Position: " + x );
});


function setPreviewColors(colors){
	//document.write(colors[0][1]);
	
	// only the one the browser supports, will be applied!
	$(".gradient_preview").css('background', colors[0][0]); // Old browsers 
	$(".gradient_preview").css('background', '-webkit-linear-gradient(top, ' + colors[0][0] + ' ' + colors[0][1] + '%, #7db9e8 100%)'); // Chrome10+,Safari5.1+
	$(".gradient_preview").css('background', '-webkit-gradient(linear, left top, right top, color-stop(' + colors[0][1] + '%,' + colors[0][0] + '),color-stop(100%, #7db9e8)'); // Chrome10+,Safari5.1+
	$(".gradient_preview").css('background', 'linear-gradient(to right, ' + colors[0][0] + ' ' + colors[0][1] + '%, #7db9e8 100%)'); // W3C
	
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