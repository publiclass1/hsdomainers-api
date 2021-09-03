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
const merge_1 = __importDefault(require("lodash/merge"));
const router = (0, express_1.Router)();
router.get('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, domain, type, ip = req.socket.remoteAddress, agent = req.headers['user-agent'] } = (0, merge_1.default)(req.body, req.query);
        const domainData = yield primaClient_1.default.domain.findUnique({
            where: { name: domain }
        });
        if (!domainData) {
            res.status(404).send('Not Found');
            return;
        }
        let log = yield primaClient_1.default.domainViewLog.findFirst({
            where: {
                domainId: domainData.id,
                eventType: type,
                ip,
            }
        });
        try {
            if (!log) {
                const analytic = yield getAnalytics(domainData.id);
                yield primaClient_1.default.domainAnalytic.update({
                    where: { id: analytic.id },
                    data: {
                        clicks: type === 'CLICK' ? analytic.clicks + 1 : analytic.clicks,
                        views: type === 'VIEW' ? analytic.views + 1 : analytic.views,
                    }
                });
            }
        }
        catch (e) {
            console.log(e);
        }
        try {
            yield primaClient_1.default.domainViewLog.create({
                data: {
                    domainId: domainData.id,
                    eventType: type,
                    browser: agent,
                    ip,
                    data: data
                }
            });
        }
        catch (e) {
            console.log(e);
        }
        res.status(200).send('OK');
    });
});
exports.default = router;
function getAnalytics(domainId) {
    return __awaiter(this, void 0, void 0, function* () {
        let analytic = yield primaClient_1.default.domainAnalytic.findFirst({
            where: {
                domainId: domainId
            }
        });
        if (!analytic) {
            analytic = yield primaClient_1.default.domainAnalytic.create({
                data: {
                    domainId,
                    views: 0,
                    clicks: 0,
                }
            });
        }
        return analytic;
    });
}
