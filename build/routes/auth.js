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
const bcrypt_1 = require("bcrypt");
const primaClient_1 = __importDefault(require("../lib/primaClient"));
const jwt_1 = require("../lib/jwt");
const router = express_1.Router();
router.post('/login', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        const user = yield primaClient_1.default.user.findUnique({
            where: {
                email: email,
            }
        });
        if (user && bcrypt_1.compareSync(password, user.password || '')) {
            delete user.password;
            res.json({
                token: jwt_1.generateAccessToken(user)
            });
        }
        else {
            return res.sendStatus(401);
        }
    });
});
router.post('/register', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        const existEmail = yield primaClient_1.default.user.findUnique({
            where: { email }
        });
        if (existEmail) {
            return res.json({
                errors: {
                    email: 'Already exists!'
                }
            });
        }
        const hash = bcrypt_1.hashSync(password, 10);
        try {
            const user = yield primaClient_1.default.user.create({
                data: {
                    password: hash,
                    email
                }
            });
            if (user) {
                delete user.password;
            }
            const token = jwt_1.generateAccessToken(user);
            res.json({ token });
        }
        catch (e) {
            console.log(e);
            res.sendStatus(422);
        }
    });
});
exports.default = router;
