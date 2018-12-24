import {Renderer3D} from "../Components/Renderer3D"
import {DrawSurface} from "../Surface"
import {SurfaceManager, ObjectManager} from "../Managers"
import {mat4} from "gl-matrix"
import {Camera} from "./CameraUtility"
import {Triangulator, buffers} from "../Components/Triangulator"
import {Vector3, Vector4, computeMatrix} from "../EngineUtility"
import {Color} from "../../node_modules/color-ts"

export enum Primitive{
    SPHERE, CYLINDER, CUBE, CONE, DOME
}

export class PrimitiveRenderer extends Renderer3D{
    public buffer : buffers;

	constructor(){
        super();
        this.buffer = new buffers();
	}

	create(){
        //call create buffers beforehand??
		this.init_un(SurfaceManager.GetBlankWorldSurface(), ObjectManager.editorCamera);
    }
    
    createBuffers(type : Primitive, offset : Vector3, size : number){
        switch(type){
            case Primitive.SPHERE:
                Triangulator.MakeSphere(this.buffer, offset, size/2, size, [1, 0, 0]);
                break;
            case Primitive.CYLINDER:
                Triangulator.MakeCylinder(this.buffer, offset, size/2, size/2, size, [1, 1, 1]);
                break;
            case Primitive.CONE:
                Triangulator.MakeCylinder(this.buffer, offset, size/2, 0, size, [1,1,1]);
                break;
            case Primitive.DOME:
                Triangulator.MakeDome(this.buffer, offset, size/2, size, true, [1, 1, 1]);
                break;
            case Primitive.CUBE:
            default:
                Triangulator.MakeCube(this.buffer, new Vector3(size, size, size), offset, [1, 1, 1]);

        }
        console.log("VERTS = " + this.buffer.verts.length);
        console.log("INDICIES = " + this.buffer.indicies.length);
    }

	initVertexBuffer(gl : WebGLRenderingContext){
		gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);

        this.positions = new Float32Array(this.buffer.verts);
        console.log("POSITIONS:");
        console.log(this.positions);

		gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);
	}

	initColorBuffer(gl : WebGLRenderingContext){
		//colors each face white - for now
		let alpha = 1;
		let colors = [];


        for(let i = 0; i < this.buffer.indicies.length; i++){
			const color = [this.buffer.colors[i*3], this.buffer.colors[i*3 + 1], this.buffer.colors[i*3 + 2], alpha];
            //let white = [1,1,1,1];
            colors = colors.concat(color, color, color, color);
        }
        
		/*for (let i = 0; i < this.buffer.colors.length; ++i){
            const c = this.buffer.colors[i];
            //face colors contains an array of 3 colors
            colors = colors.concat(c);
            colors.push(alpha);
		}*/

		this.colors = new Float32Array(colors);

		this._colorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
	}

	initIndexBuffer(gl : WebGLRenderingContext){
		this._indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);

        this.indicies = new Uint16Array(this.buffer.indicies);
        console.log("INDICIES:");
        console.log(this.indicies);

		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indicies, gl.STATIC_DRAW);
	}

	initNormalBuffer(gl : WebGLRenderingContext){
		this._normalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this._normalBuffer);

        this.normals = new Float32Array(this.buffer.normals);
        console.log("NORMALS:");
        console.log(this.normals);

		gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);
	}

	protected init_un(surface : DrawSurface, camera : Camera, url?, width?, height?){
		super.init_renderer(surface, camera);
		let gl = this.surface.gl;
		this.initVertexBuffer(gl);
		this.initColorBuffer(gl);
		this.initIndexBuffer(gl);
		this.initNormalBuffer(gl);

		//if(url && width && height)
		//	this.texture = new Texture2D(surface, this, url, width,height);
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

