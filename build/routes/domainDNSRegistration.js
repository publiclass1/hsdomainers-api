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
const dns_service_1 = __importDefault(require("../lib/dns.service."));
const router = express_1.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const domains = yield primaClient_1.default.domain.findMany({
        take: 255,
        where: {
            dnsStatus: 'PENDING'
        },
        orderBy: [{ updatedAt: 'asc' }]
    });
    const domainNames = domains.map(e => e.name);
    console.log({ domainNames });
    const rs = yield dns_service_1.default.createRecord(domainNames);
    if (rs && rs.domains) {
        const domainSuccess = [];
        const domainFails = [];
        for (let domain in rs.domains) {
            if (rs.domains[domain]) {
                domainSuccess.push(domain);
            }
            else {
                domainFails.push(domain);
            }
        }
        console.log({
            domainSuccess,
            domainFails
        });
        const transactionRs = yield primaClient_1.default.$transaction([
            primaClient_1.default.domain.updateMany({
                where: {
                    name: {
                        in: domainSuccess
                    }
                },
                data: {
                    dnsStatus: 'ACTIVE'
                }
            }),
            primaClient_1.default.domain.updateMany({
                where: {
                    name: {
                        in: domainFails
                    }
                },
                data: {
                    dnsStatus: 'DNS_ERROR'
                }
            })
        ]);
        console.log({ transactionRs });
    }
    console.log('create domains records', rs);
    res.sendStatus(200);
}));
exports.default = router;
