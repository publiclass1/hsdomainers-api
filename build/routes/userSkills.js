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
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = (0, jwt_1.getUserId)(req);
    const { rate, jobSkillId } = req.body;
    try {
        let data = yield primaClient_1.default.userJobSkill.findMany({
            where: {
                userId,
            }
        });
        res.json((0, superjson_1.serialize)(data).json);
    }
    catch (e) {
        console.log(e);
        res.status(422).send('Unprocessable Entity!');
    }
}));
router.put('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = (0, jwt_1.getUserId)(req);
    const { rate, jobSkillId } = req.body;
    try {
        let exists = yield primaClient_1.default.userJobSkill.findFirst({
            where: {
                userId,
                jobSkillId: BigInt(jobSkillId)
            }
        });
        if (exists) {
            exists = yield primaClient_1.default.userJobSkill.update({
                where: {
                    id: exists.id,
                },
                data: {
                    rate
                },
            });
        }
        else {
            exists = yield primaClient_1.default.userJobSkill.create({
                data: {
                    rate,
                    jobSkillId: BigInt(jobSkillId),
                    userId
                },
            });
        }
        res.json((0, superjson_1.serialize)(exists).json);
    }
    catch (e) {
        console.log(e);
        res.status(422).send('Unprocessable Entity!');
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = (0, jwt_1.getUserId)(req);
    const { id } = req.params;
    try {
        const rs = yield primaClient_1.default.userJobSkill.delete({
            where: {
                id: BigInt(id)
            }
        });
        res.status(204).end();
    }
    catch (e) {
        console.log(e);
        res.status(422).send('Unprocessable Entity!');
    }
}));
exports.default = router;
