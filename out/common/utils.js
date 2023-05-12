"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNonce = exports.isSUB = exports.isSRT = exports.isASS = exports.isSSA = void 0;
const file_1 = require("../type/file");
function isSSA(filePath) {
    return filePath.endsWith(file_1.FIleType.SSA);
}
exports.isSSA = isSSA;
function isASS(filePath) {
    return filePath.endsWith(file_1.FIleType.ASS);
}
exports.isASS = isASS;
function isSRT(filePath) {
    return filePath.endsWith(file_1.FIleType.SRT);
}
exports.isSRT = isSRT;
function isSUB(filePath) {
    return filePath.endsWith(file_1.FIleType.SUB);
}
exports.isSUB = isSUB;
function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
exports.getNonce = getNonce;
//# sourceMappingURL=utils.js.map