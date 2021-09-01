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
function getTalentDetails(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const profile = yield primaClient_1.default.userJobProfile.findFirst({
                where: {
                    userId: BigInt(id)
                },
                include: {
                    user: true
                }
            });
            if (!profile) {
                res.status(404).send('Not Found!');
                return;
            }
            const skills = yield primaClient_1.default.jobSkill.findMany({
                where: {
                    userJobSkills: {
                        every: {
                            userId: BigInt(id)
                        }
                    }
                }
            });
            if (profile === null || profile === void 0 ? void 0 : profile.user) {
                delete profile.user.password;
            }
            res.json(superjson_1.serialize({
                profile,
                skills
            }).json);
        }
        catch (e) {
            console.log(e);
            res.status(404).send('Not Found!');
        }
    });
}
exports.default = getTalentDetails;
