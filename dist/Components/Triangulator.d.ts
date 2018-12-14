import { Vector3 } from "../EngineUtility";
import { Color } from "../../node_modules/color-ts";
export declare class buffers {
    normals: number[];
    indicies: number[];
    verts: number[];
    colors: Color[];
    texCoords: number[];
    constructor();
}
export declare class Triangulator {
    static MakeTriangle(buffer: buffers, a: Vector3, b: Vector3, c: Vector3, color: Color): void;
    static MakeQuad(buffer: buffers, a: Vector3, b: Vector3, c: Vector3, d: Vector3, color: Color): void;
    static MakeCube(buffer: buffers, size: Vector3, position: Vector3, color: Color): void;
    static MakeCircle(buffer: buffers, position: Vector3, radius: number, color: Color): void;
    static MakeCylinder(buffer: buffers, position: Vector3, radiusBottom: number, radiusTop: number, height: number, color: Color): void;
    static MakePolygon(buffer: buffers, position: Vector3, rings: Vector3[][], color: Color): void;
    static MakeDome(buffer: buffers, position: Vector3, radius: number, height: number, upsideDown: boolean, color: Color): void;
    static MakeSphere(buffer: buffers, position: Vector3, radius: number, height: number, color: Color): void;
}
