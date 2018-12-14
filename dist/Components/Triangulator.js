"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//class for building out vertex, normal, and color buffers for generic primitives
var EngineUtility_1 = require("../EngineUtility");
var buffers = /** @class */ (function () {
    function buffers() {
        this.normals = [];
        this.indicies = [];
        this.verts = [];
        this.colors = [];
        this.texCoords = [];
    }
    return buffers;
}());
exports.buffers = buffers;
var Triangulator = /** @class */ (function () {
    function Triangulator() {
    }
    Triangulator.MakeTriangle = function (buffer, a, b, c, color) {
        var normal;
        var d1 = a.sub(b);
        var d2 = b.sub(c);
        normal = d1.cross(d2);
        normal = normal.normalize();
        //add vertex in order
        buffer.verts = buffer.verts.concat(a.toArray(), b.toArray(), c.toArray());
        buffer.indicies.push(buffer.indicies.length);
        buffer.indicies.push(buffer.indicies.length);
        buffer.indicies.push(buffer.indicies.length);
        buffer.normals = buffer.normals.concat(normal.toArray(), normal.toArray(), normal.toArray());
        buffer.colors = buffer.colors.concat(color);
        buffer.texCoords.push(0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
        console.log("Making triangle");
    };
    Triangulator.MakeQuad = function (buffer, a, b, c, d, color) {
        this.MakeTriangle(buffer, a, b, c, color);
        this.MakeTriangle(buffer, c, d, a, color);
    };
    Triangulator.MakeCube = function (buffer, size, position, color) {
        //cube position is defined by the center of the cube
        //make the corners of the cube from there
        //here z is depth, y is up
        var x1 = position.x - size.x / 2;
        var x2 = position.x + size.x / 2;
        var y1 = position.y - size.y / 2;
        var y2 = position.y + size.y / 2;
        var z1 = position.z - size.z / 2;
        var z2 = position.z + size.z / 2;
        //build the bottom front corners
        var c1 = new EngineUtility_1.Vector3(x1, y1, z1);
        var c2 = new EngineUtility_1.Vector3(x2, y1, z1);
        //bottom back corners
        var c3 = new EngineUtility_1.Vector3(x1, y1, z2);
        var c4 = new EngineUtility_1.Vector3(x2, y1, z2);
        //top front corners
        var c5 = new EngineUtility_1.Vector3(x1, y2, z1);
        var c6 = new EngineUtility_1.Vector3(x2, y2, z1);
        //top back corners
        var c7 = new EngineUtility_1.Vector3(x1, y2, z2);
        var c8 = new EngineUtility_1.Vector3(x2, y2, z2);
        //make quads representing each cube face
        this.MakeQuad(buffer, c1, c2, c4, c3, color);
        this.MakeQuad(buffer, c1, c2, c6, c5, color);
        this.MakeQuad(buffer, c5, c6, c8, c7, color);
        this.MakeQuad(buffer, c4, c3, c7, c8, color);
        this.MakeQuad(buffer, c3, c1, c5, c7, color);
        this.MakeQuad(buffer, c2, c4, c8, c6, color);
    };
    Triangulator.MakeCircle = function (buffer, position, radius, color) {
        //decompose into points around the radius of the circle, making a triangle to represent each
        var numSegments = 32;
        for (var i = 0; i < numSegments; i++) {
            var theta0 = i / numSegments * 2 * Math.PI;
            var theta1 = (i + 1) / numSegments * 2 * Math.PI;
            var pt1 = new EngineUtility_1.Vector3(Math.cos(theta0) * radius + position.x, Math.sin(theta0) * radius + position.y, position.z);
            var pt2 = new EngineUtility_1.Vector3(Math.cos(theta1) * radius + position.x, Math.sin(theta1) * radius + position.y, position.z);
            this.MakeTriangle(buffer, pt1, pt2, position, color);
        }
    };
    Triangulator.MakeCylinder = function (buffer, position, radiusBottom, radiusTop, height, color) {
        var numSegments = 32;
        for (var i = 0; i < numSegments; i++) {
            var theta0 = i / numSegments * 2 * Math.PI;
            var theta1 = (i + 1) / numSegments * 2 * Math.PI;
            var pt1 = new EngineUtility_1.Vector3(Math.cos(theta0) * radiusBottom + position.x, Math.sin(theta0) * radiusBottom + position.y, position.z);
            var pt2 = new EngineUtility_1.Vector3(Math.cos(theta1) * radiusBottom + position.x, Math.sin(theta1) * radiusBottom + position.y, position.z);
            var pt3 = new EngineUtility_1.Vector3(Math.cos(theta0) * radiusTop + position.x, Math.sin(theta0) * radiusTop + position.y, position.z + height);
            var pt4 = new EngineUtility_1.Vector3(Math.cos(theta1) * radiusTop + position.x, Math.sin(theta1) * radiusTop + position.y, position.z + height);
            this.MakeQuad(buffer, pt1, pt2, pt3, pt4, color);
        }
    };
    //when making rings, make sure they are added in counter clockwise fashion
    Triangulator.MakePolygon = function (buffer, position, rings, color) {
        var points;
        for (var i = 0; i < rings.length; i++) {
            var convex = EngineUtility_1.polygonDecompose(rings[i]);
            if (convex.length % 3 == 0) {
                for (var j = 0; j < convex.length; j += 3) {
                    this.MakeTriangle(buffer, convex[j], convex[j + 1], convex[j + 2], color);
                }
            }
        }
    };
    Triangulator.MakeDome = function (buffer, position, radius, height, upsideDown, color) {
        //make rings out of cylinders to build dome
        var numSegments = 24;
        var segmentHeight = height / numSegments;
        var startAngle = upsideDown ? 3 / 4 * Math.PI : 0;
        var endAngle = upsideDown ? 2 * Math.PI : Math.PI / 4;
        var startPosZ = upsideDown ? position.z - height : position.z;
        for (var i = 0; i < numSegments; i++) {
            //build quarter of circle, if upsideDown 
            var theta0 = startAngle + i / numSegments * endAngle;
            var theta1 = startAngle + (i + 1) / numSegments * endAngle;
            var radiusBottom = Math.cos(theta0) * radius;
            var radiusTop = Math.cos(theta1) * radius;
            var ringPosition = new EngineUtility_1.Vector3(position.x, position.y, startPosZ + segmentHeight * i);
            this.MakeCylinder(buffer, ringPosition, radiusBottom, radiusTop, segmentHeight, color);
        }
    };
    Triangulator.MakeSphere = function (buffer, position, radius, height, color) {
        this.MakeDome(buffer, position, radius, height, false, color);
        this.MakeDome(buffer, position, radius, height, true, color);
    };
    return Triangulator;
}());
exports.Triangulator = Triangulator;
//this to consider
//define angle vector as pitch, roll, yaw
//should this transformation be applied after the shape is created?? yeah probably 
