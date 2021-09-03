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
const jwt_1 = require("../lib/jwt");
const superjson_1 = require("superjson");
const router = (0, express_1.Router)();
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, expiration, salary } = req.body;
    const userId = (0, jwt_1.getUserId)(req);
    try {
        const data = yield primaClient_1.default.job.create({
            data: {
                postedByUserId: userId,
                title,
                description,
                expiration,
                salary
            }
        });
        res.json((0, superjson_1.serialize)(data).json);
    }
    catch (e) {
        console.log(e);
        res.status(422).send('Unprocessable Entity!');
    }
}));
exports.default = router;
