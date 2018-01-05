//Colliders
//help with Seperating Axis Theorem for oriented box collision found here: https://gamedevelopment.tutsplus.com/tutorials/collision-detection-using-the-separating-axis-theorem--gamedev-169
import {Component} from "./Component"
import {Vector2, Vector3, inBounds2D} from "../EngineUtility"

export class Collider extends Component{

}

export class Collider2D extends Collider{
	protected _dots : Vector2[];

	constructor(){
		super();
		this._dots = [];
	}

	get dots() : Vector2[]{
		return this._dots;
	}
} 

export class RectCollider extends Collider2D{
	//Orientedd Box collision
	private _size : Vector2;

	private _rotation : Vector3;

	constructor(){
		super();
	}

	init(topLeft, size){
		this._size = new Vector2(size.x, size.y);

		this._dots[0] = new Vector2(topLeft.x + size.x, topLeft.y - size.y);
		this._dots[1] = new Vector2(topLeft.x, topLeft.y);
		this._dots[2] = new Vector2(topLeft.x + this._size.x, topLeft.y);
		this._dots[3] = new Vector2(topLeft.x, topLeft.y + this._size.y);
		this._dots[4] = new Vector2(topLeft.x + this._size.x, topLeft.y + this._size.y);

		this._rotation = new Vector3(this.gameObject.transform.rotation.x, this.gameObject.transform.rotation.y, this.gameObject.transform.rotation.z);

	}

	update(dt : number){
		this.updateRotation();
		this.updatePosition();
	}

	updatePosition(){
		//update positions 
		let newPos = new Vector2(this.gameObject.transform.position.x, this.gameObject.transform.position.x);
		let oldPos = this._dots[0];

		let deltaPosition = newPos.sub(oldPos);

		if(deltaPosition.checkZero()) return;

		//update dots
		for(let i = 0; i < this._dots.length; i++){
			this._dots[i].add(deltaPosition);
		}

	}

	updateRotation(){
		let deltaRotation = this._rotation.z - this.gameObject.transform.rotation.z;
		if(deltaRotation == 0) return;

		for(let i = 1; i < this._dots.length; i++){
			let xlength = this._dots[i].x - this._dots[0].x;
			let ylength = this._dots[i].y - this._dots[0].y;

			let newX = xlength * Math.cos(deltaRotation) - ylength *Math.sin(deltaRotation);
			let newY = xlength * Math.sin(deltaRotation) + ylength * Math.cos(deltaRotation);

			newX += this._dots[0].x;
			newY += this._dots[0].y;

			this._dots[i] = new Vector2(newX, newY); 
		}
	}

	detectCollision(other : Collider2D) : boolean {
		if(other instanceof RectCollider){
				let nrmls1 = this.getNormals();
				let nrmls2 = other.getNormals();
				let corners1 = this.dots;
				let corners2 = other.dots;

				let resP = this.getProjectionResult(corners1, corners2, nrmls1[1]);
				let resQ = this.getProjectionResult(corners1, corners2, nrmls1[0]);
				let resR = this.getProjectionResult(corners1, corners2, nrmls2[1]);
				let resS = this.getProjectionResult(corners1, corners2, nrmls2[0]);

				let isSeperated = resP || resQ || resR || resS;
				return !isSeperated;

			}
		else if (other instanceof CircleCollider){
				let boxCenter = this.dots[0];

				let max = Number.NEGATIVE_INFINITY;
				let box2circleVector = new Vector2(other.pos.x - this.dots[0].x, other.pos.y - this.dots[0].y);
				let box2circleNormalized = box2circleVector.normalize();

				//get maximum projection onto the circle
				for(let i = 1; i < this.dots.length; i++){
					let corner = this.dots[i];
					let vector = new Vector2(corner.x - boxCenter.x, corner.y - boxCenter.y);
					let proj = vector.dot(box2circleNormalized);

					if(max < proj) max = proj;
				}

				//is there a circle?
				let circle = box2circleVector.magnitude() > 0;
				//is there a seperation
				let seperation = (box2circleVector.magnitude() - max - other.radius) > 0;

				return !(seperation && circle);
		}
	}

	private getProjectionResult(corners_box1, corners_box2, normals) : boolean {
		var obj = {P1 : Vector2.getMinMaxProjections(corners_box1, normals), P2 : Vector2.getMinMaxProjections(corners_box2, normals)};
		var seperated = obj.P1.maxProj < obj.P2.minProj || obj.P2.maxProj < obj.P1.minProj;
		return seperated;
	}

	detectPoint(other : Vector2) : boolean{
		let bottomRight = this.dots[4];
		return inBounds2D(this.dots[1], bottomRight, other);
	}

	getNormals() : Vector2[]{
		let normals = [];
		for(let i = 0; i < this._dots.length - 1; i++){
			let nrmlX = this._dots[i + 1].x - this._dots[i].x;
			let nrmlY = this._dots[i + 1].y - this._dots[i].y;
			let currentNrml = new Vector2(nrmlX, nrmlY);
			normals.push(currentNrml);
		}

		let f_nrmlX = this._dots[1].x - this._dots[this._dots.length-1].x;
		let f_nrmlY = this._dots[1].y - this._dots[this._dots.length-1].y; 
		let finalNrml = new Vector2(f_nrmlX, f_nrmlY);

		normals.push(finalNrml);

		return normals;
		
	}


}

export class CircleCollider extends Collider2D{
	public radius : number;

	constructor(){
		super();
	}

	init(radius : number){
		this.radius = radius;
		this._initialized = true;
	}

	update(dt : number){}

	detectCollision(other : Collider2D) : boolean{

		if(other instanceof CircleCollider){
			let dx = other.gameObject.transform.position.x - this.gameObject.transform.position.x;
			let dy = other.gameObject.transform.position.y - this.gameObject.transform.position.y;

			let dx2 = dx * dx;
			let dy2 = dy * dy;

			let radii = this.radius + other.radius;

			let radii2 = radii * radii;

			return ( (dx2 + dy2) < radii2);
		}

		else if (other instanceof RectCollider){
			return other.detectCollision(<CircleCollider>this);
		}


	}

}