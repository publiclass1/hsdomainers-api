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
const jwt_1 = require("../lib/jwt");
const primaClient_1 = __importDefault(require("../lib/primaClient"));
function putUserProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = jwt_1.getUserId(req);
        const { about, expectedSalary, experienceYear, skillSummary, } = req.body;
        try {
            let prof = yield primaClient_1.default.userJobProfile.findFirst({
                where: {
                    userId
                }
            });
            if (!prof) {
                prof = yield primaClient_1.default.userJobProfile.create({
                    data: {
                        userId,
                        about,
                        expectedSalary,
                        experienceYear,
                        skillSummary,
                    }
                });
            }
            else {
                prof = yield primaClient_1.default.userJobProfile.update({
                    where: {
                        id: prof.id
                    },
                    data: {
                        about,
                        expectedSalary,
                        experienceYear,
                        skillSummary,
                    }
                });
            }
            res.json(superjson_1.serialize(prof).json);
        }
        catch (e) {
            console.log(e);
            res.status(422).send('Unprocessable Entity!');
        }
    });
}
exports.default = putUserProfile;
