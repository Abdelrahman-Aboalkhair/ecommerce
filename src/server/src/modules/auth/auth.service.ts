import crypto from "crypto";
import AppError from "@/shared/errors/AppError";
import sendEmail from "@/shared/utils/sendEmail";
import passwordResetTemplate from "@/shared/templates/passwordReset";
import { tokenUtils, passwordUtils } from "@/shared/utils/authUtils";
import { AuthResponse, RegisterUserParams, SignInParams } from "./auth.types";
import { ROLE } from "@prisma/client";
import logger from "@/infra/winston/logger";
import jwt from "jsonwebtoken";
import { AuthRepository } from "./auth.repository";
import BadRequestError from "@/shared/errors/BadRequestError";
import NotFoundError from "@/shared/errors/NotFoundError";

export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async registerUser({
    name,
    email,
    password,
    role,
  }: RegisterUserParams): Promise<AuthResponse> {
    const existingUser = await this.authRepository.findUserByEmail(email);

    if (existingUser) {
      throw new AppError(
        400,
        "This email is already registered, please log in instead."
      );
    }

    // Force new registrations to be USER role only for security
    const newUser = await this.authRepository.createUser({
      email,
      name,
      password,
      role: ROLE.USER, // Ignore any role passed from client for security
    });

    const accessToken = tokenUtils.generateAccessToken(newUser.id);
    const refreshToken = tokenUtils.generateRefreshToken(newUser.id);

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: null,
      },
      accessToken,
      refreshToken,
    };
  }

  async signin({ email, password }: SignInParams): Promise<{
    user: {
      id: string;
      role: ROLE;
      name: string;
      email: string;
      avatar: string | null;
    };
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.authRepository.findUserByEmailWithPassword(email);

    if (!user) {
      throw new BadRequestError("Email or password is incorrect.");
    }

    if (!user.password) {
      throw new AppError(400, "Email or password is incorrect.");
    }
    const isPasswordValid = await passwordUtils.comparePassword(
      password,
      user.password
    );
    if (!isPasswordValid) {
      throw new AppError(400, "Email or password is incorrect.");
    }

    const accessToken = tokenUtils.generateAccessToken(user.id);
    const refreshToken = tokenUtils.generateRefreshToken(user.id);

    return { accessToken, refreshToken, user };
  }

  async signout(): Promise<{ message: string }> {
    return { message: "User logged out successfully" };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      throw new NotFoundError("Email");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    await this.authRepository.updateUserPasswordReset(email, {
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    const resetUrl = `${process.env.CLIENT_URL}/password-reset/${resetToken}`;
    const htmlTemplate = passwordResetTemplate(resetUrl);

    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      html: htmlTemplate,
      text: "Reset your password",
    });

    return { message: "Password reset email sent successfully" };
  }

  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await this.authRepository.findUserByResetToken(hashedToken);

    if (!user) {
      throw new BadRequestError("Invalid or expired reset token");
    }

    await this.authRepository.updateUserPassword(user.id, newPassword);

    return { message: "Password reset successful. You can now log in." };
  }

  async refreshToken(oldRefreshToken: string): Promise<{
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      avatar: string | null;
    };
    newAccessToken: string;
    newRefreshToken: string;
  }> {
    if (await tokenUtils.isTokenBlacklisted(oldRefreshToken)) {
      throw new NotFoundError("Refresh token");
    }

    const decoded = jwt.verify(
      oldRefreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as { id: string; absExp: number };

    const absoluteExpiration = decoded.absExp;
    const now = Math.floor(Date.now() / 1000);
    if (now > absoluteExpiration) {
      throw new AppError(401, "Session expired. Please log in again.");
    }

    const user = await this.authRepository.findUserById(decoded.id);
    console.log("refreshed user: ", user);

    if (!user) {
      throw new NotFoundError("User");
    }

    const newAccessToken = tokenUtils.generateAccessToken(user.id);
    const newRefreshToken = tokenUtils.generateRefreshToken(
      user.id,
      absoluteExpiration
    );

    const oldTokenTTL = absoluteExpiration - now;
    if (oldTokenTTL > 0) {
      await tokenUtils.blacklistToken(oldRefreshToken, oldTokenTTL);
    } else {
      logger.warn("Refresh token is already expired. No need to blacklist.");
    }

    return { user, newAccessToken, newRefreshToken };
  }
}
