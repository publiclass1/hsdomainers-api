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
const router = express_1.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = jwt_1.getUserId(req);
    try {
        const rs = yield primaClient_1.default.jobBookmarks.findMany({
            where: {
                userId
            }
        });
        res.json(superjson_1.serialize(rs).json);
    }
    catch (e) {
        console.log(e);
        res.status(404).send('Not Found!');
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = jwt_1.getUserId(req);
    const { id } = req.params;
    try {
        const rs = yield primaClient_1.default.jobBookmarks.findFirst({
            where: {
                id: BigInt(id),
                userId
            }
        });
        res.json(superjson_1.serialize(rs).json);
    }
    catch (e) {
        console.log(e);
        res.status(404).send('Not Found!');
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const rs = yield primaClient_1.default.jobBookmarks.delete({
            where: {
                id: BigInt(id)
            }
        });
        res.status(204).end();
    }
    catch (e) {
        console.log(e);
        res.status(404).send('Not Found!');
    }
}));
exports.default = router;
