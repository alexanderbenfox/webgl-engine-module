//Texture class
import {DrawSurface} from "../Surface"
import {GLUtility} from "../GLUtility"
import {Vector2} from "../EngineUtility"

export class Texture2D{
	size : Vector2;
	surface : DrawSurface;

	buffer : WebGLBuffer;
	coords : Float32Array;

	image : HTMLImageElement;
	texture : WebGLTexture;

	constructor(surface, url?, width?, height?){
		this.image = new Image();
		this.surface = surface;
		this.buffer = this.surface.gl.createBuffer();

		this.size = new Vector2(width, height);

		this.coords = new Float32Array([
			0.0, 0.0, 1.0, 0.0,
			0.0, 1.0, 0.0, 1.0,
			1.0, 0.0, 1.0, 1.0
			]);
		
		this.image.onload = this.onLoad.bind(this);
		if(url){ 
			this.loadUrl(url);
		}
	}

	createPlaceholderTex(){
		this.texture = this.surface.gl.createTexture();;
	}

	onLoad() : void {
		let canvas = document.createElement('canvas');
		let context = canvas.getContext('2d');
		let size = GLUtility.nextPowerOfTwo(Math.max(this.size.x, this.size.y));
		canvas.width = size;
		canvas.height = size;

		var safeW = Math.min(this.size.x, this.image.width);
		var safeH = Math.min(this.size.y, this.image.height);
		context.clearRect(0,0,size,size);
		context.drawImage(this.image, 0, 0, safeW, safeH, 0,0,size,size);
		this.createTexture(canvas);
	}

	createTexture(canvas, index : any = false) : void {
		let texture = this.surface.gl.createTexture();

		var gl = this.surface.gl;
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);

		// Makes non-power-of-2 textures ok:
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); //gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating).
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating).

		// Unbind the texture
		gl.bindTexture(gl.TEXTURE_2D, null);

		// Store the texture
		this.texture = texture;
	}

	canvasFrame(frame, drawFunction){
		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		var size = GLUtility.nextPowerOfTwo(Math.max(this.size.x, this.size.y));

		canvas.width = size;
		canvas.height = size;

		drawFunction(context, canvas.width, canvas.height);

		this.createTexture(canvas, frame);
	}

	loadUrl(url){
		this.image.src = '../img/' + url;
	}

	update(dt : number){}

	bindTexture(){
		var gl = this.surface.gl;
		gl.enableVertexAttribArray(this.surface.locations.attributes.texture);
		//set shader buffer to current buffer and add texture data
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, this.coords, gl.STATIC_DRAW);

		//texture buffer -> shader texture attribute
		gl.vertexAttribPointer(this.surface.locations.attributes.texture, 2, gl.FLOAT, false, 0,0);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
	}
}

export class AnimatedTexture2D extends Texture2D{
	public currentFrame : number;
	public textures : {texture : WebGLTexture, frameTime : number}[];
	protected _currentFrameTime = 0;

	constructor(surface, url, width, height){
		super(surface,url,width,height);
		this.currentFrame = 0;
		this.textures = [];
		this.size = new Vector2(width, height);
		this._currentFrameTime = 0;
	}

	createTexture(canvas, index : any = false) : void {
		let texture = this.surface.gl.createTexture();

		//push it on to the end
		index = index || this.textures.length;

		var gl = this.surface.gl;
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);

		// Makes non-power-of-2 textures ok:
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); //gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating).
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating).

		// Unbind the texture
		gl.bindTexture(gl.TEXTURE_2D, null);

		// Store the texture with a base amount of time
		this.textures[index] = {texture: texture, frameTime : 1.0};
	}

	onLoad() : void {
		let canvas = document.createElement('canvas');
		let context = canvas.getContext('2d');
		let size = GLUtility.nextPowerOfTwo(Math.max(this.size.x, this.size.y));
		canvas.width = size;
		canvas.height = size;


		for(let y = 0; y < this.image.height; y+=this.size.y){
			for(let x = 0; x < this.image.width; x+=this.size.x){
				context.clearRect(0,0,size,size);
				var safeW = Math.min(this.size.x, this.image.width - x);
				var safeH = Math.min(this.size.y, this.image.height - y);
				context.drawImage(this.image, x, y, safeW, safeH, 0,0,size,size);
				this.createTexture(canvas);
			}
		}
	}

	update(dt : number) {
		this._currentFrameTime += dt;
		if(this._currentFrameTime >= this.textures[this.currentFrame].frameTime){
			this.currentFrame++;

			//default to looping
			if(this.currentFrame >= this.textures.length)
				this.currentFrame = 0;
		}
	}

	bindTexture(){
		let frame = this.currentFrame;
		if(!this.textures[frame]) return;
		this.texture = this.textures[frame];
		super.bindTexture();
	}

}