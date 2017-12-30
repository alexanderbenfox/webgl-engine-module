"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
///<reference path="EngineUtility.ts"/>
var ShaderProperties = /** @class */ (function () {
    function ShaderProperties(position_, texture_, resolution_, matrix_, projection_, program_) {
        this.position = position_;
        this.texture = texture_;
        this.resolution = resolution_;
        this.matrix = matrix_;
        this.projection = projection_;
        this.program = program_;
    }
    return ShaderProperties;
}());
exports.ShaderProperties = ShaderProperties;
var ShaderType;
(function (ShaderType) {
    ShaderType[ShaderType["texture_2d"] = 0] = "texture_2d";
    ShaderType[ShaderType["no_texture_2d"] = 1] = "no_texture_2d";
    ShaderType[ShaderType["no_texture3d"] = 2] = "no_texture3d";
})(ShaderType = exports.ShaderType || (exports.ShaderType = {}));
var GLUtility;
(function (GLUtility) {
    function initGL(gl, size, type) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.depthFunc(gl.LEQUAL);
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        gl.enable(gl.BLEND);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        var fs_name = '';
        var vs_name = '';
        switch (type) {
            case ShaderType.no_texture3d:
                fs_name = 'shader-fs';
                vs_name = 'shader-vs-3d';
                break;
            case ShaderType.no_texture_2d:
                fs_name = 'shader-fs';
                vs_name = 'shader-vs-2d';
                break;
            case ShaderType.texture_2d:
                fs_name = 'shader-fs-texture';
                vs_name = 'shader-vs-texture-2d';
                break;
        }
        return initShaders(gl, fs_name, vs_name);
    }
    GLUtility.initGL = initGL;
    function initShaders(gl, fs_name, vs_name) {
        var fragmentShader = getShader(gl, fs_name);
        var vertexShader = getShader(gl, vs_name);
        var shaderProgram;
        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert('Unable to initialize shader program: ' + gl.getProgramInfoLog(shaderProgram));
        }
        gl.useProgram(shaderProgram);
        var vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
        gl.enableVertexAttribArray(vertexPosition);
        var textureCoordinate = gl.getAttribLocation(shaderProgram, 'aTextureColorCoordinate');
        gl.enableVertexAttribArray(textureCoordinate);
        var resolutionLocation = gl.getUniformLocation(shaderProgram, 'uResolution');
        var transformationMatrix = gl.getUniformLocation(shaderProgram, 'uMatrix');
        var projectionMatrix = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');
        console.log("Shaders initialized.");
        return new ShaderProperties(vertexPosition, textureCoordinate, resolutionLocation, transformationMatrix, projectionMatrix, shaderProgram);
    }
    GLUtility.initShaders = initShaders;
    function getShader(gl, id, type) {
        if (type === void 0) { type = false; }
        var shaderScript;
        var theSource;
        var currentChild;
        var shader;
        shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }
        currentChild = shaderScript.firstChild;
        theSource = "";
        while (currentChild) {
            if (currentChild.nodeType == 3) {
                theSource += currentChild.textContent;
            }
            currentChild = currentChild.nextSibling;
        }
        if (!type) {
            if (shaderScript.type == 'x-shader/x-fragment') {
                type = gl.FRAGMENT_SHADER;
            }
            else if (shaderScript.type == 'x-shader/x-vertex') {
                type = gl.VERTEX_SHADER;
            }
            else {
                console.log("Unknown shader type.");
                return null;
            }
        }
        shader = gl.createShader(type);
        //read shader text into source
        gl.shaderSource(shader, theSource);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log('An error ocurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }
    GLUtility.getShader = getShader;
    function getGLContext(canvas, opts) {
        return canvas.getContext('webgl', opts) || canvas.getContext('experimental-webgl', opts);
    }
    GLUtility.getGLContext = getGLContext;
    function nextPowerOfTwo(n) {
        var i = Math.floor(n / 2);
        while (i < n)
            i *= 2;
        return i;
    }
    GLUtility.nextPowerOfTwo = nextPowerOfTwo;
})(GLUtility = exports.GLUtility || (exports.GLUtility = {}));
