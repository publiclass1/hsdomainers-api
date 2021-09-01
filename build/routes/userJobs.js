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
const jwt_1 = require("../lib/jwt");
const superjson_1 = require("superjson");
const router = express_1.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = jwt_1.getUserId(req);
    try {
        let data = yield primaClient_1.default.userJob.findMany({
            where: {
                userId,
            }
        });
        res.json(superjson_1.serialize(data).json);
    }
    catch (e) {
        console.log(e);
        res.status(422).send('Unprocessable Entity!');
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = jwt_1.getUserId(req);
    const { jobId } = req.body;
    try {
        let exists = yield primaClient_1.default.userJob.findFirst({
            where: {
                userId,
                jobId: BigInt(jobId)
            }
        });
        if (exists) {
            res.status(422).send('Unprocessable Entity!');
            return;
        }
        else {
            exists = yield primaClient_1.default.userJob.create({
                data: {
                    jobId: BigInt(jobId),
                    userId,
                    appliedDate: new Date(),
                    status: 'APPLIED'
                },
            });
        }
        res.json(superjson_1.serialize(exists).json);
    }
    catch (e) {
        console.log(e);
        res.status(422).send('Unprocessable Entity!');
    }
}));
router.patch('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = jwt_1.getUserId(req); // the employer or creator of the job
    const { id } = req.params;
    const { status } = req.body;
    try {
        const exists = yield primaClient_1.default.userJob.findUnique({
            where: {
                id: BigInt(id),
            },
            include: {
                job: true
            }
        });
        if (!exists) {
            res.status(404).send('Not Found!');
            return;
        }
        if (exists.job.postedByUserId !== userId) {
            //this current user is not an owner of the job
            console.log('Not a owner');
            res.json(403).end();
            return;
        }
        const rs = yield primaClient_1.default.userJob.update({
            where: {
                id: exists.id
            },
            data: {
                status
            }
        });
        res.json(superjson_1.serialize(rs).json);
    }
    catch (e) {
        console.log(e);
        res.status(422).send('Unprocessable Entity!');
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = jwt_1.getUserId(req);
    const { id } = req.params;
    try {
        const exists = yield primaClient_1.default.userJob.findFirst({
            where: {
                id: BigInt(id),
                userId
            }
        });
        if (!exists) {
            res.status(404).send('Not Found!');
            return;
        }
        const rs = yield primaClient_1.default.userJob.delete({
            where: {
                id: exists.id
            }
        });
        res.status(204).end();
    }
    catch (e) {
        console.log(e);
        res.status(422).send('Unprocessable Entity!');
    }
}));
exports.default = router;
