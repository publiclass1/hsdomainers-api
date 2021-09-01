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
const superjson_1 = require("superjson");
const router = express_1.Router();
router.get('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { search = '', page = 1, limit = 25 } = req.query;
        const data = yield primaClient_1.default.jobCategory.findMany({
            where: {
                name: {
                    contains: search
                }
            },
            skip: (parseInt(page) - 1 * parseInt(limit)),
            take: parseInt(limit, 10)
        });
        res.json(superjson_1.serialize(data).json);
    });
});
router.post('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, parentId } = req.body;
        let jobCategory = yield primaClient_1.default.jobCategory.findFirst({
            where: {
                name: name.toLowerCase()
            }
        });
        if (!jobCategory) {
            jobCategory = yield primaClient_1.default.jobCategory.create({
                data: {
                    name,
                    parentId
                }
            });
        }
        res.json(superjson_1.serialize(jobCategory).json);
    });
});
exports.default = router;
