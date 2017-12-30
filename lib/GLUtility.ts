///<reference path="EngineUtility.ts"/>
declare function require(name:string);
import {Vector2} from "./EngineUtility"

export class ShaderProperties{
	public position : GLint;
	public texture : GLint
	public resolution : WebGLUniformLocation;
	public matrix : WebGLUniformLocation;
	public projection : WebGLUniformLocation;
	public program : WebGLProgram;

	constructor(position_ : GLint, texture_ : GLint, resolution_ : WebGLUniformLocation, matrix_ : WebGLUniformLocation, projection_ : WebGLUniformLocation,program_ : WebGLProgram){
		this.position = position_;
		this.texture = texture_;
		this.resolution = resolution_;
		this.matrix = matrix_;
		this.projection = projection_;
		this.program = program_;
	}
}

export enum ShaderType{
	texture_2d, no_texture_2d, no_texture3d
}

export module GLUtility{
	export function initGL(gl : WebGLRenderingContext, size : Vector2, type : ShaderType) : ShaderProperties{
		gl.clearColor(0.0,0.0,0.0,1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.depthFunc(gl.LEQUAL);
		gl.disable(gl.DEPTH_TEST);
		gl.disable(gl.CULL_FACE);
		gl.enable(gl.BLEND);
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		let fs_name = '';
		let vs_name = ''

		switch(type){
			case ShaderType.no_texture3d :
				fs_name = 'shader-fs';
				vs_name = 'shader-vs-3d';
				break;
			case ShaderType.no_texture_2d :
				fs_name = 'shader-fs';
				vs_name = 'shader-vs-2d';
				break;
			case ShaderType.texture_2d :
				fs_name = 'shader-fs-texture';
				vs_name = 'shader-vs-texture-2d';
				break;
		}

		return initShaders(gl, fs_name, vs_name);
	}

	export function initShaders(gl : WebGLRenderingContext, fs_name : string, vs_name : string) : ShaderProperties{
		let fragmentShader = getShader(gl, fs_name);
		let vertexShader = getShader(gl, vs_name);
		
		let shaderProgram : WebGLProgram;
		shaderProgram = gl.createProgram();
		
		
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);

		if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {alert('Unable to initialize shader program: ' + gl.getProgramInfoLog(shaderProgram));}
		gl.useProgram(shaderProgram);

		var vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
		gl.enableVertexAttribArray(vertexPosition);

		var textureCoordinate = gl.getAttribLocation(shaderProgram, 'aTextureColorCoordinate');
		gl.enableVertexAttribArray(textureCoordinate);

		var resolutionLocation = gl.getUniformLocation(shaderProgram, 'uResolution');
		var transformationMatrix = gl.getUniformLocation(shaderProgram, 'uMatrix');
		let projectionMatrix = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');

		console.log("Shaders initialized.")

		return new ShaderProperties(vertexPosition, textureCoordinate, resolutionLocation, transformationMatrix, projectionMatrix, shaderProgram);
	}

	export function getShader(gl : WebGLRenderingContext, id : string, type : any = false) : WebGLShader{
		let shaderScript : HTMLScriptElement;
		let theSource : string;
		let currentChild : Node;
		let shader : WebGLShader;

		shaderScript = <HTMLScriptElement>document.getElementById(id);

		if(!shaderScript){return null;}

		currentChild = shaderScript.firstChild;
		theSource = "";

		while(currentChild){
			if(currentChild.nodeType == 3){theSource += currentChild.textContent;}
			currentChild = currentChild.nextSibling;
		}

		if(!type){
			if(shaderScript.type == 'x-shader/x-fragment'){
				type = gl.FRAGMENT_SHADER;
			}
			else if(shaderScript.type == 'x-shader/x-vertex'){
				type = gl.VERTEX_SHADER;
			}
			else{
				console.log("Unknown shader type.");
				return null;
			}
		}

		shader = gl.createShader(type);
		//read shader text into source
		gl.shaderSource(shader, theSource);

		gl.compileShader(shader);
		if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
			console.log('An error ocurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
			return null;
		}
		return shader;
	}


	export function getGLContext(canvas, opts){
		return canvas.getContext('webgl', opts) || canvas.getContext('experimental-webgl', opts);
	}

	export function nextPowerOfTwo(n){
		var i = Math.floor(n/2);
		while(i<n) i*=2;
		return i;
	}

}

