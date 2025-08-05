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
exports.handleSocialLoginCallback = exports.handleSocialLogin = exports.oauthCallback = void 0;
const database_config_1 = __importDefault(require("@/infra/database/database.config"));
const cart_repository_1 = require("@/modules/cart/cart.repository");
const cart_service_1 = require("@/modules/cart/cart.service");
const constants_1 = require("@/shared/constants");
const passport_1 = __importDefault(require("passport"));
const tokenUtils_1 = require("./tokenUtils");
const cartRepo = new cart_repository_1.CartRepository();
const cartService = new cart_service_1.CartService(cartRepo);
function findOrCreateUser(providerIdField, providerId, email, name, avatar) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield database_config_1.default.user.findUnique({
            where: { email },
        });
        if (user) {
            if (!user[providerIdField]) {
                user = yield database_config_1.default.user.update({
                    where: { email },
                    data: {
                        [providerIdField]: providerId,
                        avatar,
                        emailVerified: true,
                    },
                });
            }
            return user;
        }
        user = yield database_config_1.default.user.create({
            data: {
                email,
                name,
                [providerIdField]: providerId,
                emailVerified: true,
                avatar,
            },
        });
        return user;
    });
}
const oauthCallback = (providerIdField, accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    try {
        let user;
        if (providerIdField === "googleId") {
            user = yield findOrCreateUser(providerIdField, profile.id, profile.emails[0].value, profile.displayName, ((_a = profile.photos[0]) === null || _a === void 0 ? void 0 : _a.value) || "");
        }
        if (providerIdField === "facebookId") {
            user = yield findOrCreateUser(providerIdField, profile.id, ((_b = profile.emails[0]) === null || _b === void 0 ? void 0 : _b.value) || "", `${(_c = profile.name) === null || _c === void 0 ? void 0 : _c.givenName} ${(_d = profile.name) === null || _d === void 0 ? void 0 : _d.familyName}`, ((_f = (_e = profile.photos) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.value) || "");
        }
        if (providerIdField === "twitterId") {
            user = yield findOrCreateUser(providerIdField, profile.id, ((_h = (_g = profile.emails) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.value) || "", profile.displayName || profile.username || "", ((_k = (_j = profile.photos) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.value) || "");
        }
        if (!user) {
            return done(null);
        }
        const id = user.id;
        const accessToken = (0, tokenUtils_1.generateAccessToken)(id);
        const refreshToken = (0, tokenUtils_1.generateRefreshToken)(id);
        return done(null, Object.assign(Object.assign({}, user), { accessToken,
            refreshToken }));
    }
    catch (error) {
        return done(error);
    }
});
exports.oauthCallback = oauthCallback;
const handleSocialLogin = (provider) => {
    const scopes = provider === "google"
        ? ["email", "profile"]
        : provider === "facebook"
            ? ["email", "public_profile"]
            : [];
    return passport_1.default.authenticate(provider, {
        session: false,
        scope: scopes,
    });
};
exports.handleSocialLogin = handleSocialLogin;
const handleSocialLoginCallback = (provider) => {
    return [
        passport_1.default.authenticate(provider, {
            session: false,
            failureRedirect: "http://localhost:3000/sign-in",
        }),
        (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const user = req.user;
            const { accessToken, refreshToken } = user;
            res.cookie("refreshToken", refreshToken, constants_1.cookieOptions);
            res.cookie("accessToken", accessToken, constants_1.cookieOptions);
            const userId = user.id;
            const sessionId = req.session.id;
            yield (cartService === null || cartService === void 0 ? void 0 : cartService.mergeCartsOnLogin(sessionId, userId));
            res.redirect("http://localhost:3000");
        }),
    ];
};
exports.handleSocialLoginCallback = handleSocialLoginCallback;
