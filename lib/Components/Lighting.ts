//references: Phong Shading

import {Component} from "./Component"
import {Vector3, computeMatrix} from "../EngineUtility"
import {DrawSurface} from "../Surface"
import {mat4} from "gl-matrix"

export class Light{
	public surface : DrawSurface;

	constructor(surface : DrawSurface){
		this.surface = surface;
	}

}

export class DirectionalLight extends Light{
	public rotation : Vector3;
	private _directionBuffer : WebGLBuffer;
	private _colorBuffer : WebGLBuffer;

	constructor(surface : DrawSurface, rotation : Vector3){
		super(surface);
		this.rotation = rotation;
		this.initRender();
	}

	initRender(){
		this.surface.gl.useProgram(this.surface.locations.program);
		this.surface.gl.uniform3f(
			this.surface.locations.uniforms.light_direction,
			this.rotation.x, this.rotation.y, this.rotation.z
			);
	}


}