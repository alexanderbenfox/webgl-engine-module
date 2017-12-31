"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Prog = require("./Program");
var gameProgram;
function startProgram() {
    gameProgram = new Prog.Program();
}
exports.startProgram = startProgram;
window.starter = function () {
    gameProgram = new Prog.Program();
};
window.setCameraValue = function (value) {
    gameProgram.setCameraValue(value);
};
