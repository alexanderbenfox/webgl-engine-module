import "sylvester"
module CameraUtility
{
	export function makeFrustrum(left : number, right : number, bottom : number, top : number, znear : number, zfar:number){
		let X = 2*znear / (right - left);
		let Y = 2*znear / (top - bottom);
		let A = (right + left) / (right - left);
		let B = (top + bottom) / (top - bottom);
		let C = -(zfar + znear) / (zfar - znear);
		let D = -2*zfar*znear / (zfar - znear);

		return Matrix.create([[X, 0, A, 0],
				   [0, Y, B, 0],
				   [0, 0, C, D],
				   [0, 0,-1, 0]]);
	}

	export function makePerspective(fovy : number, aspect : number, znear : number, zfar : number){
		let ymax = znear * Math.tan(fovy * Math.PI / 360.0);
		let ymin = -ymax;
		let xmin = ymin * aspect;
		let xmax = ymax * aspect;

		return makeFrustrum(xmin, xmax, ymin, ymax, znear, zfar);
	}

	export function makeOrtho(left : number, right : number, bottom : number, top : number, znear : number, zfar : number)
	{
	    let tx = -(right + left) / (right - left);
	    let ty = -(top + bottom) / (top - bottom);
	    let tz = -(zfar + znear) / (zfar - znear);

	    return Matrix.create([[2/(right-left), 0, 0, tx],
	               [0, 2/(top-bottom), 0, ty],
	               [0, 0, -2/(zfar-znear), tz],
	               [0, 0, 0, 1]]);
	}
}