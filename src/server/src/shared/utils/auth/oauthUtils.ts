import prisma from "@/infra/database/database.config";
import { CartRepository } from "@/modules/cart/cart.repository";
import { CartService } from "@/modules/cart/cart.service";
import { cookieOptions } from "@/shared/constants";
import passport from "passport";
import { generateAccessToken, generateRefreshToken } from "./tokenUtils";

const cartRepo = new CartRepository();
const cartService = new CartService(cartRepo);

type OAuthProvider = "googleId" | "facebookId" | "twitterId";

async function findOrCreateUser(
  providerIdField: OAuthProvider,
  providerId: string,
  email: string,
  name: string,
  avatar: string
) {
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    if (!user[providerIdField as keyof typeof user]) {
      user = await prisma.user.update({
        where: { email },
        data: {
          [providerIdField as keyof typeof user]: providerId,
          avatar,
        },
      });
    }

    return user;
  }

  user = await prisma.user.create({
    data: {
      email,
      name,
      [providerIdField]: providerId,

      avatar,
    },
  });

  return user;
}

export const oauthCallback = async (
  providerIdField: OAuthProvider,
  accessToken: string,
  refreshToken: string,
  profile: any,
  done: (error: any, user?: any) => void
) => {
  try {
    let user;

    if (providerIdField === "googleId") {
      user = await findOrCreateUser(
        providerIdField,
        profile.id,
        profile.emails[0].value,
        profile.displayName,
        profile.photos[0]?.value || ""
      );
    }

    if (providerIdField === "facebookId") {
      user = await findOrCreateUser(
        providerIdField,
        profile.id,
        profile.emails[0]?.value || "",
        `${profile.name?.givenName} ${profile.name?.familyName}`,
        profile.photos?.[0]?.value || ""
      );
    }

    if (providerIdField === "twitterId") {
      user = await findOrCreateUser(
        providerIdField,
        profile.id,
        profile.emails?.[0]?.value || "",
        profile.displayName || profile.username || "",
        profile.photos?.[0]?.value || ""
      );
    }

    if (!user) {
      return done(null);
    }

    const id = user.id;

    const accessToken = generateAccessToken(id);
    const refreshToken = generateRefreshToken(id);

    return done(null, {
      ...user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return done(error);
  }
};

export const handleSocialLogin = (provider: string) => {
  const scopes =
    provider === "google"
      ? ["email", "profile"]
      : provider === "facebook"
      ? ["email", "public_profile"]
      : [];

  return passport.authenticate(provider, {
    session: false,
    scope: scopes,
  });
};
const CLIENT_URL_DEV = process.env.CLIENT_URL_DEV;
const CLIENT_URL_PROD = process.env.CLIENT_URL_PROD;
const env = process.env.NODE_ENV;
export const handleSocialLoginCallback = (provider: string) => {
  return [
    passport.authenticate(provider, {
      session: false,
      failureRedirect: env === "production" ? CLIENT_URL_PROD : CLIENT_URL_DEV,
    }),
    async (req: any, res: any) => {
      const user = req.user as any;

      const { accessToken, refreshToken } = user;

      res.cookie("refreshToken", refreshToken, cookieOptions);
      res.cookie("accessToken", accessToken, cookieOptions);

      const userId = user.id;
      const sessionId = req.session.id;
      await cartService?.mergeCartsOnLogin(sessionId, userId);

      res.redirect(env === "production" ? CLIENT_URL_PROD : CLIENT_URL_DEV);
    },
  ];
};
