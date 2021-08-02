"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = require("body-parser");
const jwt_1 = require("./lib/jwt");
const domains_1 = __importDefault(require("./routes/domains"));
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const app = express_1.default();
const started = Date.now();
const port = process.env.PORT || 3000;
app.use(cors_1.default());
app.use(body_parser_1.urlencoded({ extended: true }));
app.use(body_parser_1.json());
app.use('/auth', auth_1.default);
app.use('/domains', jwt_1.jwtMiddleware, domains_1.default);
app.use('/users', jwt_1.jwtMiddleware, user_1.default);
app.get('/', (req, res) => {
    res.json({
        upTime: new Date(Date.now() - started)
    });
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
