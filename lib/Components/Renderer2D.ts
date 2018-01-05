//Renderer2D

import {Vector2, Vector3, Vector4, computeMatrix} from "../EngineUtility"
import {DrawSurface} from "../Surface"
import {MatrixUtil} from "../Matrix"
import {mat4} from "gl-matrix"
import {Camera} from "./CameraUtility"
import {Component, Renderer} from "./Component"
import {inBounds2D} from "../EngineUtility"

export interface Drawable{
	blit() : void;
}

export abstract class Renderer2D extends Renderer{
	protected _surface : DrawSurface;
	protected _vertexBuffer : any;
	protected _colorBuffer : any;

	protected _topLeft : Vector2;
	protected _bottomRight : Vector2;

	protected _size : Vector2;

	constructor(){
		super();
	}

	init(surface : DrawSurface, camera : Camera){
		this.gameObject.renderer = this;
		this._surface = surface;
		this._vertexBuffer = surface.gl.createBuffer();
		this._colorBuffer = surface.gl.createBuffer();
		this.camera = camera;
		this._initialized = true;
	}

	blit() : void {}
}

export class LineRenderer extends Renderer2D implements Drawable{
	protected _points : Float32Array;
	protected _width : number;

	constructor(){
		super();
	}

	init_renderer(camera : Camera, surface : DrawSurface, startCoord : Vector2, endCoord : Vector2, width : number){
		super.init(surface, camera);

		this._points = new Float32Array([
			startCoord.x, startCoord.y, endCoord.x, startCoord.y,
			startCoord.x, endCoord.y, startCoord.x, endCoord.y,
			endCoord.x, startCoord.y, endCoord.x, endCoord.y
			]);
		this._width = width;
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


export class SquareRenderer extends Renderer2D implements Drawable{
	protected _points : Float32Array;
	protected _width : number;

	constructor(){
		super();
	}
	
	init_renderer(camera : Camera, surface : DrawSurface, startCoord : Vector2, endCoord : Vector2, width : number){
		super.init(surface, camera);

		this._points = new Float32Array([
			startCoord.x, startCoord.y, endCoord.x, startCoord.y,
			startCoord.x, endCoord.y, startCoord.x, endCoord.y,
			endCoord.x, startCoord.y, endCoord.x, endCoord.y
			]);
		this._width = width;
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