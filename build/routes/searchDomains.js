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
const primaClient_1 = __importDefault(require("../lib/primaClient"));
const router = (0, express_1.Router)();
router.get('/:name', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name } = req.params;
        const domain = yield primaClient_1.default.domain.findFirst({
            where: {
                name: name,
                // status: {
                //   notIn: ['INACTIVE', 'PRIVATE']
                // }
            },
            include: {
                user: true,
            }
        });
        // console.log(name, domain)
        if (domain) {
            res.json((0, superjson_1.serialize)(domain).json);
        }
        else {
            res.sendStatus(404);
        }
    });
});
router.get('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { limit = 25, page = 1, search, extension } = req.query;
        const total = yield primaClient_1.default.domain.count({
            where: {
                name: {
                    contains: search
                }
            },
        });
        const domains = yield primaClient_1.default.domain.findMany({
            where: {
                name: {
                    contains: search
                }
            },
            include: {
                domainAnalytics: true,
                user: true,
            },
            take: limit,
            skip: (limit * (page - 1)),
            orderBy: {
                id: 'asc'
            }
        });
        res.json({
            data: (0, superjson_1.serialize)(domains).json,
            total
        });
    });
});
router.get('/:name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
exports.default = router;
