"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = require("body-parser");
const jwt_1 = require("./lib/jwt");
const domains_1 = __importDefault(require("./routes/domains"));
const searchDomains_1 = __importDefault(require("./routes/searchDomains"));
const domainAnalytics_1 = __importDefault(require("./routes/domainAnalytics"));
const domainDNSRegistration_1 = __importDefault(require("./routes/domainDNSRegistration"));
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const uploads_1 = __importDefault(require("./routes/uploads"));
const getUploadUrl_1 = __importDefault(require("./handles/getUploadUrl"));
const app = express_1.default();
const started = Date.now();
const port = process.env.PORT || 3000;
app.use(body_parser_1.urlencoded({ extended: true }));
app.use(body_parser_1.json());
app.use(cors_1.default());
app.use(morgan_1.default('combined'));
app.use('/auth', auth_1.default);
app.use('/domains/dns-registers', domainDNSRegistration_1.default);
app.use('/domains/analytics', domainAnalytics_1.default);
app.use('/domains/search', searchDomains_1.default);
// protected routes
app.use('/domains', jwt_1.jwtMiddleware, domains_1.default);
app.use('/users', jwt_1.jwtMiddleware, user_1.default);
app.get('/uploads/url', jwt_1.jwtMiddleware, getUploadUrl_1.default);
app.use('/uploads', jwt_1.jwtMiddleware, uploads_1.default);
app.get('/', (req, res) => {
    res.json({
        upTime: new Date(Date.now() - started)
    });
});
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
