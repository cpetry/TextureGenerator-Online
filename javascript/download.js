var button = document.getElementById('download');
button.addEventListener('click', function (e) {
	
	var filesize = 0;
	var qual = 0.9;
	var pic;
	
	var canvas = document.getElementById("texture_preview");
	button.download="texture.jpg";
	
	
	// reduce file size so that it can be downloaded
	do{
		pic = canvas.toDataURL('image/jpeg', qual);
		filesize = pic.length;
		//console.log("size of pic: " + filesize); 
		qual -= 0.1;
	}while(filesize >= 2000000);
	//pic.src.replace("image/png", "image/octet-stream");
	
    button.href = pic;
});