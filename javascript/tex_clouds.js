/*function setPerlinNoise(canvas, ctx, width, height, scale, color1, color2, blur, seed, percentage)
{	
	var imgData = ctx.getImageData(0,0, width, height);
	var d = imgData.data;
	
	var col1_rgb = hexToRgb(color1);
	var col2_rgb = hexToRgb(color2);
	
		
	for (var n=blur; n >= 1; n--){
		
		var d_can = document.createElement('canvas');
		d_can.width = width;
		d_can.height = height;
		var d_ctx = d_can.getContext('2d');
		var dimgData = d_ctx.getImageData(0,0, width, height);
		var dd = dimgData.data;
		var S = new SimplexNoise(seed);
		
		for (var i=0; i<dd.length; i += 4) {
			var v = S.noise(i % width, i / width);
			//var v = PerlinNoise2D(S, i % width, i / width, 2, 2, 1);
			
			v = (v/(blur-n + 1) + 1) / 2;
			//v = Math.min(v+(1-percentage), 1);
			
			dd[i]   = v * col1_rgb.r + ((1.0-v) * col2_rgb.r);
			dd[i+1] = v * col1_rgb.g + ((1.0-v) * col2_rgb.g);
			dd[i+2] = v * col1_rgb.b + ((1.0-v) * col2_rgb.b);
			dd[i+3] = 255;
		}
		
		d_ctx.putImageData(dimgData, 0, 0);
		
		
		var d2_can = document.createElement('canvas');
		d2_can.width = width;
		d2_can.height = height;
		var d2_ctx = d2_can.getContext('2d');
		
		//if (blur == 1)
			//d2_ctx.imageSmoothingEnabled = false;
		d2_ctx.drawImage(d_can, 0, 0, d2_can.width*Math.pow(n,2) * scale, d2_can.height*Math.pow(n,2) * scale);
		
		var new_img_data = d2_ctx.getImageData(0,0, width, height);
		//if (blur > 1) 
			gaussianblur(new_img_data, width, height, Math.pow(n,2) - 1);
	
		var newd = new_img_data.data;
		for (var i=0; i<newd.length; i += 4) {
			//var v = d[i] newd[i] / 255;
			
			//d[i] = v * col1_rgb.r + ((1.0-v) * col2_rgb.r);
			//d[i+1] = v * col1_rgb.g + ((1.0-v) * col2_rgb.g);
			//d[i+2] = v * col1_rgb.b + ((1.0-v) * col2_rgb.b);
			//d[i]   = newd[i];
			//d[i+1] = newd[i+1];
			//d[i+2] = newd[i+2];
			d[i]   = (n<blur ? d[i]   + 0.5*(col1_rgb.r+col2_rgb.r)- newd[i]   : newd[i]  );
			d[i+1] = (n<blur ? d[i+1] + 0.5*(col1_rgb.g+col2_rgb.g )- newd[i+1] : newd[i+1]);
			d[i+2] = (n<blur ? d[i+2] + 0.5*(col1_rgb.b+col2_rgb.b )- newd[i+2] : newd[i+2]);
			d[i+3] = 255;
		}
		ctx.putImageData(imgData, 0, 0);
		
		delete d_can;
		delete d2_can;
	}
	
	
}*/