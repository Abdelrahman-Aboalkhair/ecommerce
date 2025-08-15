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
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
require("./infra/cloudinary/config");
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const hpp_1 = __importDefault(require("hpp"));
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = __importDefault(require("./infra/winston/logger"));
const compression_1 = __importDefault(require("compression"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = require("connect-redis");
const redis_1 = __importDefault(require("./infra/cache/redis"));
const passport_2 = __importDefault(require("./infra/passport/passport"));
const constants_1 = require("./shared/constants");
const globalError_1 = __importDefault(require("./shared/errors/globalError"));
const logRequest_1 = require("./shared/middlewares/logRequest");
const routes_1 = require("./routes");
const graphql_1 = require("./graphql");
const webhook_routes_1 = __importDefault(require("./modules/webhook/webhook.routes"));
const health_routes_1 = __importDefault(require("./routes/health.routes"));
// import { preflightHandler } from "./shared/middlewares/preflightHandler";
const http_1 = require("http");
const socket_1 = require("@/infra/socket/socket");
const database_config_1 = require("./infra/database/database.config");
const swagger_1 = require("./docs/swagger");
dotenv_1.default.config();
const createApp = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    yield (0, database_config_1.connectDB)().catch((err) => {
        console.error("❌ Failed to connect to DB:", err);
        process.exit(1);
    });
    const httpServer = new http_1.Server(app);
    // Initialize Socket.IO
    const socketManager = new socket_1.SocketManager(httpServer);
    const io = socketManager.getIO();
    // Swagger Documentation
    (0, swagger_1.setupSwagger)(app);
    // Health check routes (no middleware applied)
    app.use("/", health_routes_1.default);
    // Basic
    app.use("/api/v1/webhook", body_parser_1.default.raw({ type: "application/json" }), webhook_routes_1.default);
    app.use(express_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET, constants_1.cookieParserOptions));
    app.set("trust proxy", 1);
    app.use((0, express_session_1.default)({
        store: new connect_redis_1.RedisStore({ client: redis_1.default }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true, // Keeps guest sessionId from the first request
        proxy: true, // Ensures secure cookies work with proxy
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true in prod
            sameSite: "none", // Required for cross-site cookies
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        },
    }));
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    (0, passport_2.default)();
    // Preflight handler removed to avoid conflicts
    // CORS must be applied BEFORE GraphQL setup
    app.use((0, cors_1.default)({
        origin: process.env.NODE_ENV === "production"
            ? ["https://ecommerce-nu-rosy.vercel.app"]
            : ["http://localhost:3000", "http://localhost:5173"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "X-Requested-With",
            "Apollo-Require-Preflight", // For GraphQL
        ],
    }));
    app.use((0, helmet_1.default)());
    app.use(helmet_1.default.frameguard({ action: "deny" }));
    // Extra Security
    app.use((0, express_mongo_sanitize_1.default)());
    app.use((0, hpp_1.default)({
        whitelist: ["sort", "filter", "fields", "page", "limit"],
    }));
    app.use((0, morgan_1.default)("combined", {
        stream: {
            write: (message) => logger_1.default.info(message.trim()),
        },
    }));
    app.use((0, compression_1.default)());
    app.use("/api", (0, routes_1.configureRoutes)(io));
    // GraphQL setup
    yield (0, graphql_1.configureGraphQL)(app);
    // Error & Logging
    app.use(globalError_1.default);
    app.use(logRequest_1.logRequest);
    return { app, httpServer };
});
exports.createApp = createApp;
