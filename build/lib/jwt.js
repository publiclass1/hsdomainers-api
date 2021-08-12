"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserId = exports.generateAccessToken = exports.jwtMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const superjson_1 = require("superjson");
const secret = process.env.JWT_SECRET;
function jwtMiddleware(req, res, next) {
    const bearerHeaderToken = req.headers.authorization;
    const token = bearerHeaderToken === null || bearerHeaderToken === void 0 ? void 0 : bearerHeaderToken.split(' ');
    if (!bearerHeaderToken || !token || token.length !== 2) {
        return res.status(401).end();
    }
    const bearerToken = token[1];
    jsonwebtoken_1.default.verify(bearerToken, secret, (e, payload) => {
        if (e) {
            res.sendStatus(401);
        }
        else {
            req.user = payload;
            next();
        }
    });
}
exports.jwtMiddleware = jwtMiddleware;
function generateAccessToken(userData) {
    return jsonwebtoken_1.default.sign(superjson_1.serialize(userData).json, secret, {
        expiresIn: '1y'
    });
}
exports.generateAccessToken = generateAccessToken;
function getUserId(req) {
    return BigInt(req.user.id);
}
exports.getUserId = getUserId;
