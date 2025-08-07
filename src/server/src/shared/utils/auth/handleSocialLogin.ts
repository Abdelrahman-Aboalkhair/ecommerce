import passport from "passport";

const handleSocialLogin = (provider: string) => {
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

export default handleSocialLogin;
