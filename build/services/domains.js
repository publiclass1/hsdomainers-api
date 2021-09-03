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
exports.createDomain = void 0;
const primaClient_1 = __importDefault(require("../lib/primaClient"));
function createDomain(userId, name, price = 0) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let exists = yield primaClient_1.default.domain.findFirst({
                where: {
                    name,
                    userId,
                    buynowPrice: price
                }
            });
            if (!exists) {
                exists = yield primaClient_1.default.domain.create({
                    data: {
                        name: name,
                        nameLength: name.length,
                        hasHypen: name.includes('-'),
                        hasNumber: /^\d+$/.test(name),
                        extension: ((_a = name.split('.')) === null || _a === void 0 ? void 0 : _a.pop()) || '',
                        userId,
                        dnsStatus: 'PENDING',
                        leasePrice: 0,
                        buynowPrice: 0,
                        monthlyPrice: 0,
                        minimumOfferPrice: 0,
                    }
                });
            }
            return exists;
        }
        catch (e) {
            console.log(e.message);
        }
        return null;
    });
}
exports.createDomain = createDomain;
