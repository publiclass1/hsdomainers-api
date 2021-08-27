"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const primaClient_1 = __importDefault(require("../lib/primaClient"));
const pick_1 = __importDefault(require("lodash/pick"));
const jwt_1 = require("../lib/jwt");
const superjson_1 = require("superjson");
const router = express_1.Router();
router.get('/me', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = jwt_1.getUserId(req);
        const userObj = yield primaClient_1.default.user.findUnique({
            where: {
                id: userId
            }
        });
        res.json(superjson_1.serialize(userObj).json);
    });
});
router.patch('/me', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = jwt_1.getUserId(req);
        const userObj = yield primaClient_1.default.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!userObj) {
            return res.status(404).end();
        }
        const userFields = pick_1.default(req.body, ['about', 'email', 'name', 'image']);
        const updatedUser = yield primaClient_1.default.user.update({
            where: {
                id: userId
            },
            data: userFields
        });
        if (updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.password) {
            updatedUser === null || updatedUser === void 0 ? true : delete updatedUser.password;
        }
        updatedUser.token = jwt_1.generateAccessToken(updatedUser);
        const data = superjson_1.serialize(updatedUser).json;
        res.json(data);
    });
});
exports.default = router;
