function Vec3(x, y, z){
	this.x = x;
	this.y = y;
	this.z = z;
}

function setVec3(out, x, y, z){
	out.x = x;
	out.y = y;
	out.z = z;
}

function subtractVec3(out, a, b){
	out.x = a.x - b.x;
	out.y = a.y - b.y;
	out.z = a.z - b.z;
}
function addVec3(out, a, b){
	out.x = a.x + b.x;
	out.y = a.y + b.y;
	out.z = a.z + b.z;
}

function normalizeVec3(out) {
    var len = out.x*out.x + out.y*out.y + out.z*out.z;
    if (len > 0) {
        len = Q_rsqrt(len);
        out.x = out.x * len;
        out.y = out.y * len;
        out.z = out.z * len;
    }
};