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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const express_1 = require("express");
const csvtojson_1 = __importDefault(require("csvtojson"));
const superjson_1 = require("superjson");
const formidable_1 = require("formidable");
const jwt_1 = require("../lib/jwt");
const primaClient_1 = __importDefault(require("../lib/primaClient"));
const toInteger_1 = __importDefault(require("lodash/toInteger"));
const util_1 = require("../utils/util");
const router = express_1.Router();
router.get('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { limit = 25, page = 1, order_by = 'id' } = req.query;
        try {
            const total = yield primaClient_1.default.domain.count({
                where: {
                    userId: jwt_1.getUserId(req)
                }
            });
            const domains = yield primaClient_1.default.domain.findMany({
                where: {
                    userId: jwt_1.getUserId(req)
                },
                include: {
                    domainAnalytics: true
                },
                take: toInteger_1.default(limit),
                skip: (toInteger_1.default(limit) * (toInteger_1.default(page) - 1)),
                orderBy: {
                    id: 'asc'
                }
            });
            res.json({
                data: superjson_1.serialize(domains).json,
                total
            });
        }
        catch (e) {
            console.log(e);
            res.sendStatus(503);
        }
    });
});
router.get('/:name', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name } = req.params;
        try {
            const domain = yield primaClient_1.default.domain.findUnique({
                where: {
                    name
                }
            });
            if (domain) {
                res.json(superjson_1.serialize(domain).json);
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
router.post('/import', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const data = yield new Promise((resolve, reject) => {
        const form = new formidable_1.IncomingForm();
        form.parse(req, (err, fields, files) => {
            if (err)
                return reject(err);
            resolve({ fields, files });
        });
    });
    const filepath = (_a = data === null || data === void 0 ? void 0 : data.files) === null || _a === void 0 ? void 0 : _a.file.path;
    yield readCsvFile(filepath, (data) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        /**
            {
                name: 'goog.com',
                lease_price: 'com',
                buynow_price: '100',
                monthly_price: '10',
                minimum_offer_price: '20',
            }
        */
        // console.log(data)
        try {
            let exists = yield primaClient_1.default.domain.findFirst({
                where: {
                    name: data.name,
                    userId: jwt_1.getUserId(req)
                }
            });
            if (!exists) {
                yield primaClient_1.default.domain.create({
                    data: {
                        name: data.name,
                        nameLength: data.name.length,
                        hasHypen: data.name.includes('-'),
                        hasNumber: /^\d+$/.test(data.name),
                        extension: ((_b = data.name.split('.')) === null || _b === void 0 ? void 0 : _b.pop()) || '',
                        userId: jwt_1.getUserId(req),
                        dnsStatus: 'PENDING',
                        leasePrice: toInteger_1.default(data.lease_price),
                        buynowPrice: toInteger_1.default(data.buynow_price),
                        monthlyPrice: toInteger_1.default(data.monthly_price),
                        minimumOfferPrice: toInteger_1.default(data.minimum_offer_price),
                    }
                });
            }
        }
        catch (e) {
            console.log(e.message);
        }
    }));
    res.json({
        status: 'uploaded'
    });
}));
router.post('/', function (req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const _b = req.body, { name } = _b, restData = __rest(_b, ["name"]);
        const parseData = util_1.toNumbers(restData);
        try {
            const count = yield primaClient_1.default.domain.count({
                where: {
                    name,
                    userId: jwt_1.getUserId(req)
                }
            });
            if (count) {
                return res.json({
                    errors: {
                        name: 'Already exists'
                    }
                });
            }
            const domain = yield primaClient_1.default.domain.create({
                data: Object.assign(Object.assign({ name }, parseData), { dnsStatus: 'PENDING', nameLength: name.length, hasHypen: name.includes('-'), hasNumber: /^\d+$/.test(name), extension: ((_a = name.split('.')) === null || _a === void 0 ? void 0 : _a.pop()) || '', userId: jwt_1.getUserId(req) })
            });
            res.json(superjson_1.serialize(domain).json);
        }
        catch (e) {
            console.log(e);
            res.sendStatus(503);
        }
    });
});
router.patch('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = BigInt(req.params.id);
    const data = req.body;
    const parseData = util_1.toNumbers(data);
    console.log({ data, parseData });
    try {
        const domain = yield primaClient_1.default.domain.findFirst({
            where: {
                id,
                userId: jwt_1.getUserId(req)
            }
        });
        if (!domain) {
            return res.sendStatus(404);
        }
        yield primaClient_1.default.domain.update({
            where: { id: domain.id },
            data: Object.assign({}, parseData)
        });
        res.sendStatus(202);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(422);
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = BigInt(req.params.id);
    const data = req.body;
    try {
        const domain = yield primaClient_1.default.domain.findFirst({
            where: {
                id,
                userId: jwt_1.getUserId(req)
            }
        });
        if (!domain) {
            return res.sendStatus(404);
        }
        yield primaClient_1.default.domain.delete({
            where: { id: domain.id },
        });
        res.sendStatus(204);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(422);
    }
}));
exports.default = router;
function readCsvFile(filepath, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        const stream = fs_1.default.createReadStream(filepath);
        return yield new Promise((resolve) => {
            stream.pipe(csvtojson_1.default())
                .on('data', function (row) {
                return __awaiter(this, void 0, void 0, function* () {
                    let domain = JSON.parse(row);
                    if (!domain.name || !domain.name.includes('.')) {
                        return null;
                    }
                    console.log(domain);
                    yield cb(domain);
                });
            })
                .on('end', function () {
                console.log('Data loaded');
                stream.destroy();
                resolve(null);
            });
        });
    });
}
