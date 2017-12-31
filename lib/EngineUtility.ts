import {mat4} from "gl-matrix"

export class Vector2{
	protected _x : number;
	protected _y : number;
	constructor(x : number, y : number){
		this._x = x;
		this._y = y;
	}
	get x() : number{
		return this._x;
	}
	set x(n : number){
		this.x = n;
	}

	get y() : number{
		return this._y;
	}
	set y(n : number){
		this.y = n;
	}

	static zero() : Vector2{
		return new Vector2(0,0);
	}

	checkZero() : boolean{
		return this._x == 0 && this._y == 0;
	}
}

export class Vector3 extends Vector2{
	protected _z : number;
	constructor(x: number, y : number, z : number){
		super(x,y);
		this._z = z;
	}

	get z() : number {
		return this._z;
	}
	set z(n : number){
		this.z = n;
	}

	static zero() : Vector3{
		return new Vector3(0,0,0);
	}

	static zAxis() : Vector3{
		return new Vector3(0,0,1);
	}

	static yAxis() : Vector3{
		return new Vector3(0,1,0);
	}

	static xAxis() : Vector3{
		return new Vector3(1,0,0);
	}

	checkZero() : boolean{
		return super.checkZero() && this._z == 0;
	}

	toArray() : number[] {
		return [this.x,this.y,this.z];
	}

	sub(b : Vector3) : Vector3 {
		return new Vector3(this.x - b.x, this.y - b.y, this.z - b.z);
	}

	cross(b : Vector3) : Vector3{
		let a = this;
		let x = a.y * b.z - a.z*b.y;
		let y = a.z * b.x - a.x*b.z;
		let z = a.x * b.y - a.y*b.x;
		return new Vector3(x, y, z);

	}

	dot(b : Vector3) : number{
		let a = this;
		return a.x*b.x + a.y*b.y + a.z*b.z;
	}

	magnitude() : number{
		let a = this;
		return Math.sqrt(a.x * a.x + a.y*a.y + a.z * a.z);
	}

	angleBetween(b : Vector3) : number { //returns in radians
		//a.b = |a||b|cos(theta)
		let dot = this.dot(b);
		let cosTerm = dot/(this.magnitude() * b.magnitude());
		let theta = Math.acos(cosTerm);
		return theta;
	}

	normalize() : Vector3 {
		let mag = this.magnitude();
		if (mag < 0.000001)
			return new Vector3(0,0,0);
		return new Vector3(this.x/mag, this.y/mag, this.z/mag);
	}
}

export class Vector4 extends Vector3{
	protected _w : number;
	constructor(x : number, y : number, z :number , w : number){
		super(x,y,z);
		this._w = w;
	}

	get w() : number {
		return this._w;
	}
	set w(n : number){
		this.w = n;
	}
}

export function inBounds2D(topLeft : Vector2, bottomRight : Vector2, boundSize : Vector2) : boolean{
	if(boundSize.x > topLeft.x && boundSize.x < bottomRight.x){
		if(boundSize.y > topLeft.y && boundSize.y < bottomRight.y)
			return true;
	}
	return false;
}

export function computeMatrix(relativeToMatrix, outputMatrix, position : Vector3, rotation : Vector3){
	//setup projection stuff later (camera??)
	let xAxis = new Vector3(1,0,0);
	let yAxis = new Vector3(0,1,0);
	let zAxis = new Vector3(0,0,1);
	mat4.translate(outputMatrix,     // destination matrix
				relativeToMatrix,     // matrix to translate (usually origin)
				position.toArray());  // amount to translate
	mat4.rotate(outputMatrix,  // destination matrix
	            relativeToMatrix,  // matrix to rotate
	            rotation.x,     // amount to rotate in radians
	            xAxis.toArray());       // axis to rotate around (x)
	mat4.rotate(outputMatrix,  // destination matrix
	            relativeToMatrix,  // matrix to rotate
	            rotation.y,// amount to rotate in radians
	            yAxis.toArray());       // axis to rotate around (y)
	mat4.rotate(outputMatrix,  // destination matrix
	            relativeToMatrix,  // matrix to rotate
	            rotation.z,// amount to rotate in radians
	            zAxis.toArray());       // axis to rotate around (z)
}