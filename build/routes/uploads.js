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
const superjson_1 = require("superjson");
const jwt_1 = require("../lib/jwt");
const primaClient_1 = __importDefault(require("../lib/primaClient"));
const router = express_1.Router();
router.get('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { limit = 25, page = 1, } = req.query;
        const userId = jwt_1.getUserId(req);
        const total = yield primaClient_1.default.upload.count({
            where: {
                userId
            }
        });
        const files = yield primaClient_1.default.upload.findMany({
            where: {
                userId
            },
            take: limit,
            skip: (limit * (page - 1)),
            orderBy: {
                id: 'asc'
            }
        });
        res.json({
            data: superjson_1.serialize(files).json,
            total
        });
    });
});
router.get('/:id', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = jwt_1.getUserId(req);
        const { id } = req.params;
        const upload = yield primaClient_1.default.upload.findFirst({
            where: {
                id: BigInt(id),
                userId
            },
        });
        // console.log(name, upload)
        if (upload) {
            res.json(superjson_1.serialize(upload).json);
        }
        else {
            res.sendStatus(404);
        }
    });
});
router.patch('/:id', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = jwt_1.getUserId(req);
        const { id } = req.params;
        const { status } = req.body;
        const upload = yield primaClient_1.default.upload.findFirst({
            where: {
                id: BigInt(id),
                userId
            },
        });
        // console.log(name, upload)
        if (upload) {
            const updated = yield primaClient_1.default.upload.update({
                where: {
                    id: BigInt(id)
                },
                data: {
                    status
                }
            });
            res.json(superjson_1.serialize(upload).json);
        }
        else {
            res.sendStatus(404);
        }
    });
});
exports.default = router;
