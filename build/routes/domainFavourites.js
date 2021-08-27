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
exports.default = router;
router.get('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = jwt_1.getUserId(req);
        try {
            const data = yield primaClient_1.default.domain.findMany({
                where: {
                    userId,
                    domainFavourites: {
                        every: {
                            id: { gt: 0 }
                        }
                    }
                }
            });
            res.json(superjson_1.serialize(data).json);
        }
        catch (e) {
            console.log(e);
            res.status(503).end();
        }
    });
});
/**
 * Add domains favourites
 */
router.post('/favourites', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = jwt_1.getUserId(req);
        const { domainId } = req.body;
        try {
            const data = yield primaClient_1.default.domainFavourite.create({
                data: {
                    userId,
                    domainId: BigInt(domainId)
                }
            });
            res.json(superjson_1.serialize(data).json);
        }
        catch (e) {
            console.log(e);
            res.status(503).end();
        }
    });
});
router.delete('/:id', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const domain = yield primaClient_1.default.domainFavourite.delete({
                where: {
                    id: BigInt(id)
                }
            });
            if (domain) {
                res.status(204).end();
            }
            else {
                res.sendStatus(404);
            }
        }
        catch (e) {
            console.log(e);
            res.sendStatus(503);
        }
    });
});
