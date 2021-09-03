"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = require("body-parser");
const jwt_1 = require("./lib/jwt");
const domains_1 = __importDefault(require("./routes/domains"));
const searchDomains_1 = __importDefault(require("./routes/searchDomains"));
const domainAnalytics_1 = __importDefault(require("./routes/domainAnalytics"));
const domainDNSRegistration_1 = __importDefault(require("./routes/domainDNSRegistration"));
const domainFavourites_1 = __importDefault(require("./routes/domainFavourites"));
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const uploads_1 = __importDefault(require("./routes/uploads"));
const userJobBookmarks_1 = __importDefault(require("./routes/userJobBookmarks"));
const userSkills_1 = __importDefault(require("./routes/userSkills"));
const userJobs_1 = __importDefault(require("./routes/userJobs"));
const jobs_1 = __importDefault(require("./routes/jobs"));
const jobCategory_1 = __importDefault(require("./routes/jobCategory"));
const jobSkills_1 = __importDefault(require("./routes/jobSkills"));
const getUploadUrl_1 = __importDefault(require("./handles/getUploadUrl"));
const getJobDetails_1 = __importDefault(require("./handles/getJobDetails"));
const getJobSkills_1 = __importDefault(require("./handles/getJobSkills"));
const getTalentDetails_1 = __importDefault(require("./handles/getTalentDetails"));
const putUserProfile_1 = __importDefault(require("./handles/putUserProfile"));
const getJobCategory_1 = __importDefault(require("./handles/getJobCategory"));
const app = (0, express_1.default)();
const started = Date.now();
const port = process.env.PORT || 3000;
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 512 // limit each IP to 100 requests per windowMs
});
//  apply to all requests
app.use(limiter);
app.use((0, body_parser_1.urlencoded)({ extended: true }));
app.use((0, body_parser_1.json)());
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://testnames.link:3000',
    ]
}));
app.use((0, morgan_1.default)('combined'));
app.use('/auth', auth_1.default);
app.use('/domains/dns-registers', domainDNSRegistration_1.default);
app.use('/domains/analytics', domainAnalytics_1.default);
app.use('/domains/search', searchDomains_1.default);
app.get('/talents/:id', getTalentDetails_1.default);
app.get('/jobs/:id', getJobDetails_1.default);
app.get('/jobs-skills', getJobSkills_1.default);
app.get('/jobs-categories', getJobCategory_1.default);
// ------------------
// protected routes
// ------------------
//job listings
app.get('/jobs-category', jwt_1.jwtMiddleware, jobCategory_1.default);
app.get('/jobs-skills', jwt_1.jwtMiddleware, jobSkills_1.default);
app.get('/jobs', jwt_1.jwtMiddleware, jobs_1.default);
app.use('/domains/favourites', jwt_1.jwtMiddleware, domainFavourites_1.default);
app.use('/domains', jwt_1.jwtMiddleware, domains_1.default);
//employers jobs posted
// users applied jobs
app.put('/users/:id/job-profiles', jwt_1.jwtMiddleware, putUserProfile_1.default);
app.use('/users/:id/jobs', jwt_1.jwtMiddleware, userJobs_1.default);
app.use('/users/:id/skills', jwt_1.jwtMiddleware, userSkills_1.default);
app.use('/users/:id/job-bookmarks', jwt_1.jwtMiddleware, userJobBookmarks_1.default);
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
