import "sylvester"
import {Vector2, Vector3, Vector4, computeMatrix} from "../EngineUtility"
import {mat4} from "gl-matrix"
import {Component, GameObject} from "./Component"

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

export class Camera extends Component{
	private _time : number = 0;
	//main matrix that carries all of the data
	public projectionMatrix = mat4.create();
	//combination of view & projection
	public viewProjectionMatrix = mat4.create();

	constructor(){
		super();
	}

	init(gl : WebGLRenderingContext){
		const fieldOfView = 45 * Math.PI / 180; //radians
		const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
		const zNear = 0.1;
		const zFar = 100.0;
		mat4.perspective(this.projectionMatrix, fieldOfView, aspect, zNear, zFar);

		this.gameObject.transform.position = new Vector3(0,0,0);
		this.gameObject.transform.rotation = new Vector3(0,0,0);

		this.updateMatrix();
	}

	update(degree : number){//(lookAt : Shape3D, deltaMovement : Vector3){//degree : number){
		let radians = (degree/360)*360 * Math.PI/180;
		console.log(radians);
		this.gameObject.transform.rotation = new Vector3(0,radians,0);
		this.updateMatrix();
		//this.updateMatrixLookAt(lookAt);
	}

	updatePosition(deltaMovement : Vector3){
		this.gameObject.transform.position = this.gameObject.transform.position.add(deltaMovement);
		this.updateMatrix();
	}

	updateMatrix(){
		//this matrix represents the position and orientation of the camera in the world
		var cameraMatrix = mat4.create();
		computeMatrix(cameraMatrix, cameraMatrix, this.pos, this.rot);
		//view matrix moves everything opposite to the camera - making it as though cam is at origin
		var viewMatrix = mat4.create();
		viewMatrix = mat4.invert(viewMatrix, cameraMatrix);
		this.viewProjectionMatrix = mat4.multiply(this.viewProjectionMatrix, this.projectionMatrix, viewMatrix);
	}

	updateMatrixLookAt(lookAt : GameObject){
		var cameraMatrix = mat4.create();
		computeMatrix(cameraMatrix, cameraMatrix, this.gameObject.transform.position, this.gameObject.transform.rotation);

		var cameraPosition = new Vector3(cameraMatrix[12], cameraMatrix[13], cameraMatrix[14]);

		var up = new Vector3(0,1,0);

		cameraMatrix = this.lookAt(cameraPosition, lookAt.transform.position, up);
		var viewMatrix = mat4.create();
		viewMatrix = mat4.invert(viewMatrix, cameraMatrix);
		this.viewProjectionMatrix = mat4.multiply(this.viewProjectionMatrix, this.projectionMatrix, viewMatrix);
	}

	lookAt(cameraPosition : Vector3, targetPosition : Vector3, up : Vector3) : any[] {
		let zAxis = cameraPosition.sub(targetPosition).normalize();
		let xAxis = up.cross(zAxis);
		let yAxis = zAxis.cross(xAxis);
		return [
			xAxis.x, xAxis.y, xAxis.z, 0,
			yAxis.x, yAxis.y, zAxis.z, 0,
			zAxis.x, zAxis.y, zAxis.z, 0,
			cameraPosition.x, cameraPosition.y, cameraPosition.z, 1
		];
	}



}