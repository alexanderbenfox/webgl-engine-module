"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var gl_matrix_1 = require("gl-matrix");
var Vector2 = /** @class */ (function () {
    function Vector2(x, y) {
        this.elements = [];
        this._x = x;
        this._y = y;
    }
    Object.defineProperty(Vector2.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (n) {
            this.x = n;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector2.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (n) {
            this.y = n;
        },
        enumerable: true,
        configurable: true
    });
    Vector2.zero = function () {
        return new Vector2(0, 0);
    };
    Vector2.prototype.checkZero = function () {
        return this._x == 0 && this._y == 0;
    };
    Vector2.prototype.cross = function (b) {
        var a = this;
        var x = a.y * b.x - a.x * b.y;
        var y = a.x * b.y - a.y * b.x;
        return new Vector2(x, y);
    };
    Vector2.prototype.dot = function (b) {
        var a = this;
        return a.x * b.x + a.y * b.y;
    };
    Vector2.prototype.add = function (b) {
        return new Vector2(this.x + b.x, this.y + b.y);
    };
    Vector2.prototype.sub = function (b) {
        return new Vector2(this.x - b.x, this.y - b.y);
    };
    Vector2.prototype.magnitude = function () {
        var a = this;
        return Math.sqrt(a.x * a.x + a.y * a.y);
    };
    Vector2.prototype.normalize = function () {
        var mag = this.magnitude();
        if (mag < 0.000001)
            return new Vector2(0, 0);
        return new Vector2(this.x / mag, this.y / mag);
    };
    Vector2.getMinMaxProjections = function (vectors, axis) {
        var minProj = vectors[1].dot(axis);
        var minDot = 1;
        var maxProj = vectors[1].dot(axis);
        var maxDot = 1;
        for (var i = 2; i < vectors.length; i++) {
            var currProj = vectors[i].dot(axis);
            if (minProj > currProj)
                minProj = currProj;
            minDot = i;
            if (currProj > maxProj)
                maxProj = currProj;
            maxDot = i;
        }
        return {
            minProj: minProj,
            maxProj: maxProj,
            minIndex: minDot,
            maxIndex: maxDot
        };
    };
    Vector2.prototype.showEditorProperty = function () {
        var _this = this;
        var xDiv = document.createElement("div");
        var xLabel = document.createElement("p");
        xLabel.innerHTML = "x";
        xDiv.appendChild(xLabel);
        var xProperty = document.createElement("input");
        xProperty.type = "text";
        xProperty.value = this._x.toString();
        xProperty.addEventListener('input', function () {
            _this._x = parseFloat(xProperty.value);
        });
        xDiv.appendChild(xProperty);
        var yDiv = document.createElement("div");
        var yLabel = document.createElement("p");
        yLabel.innerHTML = "y";
        yDiv.appendChild(yLabel);
        var yProperty = document.createElement("input");
        yProperty.type = "text";
        yProperty.value = this._y.toString();
        yProperty.addEventListener('input', function () {
            _this._y = parseFloat(yProperty.value);
        });
        yDiv.appendChild(yProperty);
        this.elements = [xDiv, yDiv];
    };
    Vector2.prototype.hideEditorProperty = function () {
        for (var i = 0; i < this.elements.length; i++) {
            var property = this.elements[i];
            property.parentNode.removeChild(property);
        }
    };
    return Vector2;
}());
exports.Vector2 = Vector2;
var Vector3 = /** @class */ (function (_super) {
    __extends(Vector3, _super);
    function Vector3(x, y, z) {
        var _this = _super.call(this, x, y) || this;
        _this._z = z;
        return _this;
    }
    Object.defineProperty(Vector3.prototype, "z", {
        get: function () {
            return this._z;
        },
        set: function (n) {
            this.z = n;
        },
        enumerable: true,
        configurable: true
    });
    Vector3.zero = function () {
        return new Vector3(0, 0, 0);
    };
    Vector3.zAxis = function () {
        return new Vector3(0, 0, 1);
    };
    Vector3.yAxis = function () {
        return new Vector3(0, 1, 0);
    };
    Vector3.xAxis = function () {
        return new Vector3(1, 0, 0);
    };
    Vector3.prototype.checkZero = function () {
        return _super.prototype.checkZero.call(this) && this._z == 0;
    };
    Vector3.prototype.toArray = function () {
        return [this.x, this.y, this.z];
    };
    Vector3.prototype.add = function (b) {
        return new Vector3(this.x + b.x, this.y + b.y, this.z + b.z);
    };
    Vector3.prototype.sub = function (b) {
        return new Vector3(this.x - b.x, this.y - b.y, this.z - b.z);
    };
    Vector3.prototype.cross = function (b) {
        var a = this;
        var x = a.y * b.z - a.z * b.y;
        var y = a.z * b.x - a.x * b.z;
        var z = a.x * b.y - a.y * b.x;
        return new Vector3(x, y, z);
    };
    Vector3.prototype.dot = function (b) {
        var a = this;
        return a.x * b.x + a.y * b.y + a.z * b.z;
    };
    Vector3.prototype.magnitude = function () {
        var a = this;
        return Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
    };
    Vector3.prototype.angleBetween = function (b) {
        //a.b = |a||b|cos(theta)
        var dot = this.dot(b);
        var cosTerm = dot / (this.magnitude() * b.magnitude());
        var theta = Math.acos(cosTerm);
        return theta;
    };
    Vector3.prototype.normalize = function () {
        var mag = this.magnitude();
        if (mag < 0.000001)
            return new Vector3(0, 0, 0);
        return new Vector3(this.x / mag, this.y / mag, this.z / mag);
    };
    Vector3.prototype.dist = function (other) {
        return Math.sqrt((this._x - other.x) * (this._x - other.x) +
            (this._y - other.y) * (this._y - other.y) +
            (this._z - other.z) * (this._z - other.z));
    };
    Vector3.prototype.showEditorProperty = function () {
        var _this = this;
        _super.prototype.showEditorProperty.call(this);
        var div = document.createElement("div");
        var label = document.createElement("p");
        label.innerHTML = "z";
        div.appendChild(label);
        var zProperty = document.createElement("input");
        zProperty.type = "text";
        zProperty.value = this._z.toString();
        zProperty.addEventListener('input', function () {
            _this._z = parseFloat(zProperty.value);
        });
        div.appendChild(zProperty);
        this.elements.push(div);
    };
    return Vector3;
}(Vector2));
exports.Vector3 = Vector3;
var Vector4 = /** @class */ (function (_super) {
    __extends(Vector4, _super);
    function Vector4(x, y, z, w) {
        var _this = _super.call(this, x, y, z) || this;
        _this._w = w;
        return _this;
    }
    Object.defineProperty(Vector4.prototype, "w", {
        get: function () {
            return this._w;
        },
        set: function (n) {
            this.w = n;
        },
        enumerable: true,
        configurable: true
    });
    Vector4.prototype.showEditorProperty = function () {
        var _this = this;
        _super.prototype.showEditorProperty.call(this);
        var div = document.createElement("div");
        var label = document.createElement("p");
        label.innerHTML = "w";
        div.appendChild(label);
        var wProperty = document.createElement("input");
        wProperty.type = "text";
        wProperty.value = this._w.toString();
        wProperty.addEventListener('input', function () {
            _this._w = parseFloat(wProperty.value);
        });
        div.appendChild(wProperty);
        this.elements.push(div);
    };
    return Vector4;
}(Vector3));
exports.Vector4 = Vector4;
var EditorString = /** @class */ (function () {
    function EditorString(property, string) {
        this.elements = [];
        this.property = property;
        this.string = string;
    }
    EditorString.prototype.showEditorProperty = function () {
        var _this = this;
        var div = document.createElement("div");
        var label = document.createElement("p");
        label.innerHTML = this.property;
        var property = document.createElement("input");
        property.type = "text";
        property.value = this.string;
        property.addEventListener('input', function () {
            _this.string = property.value;
        });
        div.appendChild(label);
        div.appendChild(property);
        this.elements = [div];
    };
    EditorString.prototype.hideEditorProperty = function () {
        for (var i = 0; i < this.elements.length; i++) {
            var property = this.elements[i];
            property.parentNode.removeChild(property);
        }
    };
    return EditorString;
}());
exports.EditorString = EditorString;
function inBounds2D(topLeft, bottomRight, boundSize) {
    if (boundSize.x > topLeft.x && boundSize.x < bottomRight.x) {
        if (boundSize.y > topLeft.y && boundSize.y < bottomRight.y)
            return true;
    }
    return false;
}
exports.inBounds2D = inBounds2D;
function degreeToRadians(degree) {
    var radians = (Math.PI / 180) * degree;
    return radians;
}
exports.degreeToRadians = degreeToRadians;
function computeMatrix(relativeToMatrix, outputMatrix, position, rotation) {
    //setup projection stuff later (camera??)
    var xAxis = new Vector3(1, 0, 0);
    var yAxis = new Vector3(0, 1, 0);
    var zAxis = new Vector3(0, 0, 1);
    rotation = new Vector3(degreeToRadians(rotation.x), degreeToRadians(rotation.y), degreeToRadians(rotation.z));
    gl_matrix_1.mat4.translate(outputMatrix, // destination matrix
    relativeToMatrix, // matrix to translate (usually origin)
    position.toArray()); // amount to translate
    gl_matrix_1.mat4.rotate(outputMatrix, // destination matrix
    relativeToMatrix, // matrix to rotate
    rotation.x, // amount to rotate in radians
    xAxis.toArray()); // axis to rotate around (x)
    gl_matrix_1.mat4.rotate(outputMatrix, // destination matrix
    relativeToMatrix, // matrix to rotate
    rotation.y, // amount to rotate in radians
    yAxis.toArray()); // axis to rotate around (y)
    gl_matrix_1.mat4.rotate(outputMatrix, // destination matrix
    relativeToMatrix, // matrix to rotate
    rotation.z, // amount to rotate in radians
    zAxis.toArray()); // axis to rotate around (z)
}
exports.computeMatrix = computeMatrix;
//utility function to find cost of triangle 
//sum of lengths of all edges
function cost(p1, p2, p3) {
    return p1.dist(p2) + p2.dist(p3) + p3.dist(p1);
}
//finds min cost for convex polygon triangulation
function polygonDecompose(points) {
    var pts;
    if (points.length < 3)
        pts[0][0];
    var table;
    for (var gap = 0; gap < points.length; gap++) {
        var j = gap;
        for (var i = 0; j < points.length; i++, j++) {
            if (j < i + 2)
                table[i][j] = 0.0;
            else {
                table[i][j] = Infinity;
                for (var k = i + 1; k < j; k++) {
                    var val = table[i][k] + table[k][j] + cost(points[i], points[j], points[k]);
                    if (table[i][j] > val) {
                        table[i][j] = val;
                        var sequence = pts[i][k].concat(pts[k][j]).concat([points[i], points[j], points[k]]);
                        pts[i][j] = sequence;
                    }
                }
            }
        }
    }
    return pts[0][points.length - 1];
}
exports.polygonDecompose = polygonDecompose;
