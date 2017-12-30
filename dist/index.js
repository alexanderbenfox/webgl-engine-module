"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Prog = require("./Program");
function startProgram() {
    var gameProgram = new Prog.Program();
}
exports.startProgram = startProgram;
window.starter = function () {
    var gameProgram = new Prog.Program();
};
