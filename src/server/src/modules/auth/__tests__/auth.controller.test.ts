import { ROLE } from "@prisma/client";
import { makeAuthController } from "../auth.factory";
import { testUtils } from "@/test/utils/testUtils";

describe("AuthController", () => {
  let authController: any;

  beforeEach(() => {
    authController = makeAuthController();
  });

  afterEach(async () => {
    await testUtils.cleanup();
  });

  describe("signup", () => {
    it("should register user successfully", async () => {
      const req = testUtils.createTestRequest(null, {
        name: "Test User",
        email: "test@example.com",
        password: "TestPassword123!",
      });
      const res = testUtils.createTestResponse();
      const next = testUtils.createTestNext();

      await authController.signup(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            user: expect.objectContaining({
              name: "Test User",
              email: "test@example.com",
              role: ROLE.USER,
            }),
            accessToken: expect.any(String),
          }),
          message: "User registered successfully",
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle validation errors", async () => {
      const req = testUtils.createTestRequest(null, {
        name: "",
        email: "invalid-email",
        password: "weak",
      });
      const res = testUtils.createTestResponse();
      const next = testUtils.createTestNext();

      await authController.signup(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
        })
      );
    });

    it("should handle duplicate email error", async () => {
      // Create first user
      const firstReq = testUtils.createTestRequest(null, {
        name: "First User",
        email: "test@example.com",
        password: "TestPassword123!",
      });
      const firstRes = testUtils.createTestResponse();
      const firstNext = testUtils.createTestNext();

      await authController.signup(firstReq, firstRes, firstNext);

      // Try to create second user with same email
      const secondReq = testUtils.createTestRequest(null, {
        name: "Second User",
        email: "test@example.com",
        password: "TestPassword123!",
      });
      const secondRes = testUtils.createTestResponse();
      const secondNext = testUtils.createTestNext();

      await authController.signup(secondReq, secondRes, secondNext);

      expect(secondNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: "An account with this email already exists.",
        })
      );
    });
  });

  describe("signin", () => {
    let testUser: any;

    beforeEach(async () => {
      testUser = await testUtils.createTestUser(ROLE.USER, "test@example.com");
    });

    it("should sign in user successfully", async () => {
      const req = testUtils.createTestRequest(null, {
        email: "test@example.com",
        password: "TestPassword123!",
      });
      const res = testUtils.createTestResponse();
      const next = testUtils.createTestNext();

      await authController.signin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            user: expect.objectContaining({
              email: "test@example.com",
            }),
            accessToken: expect.any(String),
          }),
          message: "Signed in successfully",
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle invalid credentials", async () => {
      const req = testUtils.createTestRequest(null, {
        email: "test@example.com",
        password: "WrongPassword123!",
      });
      const res = testUtils.createTestResponse();
      const next = testUtils.createTestNext();

      await authController.signin(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
          message: "Invalid credentials",
        })
      );
    });

    it("should handle non-existent user", async () => {
      const req = testUtils.createTestRequest(null, {
        email: "nonexistent@example.com",
        password: "TestPassword123!",
      });
      const res = testUtils.createTestResponse();
      const next = testUtils.createTestNext();

      await authController.signin(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
          message: "Invalid credentials",
        })
      );
    });
  });

  describe("signout", () => {
    let testUser: any;

    beforeEach(async () => {
      testUser = await testUtils.createTestUser(ROLE.USER, "test@example.com");
    });

    it("should sign out user successfully", async () => {
      const req = testUtils.createTestRequest(testUser);
      const res = testUtils.createTestResponse();
      const next = testUtils.createTestNext();

      await authController.signout(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Signed out successfully",
        })
      );
      expect(res.clearCookie).toHaveBeenCalledWith("refreshToken");
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle user not found", async () => {
      const req = testUtils.createTestRequest({ id: "non-existent-id" });
      const res = testUtils.createTestResponse();
      const next = testUtils.createTestNext();

      await authController.signout(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Signed out successfully",
        })
      );
    });
  });

  describe("refreshToken", () => {
    let testUser: any;

    beforeEach(async () => {
      testUser = await testUtils.createTestUser(ROLE.USER, "test@example.com");
    });

    it("should refresh token successfully", async () => {
      const refreshToken = testUtils.generateTestRefreshToken(testUser.id);
      const req = testUtils.createTestRequest(null, {}, {}, { refreshToken });
      const res = testUtils.createTestResponse();
      const next = testUtils.createTestNext();

      await authController.refreshToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            accessToken: expect.any(String),
            refreshToken: expect.any(String),
            user: expect.objectContaining({
              id: testUser.id,
            }),
          }),
          message: "Token refreshed successfully",
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle invalid refresh token", async () => {
      const req = testUtils.createTestRequest(
        null,
        {},
        {},
        { refreshToken: "invalid-token" }
      );
      const res = testUtils.createTestResponse();
      const next = testUtils.createTestNext();

      await authController.refreshToken(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
        })
      );
    });

    it("should handle missing refresh token", async () => {
      const req = testUtils.createTestRequest(null, {}, {}, {});
      const res = testUtils.createTestResponse();
      const next = testUtils.createTestNext();

      await authController.refreshToken(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: "Refresh token is required",
        })
      );
    });
  });

  describe("forgotPassword", () => {
    let testUser: any;

    beforeEach(async () => {
      testUser = await testUtils.createTestUser(ROLE.USER, "test@example.com");
    });

    it("should handle forgot password request", async () => {
      const req = testUtils.createTestRequest(null, {
        email: "test@example.com",
      });
      const res = testUtils.createTestResponse();
      const next = testUtils.createTestNext();

      await authController.forgotPassword(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: expect.stringContaining("Password reset email sent"),
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle missing email", async () => {
      const req = testUtils.createTestRequest(null, {});
      const res = testUtils.createTestResponse();
      const next = testUtils.createTestNext();

      await authController.forgotPassword(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: "Email is required",
        })
      );
    });

    it("should handle invalid email format", async () => {
      const req = testUtils.createTestRequest(null, {
        email: "invalid-email",
      });
      const res = testUtils.createTestResponse();
      const next = testUtils.createTestNext();

      await authController.forgotPassword(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
        })
      );
    });
  });

  describe("resetPassword", () => {
    let testUser: any;

    beforeEach(async () => {
      testUser = await testUtils.createTestUser(ROLE.USER, "test@example.com");
    });

    it("should reset password successfully", async () => {
      const req = testUtils.createTestRequest(null, {
        token: "valid-reset-token",
        password: "NewPassword123!",
      });
      const res = testUtils.createTestResponse();
      const next = testUtils.createTestNext();

      await authController.resetPassword(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: expect.stringContaining("Password reset successfully"),
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle missing token", async () => {
      const req = testUtils.createTestRequest(null, {
        password: "NewPassword123!",
      });
      const res = testUtils.createTestResponse();
      const next = testUtils.createTestNext();

      await authController.resetPassword(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: "Reset token is required",
        })
      );
    });

    it("should handle missing password", async () => {
      const req = testUtils.createTestRequest(null, {
        token: "valid-reset-token",
      });
      const res = testUtils.createTestResponse();
      const next = testUtils.createTestNext();

      await authController.resetPassword(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: "New password is required",
        })
      );
    });

    it("should handle invalid token", async () => {
      const req = testUtils.createTestRequest(null, {
        token: "invalid-token",
        password: "NewPassword123!",
      });
      const res = testUtils.createTestResponse();
      const next = testUtils.createTestNext();

      await authController.resetPassword(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
        })
      );
    });
  });

  describe("getMe", () => {
    let testUser: any;

    beforeEach(async () => {
      testUser = await testUtils.createTestUser(ROLE.USER, "test@example.com");
    });

    it("should return current user data", async () => {
      const req = testUtils.createTestRequest(testUser);
      const res = testUtils.createTestResponse();
      const next = testUtils.createTestNext();

      await authController.getMe(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            id: testUser.id,
            email: testUser.email,
            name: testUser.name,
            role: testUser.role,
          }),
          message: "User data retrieved successfully",
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle user not found", async () => {
      const req = testUtils.createTestRequest({ id: "non-existent-id" });
      const res = testUtils.createTestResponse();
      const next = testUtils.createTestNext();

      await authController.getMe(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 404,
          message: "User not found",
        })
      );
    });
  });
});

