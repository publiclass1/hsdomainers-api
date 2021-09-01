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
const md5_1 = __importDefault(require("md5"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const jwt_1 = require("../lib/jwt");
const primaClient_1 = __importDefault(require("../lib/primaClient"));
const superjson_1 = require("superjson");
function getUploadUrl(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const userId = jwt_1.getUserId(req);
        const fileName = req.query.fileName;
        const fileSize = req.query.fileSize;
        const fileType = req.query.fileType;
        const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
        const AWS_REGION = process.env.AWS_REGION;
        if (!fileName) {
            return res.status(422).send('Unprocessable Entity!');
        }
        const s3FilenameKey = `${userId || md5_1.default(`${Date.now()}+${req.ip}`)}-${Date.now()}-${md5_1.default(fileName)}`;
        aws_sdk_1.default.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
            region: AWS_REGION,
            signatureVersion: 'v4',
        });
        const extension = ((_a = fileName === null || fileName === void 0 ? void 0 : fileName.split('.')) === null || _a === void 0 ? void 0 : _a.pop()) || '.mp4';
        const s3FileName = `${s3FilenameKey}.${extension}`;
        const s3 = new aws_sdk_1.default.S3();
        const url = yield s3.getSignedUrlPromise('putObject', {
            Bucket: AWS_BUCKET_NAME,
            Key: s3FileName,
            ContentType: fileType,
            Expires: 60,
            ACL: 'public-read',
        });
        const data = yield primaClient_1.default.upload.create({
            data: {
                userId,
                fileName,
                extension,
                size: +fileSize || 0,
                type: fileType,
                s3FileName: s3FilenameKey,
                s3Link: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${s3FileName}`,
            }
        });
        res.status(200).json({ url, data: superjson_1.serialize(data).json });
    });
}
exports.default = getUploadUrl;
