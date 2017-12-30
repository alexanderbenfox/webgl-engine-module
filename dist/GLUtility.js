"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
///<reference path="EngineUtility.ts"/>
var ShaderProperties = /** @class */ (function () {
    function ShaderProperties(position_, texture_, resolution_, matrix_, program_) {
        this.position = position_;
        this.texture = texture_;
        this.resolution = resolution_;
        this.matrix = matrix_;
        this.program = program_;
    }
    return ShaderProperties;
}());
exports.ShaderProperties = ShaderProperties;
var GLUtility;
(function (GLUtility) {
    function initGL(gl, size, line) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.depthFunc(gl.LEQUAL);
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        gl.enable(gl.BLEND);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        if (line)
            return initShaderNoTexture(gl);
        return initShaders(gl);
    }
    GLUtility.initGL = initGL;
    function initShaders(gl) {
        var fragmentShader = getShader(gl, 'shader-fs');
        var vertexShader = getShader(gl, 'shader-vs');
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
        var textureCoordinate = gl.getAttribLocation(shaderProgram, 'aTextureCoordinate');
        gl.enableVertexAttribArray(textureCoordinate);
        var resolutionLocation = gl.getUniformLocation(shaderProgram, 'uResolution');
        var transformationMatrix = gl.getUniformLocation(shaderProgram, 'uMatrix');
        console.log("Shaders initialized.");
        return new ShaderProperties(vertexPosition, textureCoordinate, resolutionLocation, transformationMatrix, shaderProgram);
    }
    GLUtility.initShaders = initShaders;
    function initShaderNoTexture(gl) {
        var fragmentShader = getShader(gl, 'shader-fs-not');
        var vertexShader = getShader(gl, 'shader-vs-not');
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
        var vertexColor = gl.getAttribLocation(shaderProgram, 'aVertexColor');
        gl.enableVertexAttribArray(vertexColor);
        var resolutionLocation = gl.getUniformLocation(shaderProgram, 'uResolution');
        var transformationMatrix = gl.getUniformLocation(shaderProgram, 'uMatrix');
        return new ShaderProperties(vertexPosition, vertexColor, resolutionLocation, transformationMatrix, shaderProgram);
    }
    GLUtility.initShaderNoTexture = initShaderNoTexture;
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
