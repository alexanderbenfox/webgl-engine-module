declare function require(name:string);
import {Vector2} from "./EngineUtility"
import {GLUtility, ShaderProperties} from "./GLUtility"
import {MatrixStack, MatrixUtil, MatrixRect} from "./Matrix"

export class DrawSurface{
	public canvas : HTMLCanvasElement;
	public matrixStack : MatrixStack;
	public size : Vector2;
	public gl : WebGLRenderingContext;
	public locations : ShaderProperties;
	private _program : WebGLProgram;

	public density : number;

	getMatrix(){
		return this.matrixStack.stack[this.matrixStack.stack.length - 1];
	}

	constructor(canvas : HTMLCanvasElement, line){
		this.canvas = canvas;
		this.matrixStack = new MatrixStack();
		this.size = Vector2.zero();

		this.gl = GLUtility.getGLContext(canvas, {alpha: false, premultipliedAlpha: false});
		this.locations = GLUtility.initGL(this.gl, this.size, line);
		this._program = this.locations.program;
		this.resize(this.size);
	}

	resize(size : Vector2) : void{
		let density = window.devicePixelRatio || 1;

		if(size.checkZero()){
			size = new Vector2(this.canvas.clientWidth * density,
								this.canvas.clientHeight * density);
		}

		let width = this.canvas.width = size.x;
		let height = this.canvas.height = size.y;
		this.size = new Vector2(width, height);
		this.density = density;

		this.gl.viewport(0,0,width,height);

		this.gl.useProgram(this._program);
		this.gl.uniform2f(this.locations.resolution, width, height);
	}

	clear() : void{
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	}

	push() : void{
		this.matrixStack.push_matrix();
	}

	pop() : void {
		this.matrixStack.pop_matrix();
	}

	translate(tx, ty) {
		return MatrixUtil.Translate(this.getMatrix(), [tx,ty,0]);
	}

	rotate(angle, v : any = false) : void {
		v = v || [0,0,0];
		this.matrixStack.rotate(angle, v);
	}

	getRect() : MatrixRect{
		let matrix = this.matrixStack.matrix.dup();
		let ul = [0,0];
		let lr = [this.size.x, this.size.y];
		matrix = MatrixUtil.invert(matrix, matrix);
		ul = MatrixUtil.transform(ul, ul, matrix);
		lr = MatrixUtil.transform(lr, lr, matrix);
		let rect = new MatrixRect();
		rect.left = ul[0];
		rect.top = ul[1];
		rect.right = lr[0];
		rect.bottom = lr[1];
		return rect;
	}
}

