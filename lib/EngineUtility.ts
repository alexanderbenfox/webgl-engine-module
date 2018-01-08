import {mat4} from "gl-matrix"

export interface EditorProperty{
	elements : HTMLElement[];
	showEditorProperty() : void;
	hideEditorProperty() : void;
}

export class Vector2 implements EditorProperty{
	protected _x : number;
	protected _y : number;
	elements : HTMLElement[] = [];

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

	cross(b : Vector2) : Vector2{
		let a = this;
		let x = a.y * b.x - a.x*b.y;
		let y = a.x * b.y - a.y*b.x;
		return new Vector2(x, y);

	}

	dot(b : Vector2) : number{
		let a = this;
		return a.x*b.x + a.y*b.y;
	}

	add(b : Vector2) : Vector2{
		return new Vector2(this.x + b.x, this.y + b.y);
	}

	sub(b : Vector2) : Vector2 {
		return new Vector2(this.x - b.x, this.y - b.y);
	}

	magnitude() : number{
		let a = this;
		return Math.sqrt(a.x * a.x + a.y*a.y);
	}

	normalize() : Vector2 {
		let mag = this.magnitude();
		if (mag < 0.000001)
			return new Vector2(0,0);
		return new Vector2(this.x/mag, this.y/mag);
	}

	static getMinMaxProjections(vectors : Vector2[], axis : Vector2) : any{
		let minProj = vectors[1].dot(axis);
		let minDot = 1;
		let maxProj = vectors[1].dot(axis);
		let maxDot = 1;

		for(let i = 2; i < vectors.length; i++){
			let currProj = vectors[i].dot(axis);

			if(minProj > currProj) minProj = currProj; minDot = i;
			if(currProj > maxProj) maxProj = currProj; maxDot = i;
		}

		return{
			minProj : minProj,
			maxProj : maxProj,
			minIndex : minDot,
			maxIndex : maxDot
		}
	}

	showEditorProperty(){
		let xDiv = document.createElement("div");
		let xLabel = document.createElement("p");
		xLabel.innerHTML = "x";
		xDiv.appendChild(xLabel);
		let xProperty = document.createElement("input");
		xProperty.type = "text";
		xProperty.value = this._x.toString();
		xProperty.addEventListener('input', () =>{
			this._x = parseFloat(xProperty.value);
			
		});
		xDiv.appendChild(xProperty);

		let yDiv = document.createElement("div");
		let yLabel = document.createElement("p");
		yLabel.innerHTML = "y";
		yDiv.appendChild(yLabel);
		let yProperty = document.createElement("input");
		yProperty.type = "text";
		yProperty.value = this._y.toString();
		yProperty.addEventListener('input', () =>{
			this._y = parseFloat(yProperty.value);
			
		});
		yDiv.appendChild(yProperty);

		this.elements = [xDiv, yDiv];
	}

	hideEditorProperty(){
		for(let i = 0; i < this.elements.length; i++){
			let property = this.elements[i];
			property.parentNode.removeChild(property);
		}
	}
}

export class Vector3 extends Vector2 implements EditorProperty{
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

	add(b : Vector3) : Vector3{
		return new Vector3(this.x + b.x, this.y + b.y, this.z + b.z);
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

	showEditorProperty(){
		super.showEditorProperty();
		let div = document.createElement("div");
		let label = document.createElement("p");
		label.innerHTML = "z";
		div.appendChild(label);
		let zProperty = document.createElement("input");
		zProperty.type = "text";
		zProperty.value = this._z.toString();
		zProperty.addEventListener('input', () =>{
			this._z = parseFloat(zProperty.value);
		});
		div.appendChild(zProperty);

		this.elements.push(div);
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

	showEditorProperty(){
		super.showEditorProperty();
		let div = document.createElement("div");
		let label = document.createElement("p");
		label.innerHTML = "w";
		div.appendChild(label);
		let wProperty = document.createElement("input");
		wProperty.type = "text";
		wProperty.value = this._w.toString();
		wProperty.addEventListener('input', () =>{
			this._w = parseFloat(wProperty.value);
		});
		div.appendChild(wProperty);

		this.elements.push(div);
	}
}

export class EditorString implements EditorProperty{
	elements : HTMLElement[] = [];
	public property : string;
	public string : string;

	constructor(property : string, string : string){
		this.property = property;
		this.string = string;
	}

	showEditorProperty(){
		let div = document.createElement("div");
		let label = document.createElement("p");
		label.innerHTML = this.property;
		let property = document.createElement("input");
		property.type = "text";
		property.value = this.string;
		property.addEventListener('input', () =>{
			this.string = property.value;
		});

		div.appendChild(label);
		div.appendChild(property);

		this.elements = [div];
	}

	hideEditorProperty(){
		for(let i = 0; i < this.elements.length; i++){
			let property = this.elements[i];
			property.parentNode.removeChild(property);
		}
	}

}

export function inBounds2D(topLeft : Vector2, bottomRight : Vector2, boundSize : Vector2) : boolean{
	if(boundSize.x > topLeft.x && boundSize.x < bottomRight.x){
		if(boundSize.y > topLeft.y && boundSize.y < bottomRight.y)
			return true;
	}
	return false;
}

export function degreeToRadians(degree : number) : number{
	let radians = (Math.PI/180) * degree;
	return radians;
}

export function computeMatrix(relativeToMatrix, outputMatrix, position : Vector3, rotation : Vector3){
	//setup projection stuff later (camera??)
	let xAxis = new Vector3(1,0,0);
	let yAxis = new Vector3(0,1,0);
	let zAxis = new Vector3(0,0,1);

	rotation = new Vector3(degreeToRadians(rotation.x), degreeToRadians(rotation.y), degreeToRadians(rotation.z));

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

