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
exports.default = configurePassport;
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_facebook_1 = require("passport-facebook");
const passport_twitter_1 = require("passport-twitter");
const database_config_1 = __importDefault(require("@/infra/database/database.config"));
const tokenUtils_1 = require("@/shared/utils/auth/tokenUtils");
function configurePassport() {
    // Google Strategy (unchanged)
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.NODE_ENV === "production"
            ? process.env.GOOGLE_CALLBACK_URL_PROD
            : process.env.GOOGLE_CALLBACK_URL_DEV,
    }, (accessToken, refreshToken, profile, done) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            let user = yield database_config_1.default.user.findUnique({
                where: { email: profile.emails[0].value },
            });
            if (user) {
                if (!user.googleId) {
                    user = yield database_config_1.default.user.update({
                        where: { email: profile.emails[0].value },
                        data: {
                            googleId: profile.id,
                            avatar: ((_a = profile.photos[0]) === null || _a === void 0 ? void 0 : _a.value) || "",
                        },
                    });
                }
            }
            else {
                user = yield database_config_1.default.user.create({
                    data: {
                        email: profile.emails[0].value,
                        name: profile.displayName,
                        googleId: profile.id,
                        avatar: ((_b = profile.photos[0]) === null || _b === void 0 ? void 0 : _b.value) || "",
                    },
                });
            }
            const id = user.id;
            const newAccessToken = (0, tokenUtils_1.generateAccessToken)(id);
            const newRefreshToken = (0, tokenUtils_1.generateRefreshToken)(id);
            return done(null, Object.assign(Object.assign({}, user), { accessToken: newAccessToken, refreshToken: newRefreshToken }));
        }
        catch (error) {
            console.error("Google Strategy error:", error);
            return done(error);
        }
    })));
    // Facebook Strategy (unchanged, assuming it works)
    passport_1.default.use(new passport_facebook_1.Strategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.NODE_ENV === "production"
            ? process.env.FACEBOOK_CALLBACK_URL_PROD
            : process.env.FACEBOOK_CALLBACK_URL_DEV,
        profileFields: ["id", "emails", "name"],
    }, (accessToken, refreshToken, profile, done) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        console.log("facebook profile: ", profile);
        try {
            let user = yield database_config_1.default.user.findUnique({
                where: { email: ((_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) || "" },
            });
            if (user) {
                if (!user.facebookId) {
                    user = yield database_config_1.default.user.update({
                        where: { email: ((_d = (_c = profile.emails) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value) || "" },
                        data: {
                            facebookId: profile.id,
                            avatar: ((_f = (_e = profile.photos) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.value) || "",
                        },
                    });
                }
            }
            else {
                user = yield database_config_1.default.user.create({
                    data: {
                        email: ((_h = (_g = profile.emails) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.value) || "",
                        name: `${(_j = profile.name) === null || _j === void 0 ? void 0 : _j.givenName} ${(_k = profile.name) === null || _k === void 0 ? void 0 : _k.familyName}`,
                        facebookId: profile.id,
                        avatar: ((_m = (_l = profile.photos) === null || _l === void 0 ? void 0 : _l[0]) === null || _m === void 0 ? void 0 : _m.value) || "",
                    },
                });
            }
            const id = user.id;
            const newAccessToken = (0, tokenUtils_1.generateAccessToken)(id);
            const newRefreshToken = (0, tokenUtils_1.generateRefreshToken)(id);
            return done(null, Object.assign(Object.assign({}, user), { accessToken: newAccessToken, refreshToken: newRefreshToken }));
        }
        catch (error) {
            console.error("Facebook Strategy error:", error);
            return done(error);
        }
    })));
    // Twitter Strategy (standalone, without oauthUtils)
    passport_1.default.use(new passport_twitter_1.Strategy({
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: process.env.NODE_ENV === "production"
            ? process.env.TWITTER_CALLBACK_URL_PROD
            : process.env.TWITTER_CALLBACK_URL_DEV,
        includeEmail: true,
    }, (accessToken, refreshToken, profile, done) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        console.log("Twitter accessToken:", accessToken);
        console.log("Twitter refreshToken:", refreshToken);
        console.log("Twitter profile:", JSON.stringify(profile, null, 2));
        try {
            if (!profile || !profile.id) {
                console.error("Twitter profile is missing or invalid:", profile);
                return done(new Error("Failed to fetch valid Twitter profile"));
            }
            const email = ((_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) ||
                `twitter-${profile.id}@placeholder.com`;
            const name = profile.displayName ||
                profile.username ||
                `Twitter User ${profile.id}`;
            const avatar = ((_d = (_c = profile.photos) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value) || "";
            let user = yield database_config_1.default.user.findUnique({
                where: { email },
            });
            if (user) {
                if (!user.twitterId) {
                    user = yield database_config_1.default.user.update({
                        where: { email },
                        data: {
                            twitterId: profile.id,
                            avatar,
                        },
                    });
                }
            }
            else {
                user = yield database_config_1.default.user.create({
                    data: {
                        email,
                        name,
                        twitterId: profile.id,
                        avatar,
                    },
                });
            }
            const id = user.id;
            const newAccessToken = (0, tokenUtils_1.generateAccessToken)(id);
            const newRefreshToken = (0, tokenUtils_1.generateRefreshToken)(id);
            return done(null, Object.assign(Object.assign({}, user), { accessToken: newAccessToken, refreshToken: newRefreshToken }));
        }
        catch (error) {
            console.error("Twitter Strategy error:", error);
            return done(error);
        }
    })));
}
