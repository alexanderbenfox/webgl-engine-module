///<reference path = "./Surface.ts"/>
declare function require(name:string);
import {Vector2, Vector3, Vector4, computeMatrix} from "./EngineUtility"
import {DrawSurface} from "./Surface"
import {MatrixUtil} from "./Matrix"
import {mat4} from "gl-matrix"
import {Camera} from "./CameraUtility"

export interface Drawable{
	blit() : void;
}

export abstract class Shape{
	protected _surface : DrawSurface;
	protected _vertexBuffer : any;
	protected _colorBuffer : any;
	protected _points : Float32Array;
	protected _width : number;

	constructor(surface : DrawSurface, startCoord : Vector2, endCoord : Vector2, width : number){
		this._surface = surface;
		this._vertexBuffer = surface.gl.createBuffer();
		this._colorBuffer = surface.gl.createBuffer();

		this._points = new Float32Array([
			startCoord.x, startCoord.y, endCoord.x, startCoord.y,
			startCoord.x, endCoord.y, startCoord.x, endCoord.y,
			endCoord.x, startCoord.y, endCoord.x, endCoord.y
			]);

		this._width = width;
	}

	blit() : void {}
}

export abstract class Shape3D implements Drawable{
	public surface : DrawSurface;
	protected positions : Float32Array;
	protected colors : Float32Array;
	protected indicies : Uint16Array;
	protected _vertexBuffer : any;
	protected _colorBuffer : any;
	protected _indexBuffer : any;

	constructor(surface : DrawSurface){
		this.surface = surface;
		this._vertexBuffer = surface.gl.createBuffer();
		this._colorBuffer = surface.gl.createBuffer();
	}

	blit(){}

	update(dt : number){}
}

export class Cube extends Shape3D{
	public rotation : Vector3;
	public position : Vector3;
	public camera : Camera;
	constructor(surface : DrawSurface, rotation : Vector3, position : Vector3, camera : Camera){
		super(surface);

		this.rotation = rotation;
		this.position = position;
		this.camera = camera;

		let gl = this.surface.gl;
		gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);

		//4 verticies per side, 24 verticies in total
		let vertexPositions = [
		  // Front face
		  -1.0, -1.0,  1.0,
		   1.0, -1.0,  1.0,
		   1.0,  1.0,  1.0,
		  -1.0,  1.0,  1.0,
		  
		  // Back face
		  -1.0, -1.0, -1.0,
		  -1.0,  1.0, -1.0,
		   1.0,  1.0, -1.0,
		   1.0, -1.0, -1.0,
		  
		  // Top face
		  -1.0,  1.0, -1.0,
		  -1.0,  1.0,  1.0,
		   1.0,  1.0,  1.0,
		   1.0,  1.0, -1.0,
		  
		  // Bottom face
		  -1.0, -1.0, -1.0,
		   1.0, -1.0, -1.0,
		   1.0, -1.0,  1.0,
		  -1.0, -1.0,  1.0,
		  
		  // Right face
		   1.0, -1.0, -1.0,
		   1.0,  1.0, -1.0,
		   1.0,  1.0,  1.0,
		   1.0, -1.0,  1.0,
		  
		  // Left face
		  -1.0, -1.0, -1.0,
		  -1.0, -1.0,  1.0,
		  -1.0,  1.0,  1.0,
		  -1.0,  1.0, -1.0,
		];

		this.positions = new Float32Array(vertexPositions);

		gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

		let white_color = [1.0, 1.0, 1.0, 1.0];

		//6 faces
		const faceColors = [white_color, white_color, white_color, white_color, white_color, white_color];
		let colors = [];

		for (let i = 0; i < faceColors.length; ++i){
			const c = faceColors[i];
			colors = colors.concat(c,c,c,c);
		}

		this.colors = new Float32Array(colors);

		this._colorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);

		this._indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);

		const indicies = [
		  	0,  1,  2,      0,  2,  3,    // front
		    4,  5,  6,      4,  6,  7,    // back
		    8,  9,  10,     8,  10, 11,   // top
		    12, 13, 14,     12, 14, 15,   // bottom
		    16, 17, 18,     16, 18, 19,   // right
		    20, 21, 22,     20, 22, 23,   // left
		];

		this.indicies = new Uint16Array(indicies);

		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indicies, gl.STATIC_DRAW);
	}

	blit() : void{
		let surface = this.surface;
		let gl = this.surface.gl;
		let program = this.surface.locations.program;

		//drawing position
		const modelViewMatrix = mat4.create();

		computeMatrix(modelViewMatrix, modelViewMatrix, this.position, this.rotation);

		this.assignAttrib(this._vertexBuffer,this.surface.locations.position, 3);
		this.assignAttrib(this._colorBuffer, this.surface.locations.texture, 4);
		this.bindIndexToVerts();

		gl.useProgram(program);

		gl.uniformMatrix4fv(
			surface.locations.projection,
			false,
			this.camera.viewProjectionMatrix
			);

		gl.uniformMatrix4fv(
			surface.locations.matrix,
			false,
			modelViewMatrix
			);

		const vertexCount = 36;
		const type = gl.UNSIGNED_SHORT;
		const offset = 0;
		gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
	}

	assignAttrib(buffer, attribLocation, components : number) : void{
		let gl = this.surface.gl;
		const numComponents = components;
		const type = this.surface.gl.FLOAT;
		const normalize = false;
		const stride = 0;
		const offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.vertexAttribPointer(
			attribLocation,
			numComponents,
			type,
			normalize,
			stride,
			offset
			);
		gl.enableVertexAttribArray(
			attribLocation
			);
	}

	bindIndexToVerts(){
		let gl = this.surface.gl;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
	}

	update(dt : number){
	}

	cartesianToHomogeneous(point : Vector3) : Vector4 {
	  
	  var x = point.x;
	  var y = point.y;
	  var z = point.z;
	  
	  return new Vector4(x,y,z,1);
	}

	homogeneousToCartesian(point : Vector4) : Vector3{

	  var x = point.x;
	  var y = point.y;
	  var z = point.z;
	  var w = point.w;
	  
	  return new Vector3(x/w, y/w, z/w);
	}
}

export class Stroke extends Shape implements Drawable{

	constructor(surface : DrawSurface, startCoord : Vector2, endCoord : Vector2, width : number){
		super(surface, startCoord, endCoord, width);
	}

	blit() : void{
		let surface = this._surface;
		//rendering context
		let gl = this._surface.gl;
		let program = this._surface.locations.program;

		gl.useProgram(program);

		let vertexPosition = surface.locations.position;
		let vertexColor = surface.locations.texture;
		let matrixLocation = surface.locations.matrix;
		let matrix = surface.getMatrix();

		//gl.disableVertexAttribArray(vertexTexture);

		gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, this._points, gl.STATIC_DRAW);

		// void gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
		gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0,0);

		/*var colors = [
		1.0, 1.0, 1.0, 1.0,//white
		1.0, 0.0, 0.0, 0.0,//red
		0.0, 1.0, 0.0, 0.0,//green
		0.0, 0.0, 1.0, 0.0];//blue*/

		let colors = [
			1.0,1.0,1.0,1.0,
			1.0,0.0,0.0,1.0,
			0.0,1.0,0.0,1.0,
			0.0,0.0,1.0,1.0];

		gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
		gl.vertexAttribPointer(vertexColor, 2, gl.FLOAT, false, 0,0);

		let n_matrix = new Float32Array(MatrixUtil.matrix_flatten(matrix));

		gl.uniformMatrix3fv(matrixLocation, false, n_matrix);
		gl.lineWidth(this._width);
		gl.drawArrays(gl.LINES,0, 6);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
	}
}

export class Square extends Shape implements Drawable{
	constructor(surface : DrawSurface, startCoord : Vector2, endCoord : Vector2, width : number){
		super(surface, startCoord, endCoord, width);
	}

	blit() : void{
		var surface = this._surface;
		var gl = this._surface.gl;
		var program = this._surface.locations.program;

		gl.useProgram(program);

		var vertexPosition = surface.locations.position;
		var vertexColor = surface.locations.texture;
		var matrixLocation = surface.locations.matrix;
		var matrix = surface.getMatrix();

		//gl.disableVertexAttribArray(vertexTexture);

		gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, this._points, gl.STATIC_DRAW);
		gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0,0);

		/*var colors = [
		1.0, 1.0, 1.0, 1.0,//white
		1.0, 0.0, 0.0, 0.0,//red
		0.0, 1.0, 0.0, 0.0,//green
		0.0, 0.0, 1.0, 0.0];//blue*/

		var colors = [
			1.0,1.0,1.0,1.0,
			1.0,0.0,0.0,1.0];

		gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
		gl.vertexAttribPointer(vertexColor, 1, gl.FLOAT, false, 0,0);

		var n_matrix = new Float32Array(MatrixUtil.matrix_flatten(matrix));

		gl.uniformMatrix3fv(matrixLocation, false, n_matrix);
		//gl.lineWidth(this.width);
		gl.drawArrays(gl.TRIANGLES,0, 6);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
	}
}