"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNumbers = exports.toJson = void 0;
const superjson_1 = __importDefault(require("superjson"));
function toJson(obj) {
    return superjson_1.default.stringify(obj);
}
exports.toJson = toJson;
function toNumbers(obj) {
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop) && obj[prop] !== null && !isNaN(obj[prop])) {
            obj[prop] = +obj[prop];
        }
    }
    return obj;
}
exports.toNumbers = toNumbers;
