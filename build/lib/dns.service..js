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
const node_fetch_1 = __importDefault(require("node-fetch"));
const util_1 = require("../utils/util");
const API_URL = process.env.DNS_API_SERVER || 'http://localhost.link:3001';
const TOKEN = process.env.DNS_API_TOKEN || 'intersnipe';
class DNSServerAPIService {
    static createRecord(domains) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('domains to create', util_1.toJson({
                domains
            }));
            try {
                const rs = yield node_fetch_1.default(`${API_URL}/domains`, {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        'accept': 'application/json',
                        'x-token': TOKEN
                    },
                    body: util_1.toJson({
                        domains
                    })
                });
                const resData = yield rs.json();
                return resData;
            }
            catch (e) {
                console.log(e);
            }
            return false;
        });
    }
    static removeRecordByDomain(domain) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rs = yield node_fetch_1.default(`${API_URL}/domains/${domain}`, {
                    headers: {
                        'x-token': TOKEN
                    },
                    method: 'DELETE',
                });
                const resData = yield rs.json();
            }
            catch (e) {
                console.log(e);
            }
        });
    }
}
exports.default = DNSServerAPIService;
