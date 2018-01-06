import {Vector2, Vector3} from "../EngineUtility"
import {DrawSurface} from "../Surface"
import {GLUtility} from "../GLUtility"
import {MatrixUtil} from "../Matrix"
import {Component, Renderer} from "./Component"
import {Texture2D} from "./Texture"

export class UIImage extends Renderer{
	public surface : DrawSurface;
	public vertexBuffer : WebGLBuffer;
	public textureCoords : Float32Array;
	public colorBuffer : WebGLBuffer;

	constructor(){
		super();
	}

	init_renderer(camera, surface, url?, width?, height?){
		this.gameObject.renderer = this;
		this.surface = surface;
		this.camera = camera;
		width = width || 32;
		height = height || 32;
		this.size = new Vector3(width,height,0);
		//this.size = new Vector2(this.image.width, this.image.height);

		if(url && width && height)
			this.texture = new Texture2D(surface, url, width, height);

		this.vertexBuffer = this.surface.gl.createBuffer();
		this.colorBuffer = this.surface.gl.createBuffer();


		this._initialized = true;
	}

	update(dt : number){
		let x = this.gameObject.transform.position.x-this.size.x/2;
		let y = this.gameObject.transform.position.y-this.size.y/2;
		let z = this.gameObject.transform.position.z-this.size.z/2;

		this.renderPoint = new Vector3(x,y,z);

		if(this.texture)
			this.texture.update(dt);
	}



	blit() {
		var surface = this.surface;
		var gl = this.surface.gl;
		var program = this.surface.locations.program;

		gl.useProgram(program);

		var vertexPosition = surface.locations.attributes.position;
		var matrixLocation = surface.locations.uniforms.matrix;
		var colorLocation = surface.locations.attributes.color;
		var matrix = surface.getMatrix();

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

		var x = this.renderPoint.x;
		var y = this.renderPoint.y;

		var x1 = x;
		var x2 = x + this.size.x;

		var y1 = y;
		var y2 = y + this.size.y;

		//creating a new array on every draw call is gonna be really slow...

		var verticies = new Float32Array([
			x1, y1, x2, y1,
			x1, y2, x1, y2,
			x2, y1, x2, y2]);

		gl.bufferData(gl.ARRAY_BUFFER, verticies, gl.STATIC_DRAW);

		//vertex buffer -> shader position attribute
		gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0,0);

		var colors = [
			1.0,1.0,1.0,1.0,
			1.0,0.0,0.0,1.0];

		gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
		gl.vertexAttribPointer(colorLocation, 1, gl.FLOAT, false, 0,0);

		if(this.texture != null)
			this.texture.bindTexture();
		else
			gl.disableVertexAttribArray(this.surface.locations.attributes.texture);

		var n_matrix = new Float32Array(MatrixUtil.matrix_flatten(matrix));
		//apply matrix transformations

		gl.uniformMatrix3fv(matrixLocation, false, n_matrix);
		gl.drawArrays(gl.TRIANGLES, 0, 6);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
}

function setMatrixUniforms(gl, shaderProgram, perspectiveMatrix, mvMatrixStack) {
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(MatrixUtil.matrix_flatten(perspectiveMatrix)));

	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(MatrixUtil.matrix_flatten(mvMatrixStack)));
}