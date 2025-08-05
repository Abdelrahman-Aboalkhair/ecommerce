"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = configurePassport;
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_facebook_1 = require("passport-facebook");
const passport_twitter_1 = require("passport-twitter");
const oauthUtils_1 = require("@/shared/utils/auth/oauthUtils");
function configurePassport() {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.NODE_ENV === "production"
            ? process.env.GOOGLE_CALLBACK_URL_PROD
            : process.env.GOOGLE_CALLBACK_URL_DEV,
    }, (accessToken, refreshToken, profile, done) => (0, oauthUtils_1.oauthCallback)("googleId", accessToken, refreshToken, profile, done)));
    passport_1.default.use(new passport_facebook_1.Strategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.NODE_ENV === "production"
            ? process.env.FACEBOOK_CALLBACK_URL_PROD
            : process.env.FACEBOOK_CALLBACK_URL_DEV,
        profileFields: ["id", "emails", "name"],
    }, (accessToken, refreshToken, profile, done) => {
        console.log("facebook profile: ", profile);
        (0, oauthUtils_1.oauthCallback)("facebookId", accessToken, refreshToken, profile, done);
    }));
    passport_1.default.use(new passport_twitter_1.Strategy({
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: process.env.NODE_ENV === "production"
            ? process.env.TWITTER_CALLBACK_URL_PROD
            : process.env.TWITTER_CALLBACK_URL_DEV,
        includeEmail: true,
    }, (accessToken, refreshToken, profile, done) => {
        console.log("twitter profile: ", profile);
        (0, oauthUtils_1.oauthCallback)("twitterId", accessToken, refreshToken, profile, done);
    }));
}
