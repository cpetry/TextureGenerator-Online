/*
 * Author: Christian Petry
 * Homepage: www.petry-christian.de
 *
 * License: MIT
 * Copyright (c) 2014 Christian Petry
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, 
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or 
 * substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR 
 * OTHER DEALINGS IN THE SOFTWARE.
 */
 
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