"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Prog = require("./Program");
var Component_1 = require("./Components/Component");
var gameProgram;
function startProgram() {
    gameProgram = new Prog.Program();
}
exports.startProgram = startProgram;
window.starter = function () {
    Component_1.testFunction();
    console.log("Ran tests");
    gameProgram = new Prog.Program();
};
window.setCameraValue = function (value) {
    gameProgram.setCameraValue(value);
};
window.addGameObject = function () {
    gameProgram.addGameObject();
};
