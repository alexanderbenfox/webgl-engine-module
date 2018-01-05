import { Vector3 } from "../EngineUtility";
import { DrawSurface } from "../Surface";
export declare class Light {
    surface: DrawSurface;
    constructor(surface: DrawSurface);
}
export declare class DirectionalLight extends Light {
    rotation: Vector3;
    private _directionBuffer;
    private _colorBuffer;
    constructor(surface: DrawSurface, rotation: Vector3);
    initRender(): void;
}
