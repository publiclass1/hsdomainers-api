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
const superjson_1 = require("superjson");
const primaClient_1 = __importDefault(require("../lib/primaClient"));
function authCreateAccount(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { compoundId, userId, providerType, providerId, providerAccountId, refreshToken, accessToken, accessTokenExpires, } = req.body;
        try {
            const data = yield primaClient_1.default.account.create({
                data: {
                    compoundId,
                    userId,
                    providerType,
                    providerId,
                    providerAccountId,
                    refreshToken,
                    accessToken,
                    accessTokenExpires,
                }
            });
            res.json((0, superjson_1.serialize)(data).json);
        }
        catch (e) {
            res.status(422).send('Unprocessable Entity!');
        }
    });
}
exports.default = authCreateAccount;
