function getImageType(){
	var select_file_type = document.getElementById('file_type');
	var file_type = select_file_type.options[select_file_type.selectedIndex].value;
	return file_type;
}

function switchJPGQual(){
	if (getImageType() != 'jpg')
		document.getElementById('file_jpg_qual').style.cssText = "display: none;";
	else
		document.getElementById('file_jpg_qual').style.cssText = "width:40px";
}

var button = document.getElementById('download');
button.addEventListener('click', function (e) {
	
	var canvas = document.getElementById("texture_preview");
	var select_img_dimen = document.getElementById('img_dimension');
	var img_dim = 0;
	if (select_img_dimen)
		img_dim = parseFloat(select_img_dimen.options[select_img_dimen.selectedIndex].value);
	//if (img_dim != 512)

	var file_name = "texture";
	
	if (document.getElementById('file_name').value != "")
		file_name = document.getElementById('file_name').value;
	
	var file_type = getImageType();
	var image_type = "image/png";
	if (file_type == "jpg")
		image_type = "image/jpeg";
		
	var qual = parseFloat( document.getElementById('file_jpg_qual').value);
	
	canvas.toBlob(function(blob) {
    	saveAs(blob, file_name + "." + file_type);
	}, image_type, qual);
});