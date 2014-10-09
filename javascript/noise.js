// Ported from Stefan Gustavson's java implementation
// http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
//

var SimplexNoise = function(seed) {
	this.grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0], 
                  [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1], 
                  [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]]; 
	this.p = [];
	
	for (var i=0; i<256; i++) {
		this.p[i] = fastfloor(seed == undefined ? Math.random()*256 : randomSeed(seed++)*256);
	}
  
	// To remove the need for index wrapping, double the permutation table length 
	this.perm = [];
	this.permMod12 = []
	for(var i=0; i<512; i++) {
		this.perm[i]=this.p[i & 255];
		this.permMod12[i] = (this.perm[i] % 12);
	} 
	
	// Skewing and unskewing factors for 2 dimensions
	this.F2 = 0.5*(Math.sqrt(3.0)-1.0); 
	this.G2 = (3.0-Math.sqrt(3.0))/6.0; 
};

 
 
SimplexNoise.prototype.dot = function(g, x, y) { 
	return g[0]*x + g[1]*y;
};


SimplexNoise.prototype.fractalnoise = function(xin, yin, minfreq, maxfreq){
	var value = 0;
	for (var f = minfreq; f < maxfreq; f *= 2)
		value += this.noise(xin * f, yin * f)/f;
	return value;
}

SimplexNoise.prototype.turbulence = function(xin, yin, minfreq, maxfreq){
	var value = 0;
	for (var f = minfreq; f < maxfreq; f *= 2)
		value += Math.abs(this.noise(xin * f, yin * f))/f;
	return value;
}


// 2D Scaled Multi-octave Simplex noise.
//
// Returned value will be between loBound and hiBound. 
// persistence [0-1]
SimplexNoise.prototype.scaled_octave_noise_2d = function( octaves, persistence, scale, loBound, hiBound, x, y ) {
    return this.octave_noise_2d(octaves, persistence, scale, x, y) * (hiBound - loBound) / 2 + (hiBound + loBound) / 2;
}

// 2D Multi-octave Simplex noise.
//
// For each octave, a higher frequency/lower amplitude function will be added to the original.
// The higher the persistence [0-1], the more of each succeeding octave will be added.
SimplexNoise.prototype.octave_noise_2d = function( octaves, persistence, scale, x, y ) {
    var total = 0;
    var frequency = scale;
    var amplitude = 1;

    // We have to keep track of the largest possible amplitude,
    // because each octave adds more, and we need a value in [-1, 1].
    var maxAmplitude = 0;

    for( var i=0; i < octaves; i++ ) {
        total += this.noise( x * frequency, y * frequency ) * amplitude;

        frequency *= 2;
        maxAmplitude += amplitude;
        amplitude *= persistence;
    }

    return total / maxAmplitude;
}

SimplexNoise.prototype.noise = function(xin, yin) { 
	var n0, n1, n2; // Noise contributions from the three corners 
	// Skew the input space to determine which simplex cell we're in 
	
	var s = (xin+yin)*this.F2; // Hairy factor for 2D 
	var i = fastfloor(xin+s); 
	var j = fastfloor(yin+s); 
	
	var t = (i+j)*this.G2; 
	var X0 = i-t; // Unskew the cell origin back to (x,y) space 
	var Y0 = j-t; 
	var x0 = xin-X0; // The x,y distances from the cell origin 
	var y0 = yin-Y0; 
	
	// For the 2D case, the simplex shape is an equilateral triangle. 
	// Determine which simplex we are in. 
	var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords 
	if(x0>y0)
		{i1=1; j1=0;} // lower triangle, XY order: (0,0)->(1,0)->(1,1) 
	else 
		{i1=0; j1=1;}      // upper triangle, YX order: (0,0)->(0,1)->(1,1) 
	
	// A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and 
	// a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where 
	// c = (3-sqrt(3))/6 
	var x1 = x0 - i1 + this.G2; // Offsets for middle corner in (x,y) unskewed coords 
	var y1 = y0 - j1 + this.G2; 
	var x2 = x0 - 1.0 + 2.0 * this.G2; // Offsets for last corner in (x,y) unskewed coords 
	var y2 = y0 - 1.0 + 2.0 * this.G2; 
	
	// Work out the hashed gradient indices of the three simplex corners 
	var ii = i & 255; 
	var jj = j & 255; 
	var gi0 = this.permMod12[ii+this.perm[jj]]; 
	var gi1 = this.permMod12[ii+i1+this.perm[jj+j1]];
	var gi2 = this.permMod12[ii+1+this.perm[jj+1]];
	
	// Calculate the contribution from the three corners 
	var t0 = 0.5 - x0*x0-y0*y0; 
	if(t0<0) 
		n0 = 0.0; 
	else { 
		t0 *= t0; 
		n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0);  // (x,y) of grad3 used for 2D gradient 
	} 
	var t1 = 0.5 - x1*x1-y1*y1; 
	if(t1<0) 
		n1 = 0.0; 
	else { 
		t1 *= t1; 
		n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1); 
	}
	var t2 = 0.5 - x2*x2-y2*y2; 
	if(t2<0) 
		n2 = 0.0; 
	else { 
		t2 *= t2; 
		n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2); 
	} 
	
	// Add contributions from each corner to get the final noise value. 
	// The result is scaled to return values in the interval [-1,1]. 
	
	var r = 70.0 * (n0 + n1 + n2);
	//r = (r + 1) / 2; //interval [0,1]. 
	return r;
};