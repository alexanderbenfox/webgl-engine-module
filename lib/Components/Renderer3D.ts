import {Renderer} from "./Component"
import {Vector2, Vector3, Vector4, computeMatrix} from "../EngineUtility"
import {DrawSurface} from "../Surface"
import {MatrixUtil} from "../Matrix"
import {mat4} from "gl-matrix"
import {Camera} from "./CameraUtility"
import {Texture2D} from "./Texture"
import {SurfaceManager, ObjectManager} from "../Managers"

export interface Drawable{
	blit() : void;
}

export abstract class Renderer3D extends Renderer implements Drawable{
	public surface : DrawSurface;
	protected positions : Float32Array;
	protected colors : Float32Array;
	protected indicies : Uint16Array;

	//used for lighting
	protected normals : Float32Array;
	protected _normalBuffer : WebGLBuffer;
	
	protected _vertexBuffer : WebGLBuffer;
	protected _colorBuffer : WebGLBuffer;
	protected _indexBuffer : WebGLBuffer;

	constructor(){
		super();
	}

	create(){
		this.init_renderer(SurfaceManager.GetBlankWorldSurface(), ObjectManager.editorCamera);
	}

	protected init_renderer(surface : DrawSurface, camera : Camera){
		super.init(surface);
		this.gameObject.renderer = this;
		this.surface = surface;
		this._vertexBuffer = surface.gl.createBuffer();
		this._colorBuffer = surface.gl.createBuffer();
		this._normalBuffer = surface.gl.createBuffer();

		this.camera = camera;
	}

	changeSprite(url, width, height){
		if(url && width && height){
			this.surface = SurfaceManager.GetWorldSurface();
			this.texture = new Texture2D(this.surface, url, width, height);
		}
	}

	blit(){}

	update(dt : number){}
}

export class SpriteRenderer extends Renderer3D{

	constructor(){
		super();
	}

	create(){
		this.init_sprite_renderer(SurfaceManager.GetBlankWorldSurface(), ObjectManager.editorCamera);
	}

	initVertexBuffer(gl : WebGLRenderingContext){
		gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);

		//1 verticies per side, 4 verticies in total
		let vertexPositions = [
		  // Front face
		  -1.0, -1.0,  1.0,
		   1.0, -1.0,  1.0,
		   1.0,  1.0,  1.0,
		  -1.0,  1.0,  1.0,
		];

		this.positions = new Float32Array(vertexPositions);

		gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);
	}

	initColorBuffer(gl : WebGLRenderingContext){
		//colors each face white - for now
		let white_color = [1.0, 1.0, 1.0, 0.9];

		//6 faces
		const faceColors = [white_color];
		let colors = [];

		for (let i = 0; i < faceColors.length; ++i){
			const c = faceColors[i];
			colors = colors.concat(c,c,c,c);
		}

		this.colors = new Float32Array(colors);

		this._colorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
	}

	initIndexBuffer(gl : WebGLRenderingContext){
		this._indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);

		const indicies = [
		  	0,  1,  2,      0,  2,  3,    // front
		];

		this.indicies = new Uint16Array(indicies);

		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indicies, gl.STATIC_DRAW);
	}

	initNormalBuffer(gl : WebGLRenderingContext){
		this._normalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this._normalBuffer);

		let vertexNormals = [
		// Front
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,
		];

		this.normals = new Float32Array(vertexNormals);

		gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);
	}

	protected init_sprite_renderer(surface : DrawSurface, camera : Camera, url?, width?, height?){
		super.init_renderer(surface, camera);
		let gl = this.surface.gl;
		this.initVertexBuffer(gl);
		this.initColorBuffer(gl);
		this.initIndexBuffer(gl);
		this.initNormalBuffer(gl);

		if(url && width && height)
			this.texture = new Texture2D(surface, url, width, height);
	}

	blit() : void{
		let surface = this.surface;
		let gl = this.surface.gl;
		let program = this.surface.locations.program;

		//drawing position
		const modelViewMatrix = mat4.create();

		computeMatrix(modelViewMatrix, modelViewMatrix, this.gameObject.transform.position, this.gameObject.transform.rotation);

		this.assignAttrib(this._vertexBuffer,this.surface.locations.attributes.position, 3);
		this.assignAttrib(this._colorBuffer, this.surface.locations.attributes.color, 4);
		this.assignAttrib(this._normalBuffer, this.surface.locations.attributes.normal, 3);

		this.bindIndexToVerts();

		gl.useProgram(program);

		if(this.texture != null)
			this.texture.bindTexture();

		gl.uniformMatrix4fv(
			surface.locations.uniforms.projection,
			false,
			this.camera.viewProjectionMatrix
			);

		gl.uniformMatrix4fv(
			surface.locations.uniforms.matrix,
			false,
			modelViewMatrix
			);

		const normalMatrix = mat4.create();
		mat4.invert(normalMatrix, modelViewMatrix);
		mat4.transpose(normalMatrix, normalMatrix);

		gl.uniformMatrix4fv(
			surface.locations.uniforms.normal,
			false,
			normalMatrix
			);

		const vertexCount = 6;
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

export class CubeRenderer extends Renderer3D{
	constructor(){
		super();
	}

	create(){
		this.init_cube_renderer(SurfaceManager.GetBlankWorldSurface(), ObjectManager.editorCamera);
	}

	initVertexBuffer(gl : WebGLRenderingContext){
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
	}

	initColorBuffer(gl : WebGLRenderingContext){
		//colors each face white - for now
		let white_color = [1.0, 1.0, 1.0, 0.9];

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
	}

	initIndexBuffer(gl : WebGLRenderingContext){
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

	initNormalBuffer(gl : WebGLRenderingContext){
		this._normalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this._normalBuffer);

		let vertexNormals = [
		// Front
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,

		// Back
		0.0,  0.0, -1.0,
		0.0,  0.0, -1.0,
		0.0,  0.0, -1.0,
		0.0,  0.0, -1.0,

		    // Top
		0.0,  1.0,  0.0,
		0.0,  1.0,  0.0,
		0.0,  1.0,  0.0,
		0.0,  1.0,  0.0,

		// Bottom
		0.0, -1.0,  0.0,
		0.0, -1.0,  0.0,
		0.0, -1.0,  0.0,
		0.0, -1.0,  0.0,

		// Right
		1.0,  0.0,  0.0,
		1.0,  0.0,  0.0,
		1.0,  0.0,  0.0,
		1.0,  0.0,  0.0,

		// Left
		-1.0,  0.0,  0.0,
		-1.0,  0.0,  0.0,
		-1.0,  0.0,  0.0,
		-1.0,  0.0,  0.0
		];

		this.normals = new Float32Array(vertexNormals);

		gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);
	}

	protected init_cube_renderer(surface : DrawSurface, camera : Camera, url?, width?, height?){
		super.init_renderer(surface, camera);
		let gl = this.surface.gl;
		this.initVertexBuffer(gl);
		this.initColorBuffer(gl);
		this.initIndexBuffer(gl);
		this.initNormalBuffer(gl);

		if(url && width && height)
			this.texture = new Texture2D(surface, url, width,height);
	}

	blit() : void{
		let surface = this.surface;
		let gl = this.surface.gl;
		let program = this.surface.locations.program;

		

		//drawing position
		const modelViewMatrix = mat4.create();

		computeMatrix(modelViewMatrix, modelViewMatrix, this.gameObject.transform.position, this.gameObject.transform.rotation);

		this.assignAttrib(this._vertexBuffer,this.surface.locations.attributes.position, 3);
		this.assignAttrib(this._colorBuffer, this.surface.locations.attributes.color, 4);
		this.assignAttrib(this._normalBuffer, this.surface.locations.attributes.normal, 3);

		this.bindIndexToVerts();

		gl.useProgram(program);

		if (this.texture != null)
			this.texture.bindTexture();
		else
			gl.disableVertexAttribArray(this.surface.locations.attributes.texture);

		gl.uniformMatrix4fv(
			surface.locations.uniforms.projection,
			false,
			this.camera.viewProjectionMatrix
			);

		gl.uniformMatrix4fv(
			surface.locations.uniforms.matrix,
			false,
			modelViewMatrix
			);

		const normalMatrix = mat4.create();
		mat4.invert(normalMatrix, modelViewMatrix);
		mat4.transpose(normalMatrix, normalMatrix);

		gl.uniformMatrix4fv(
			surface.locations.uniforms.normal,
			false,
			normalMatrix
			);

		const vertexCount = this.indicies.length;
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

