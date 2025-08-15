import prisma from "@/infra/database/database.config";
import { ROLE } from "@prisma/client";
import { passwordUtils } from "@/shared/utils/authUtils";

export class UserRepository {
  async findAllUsers() {
    return await prisma.user.findMany();
  }

  async findUserById(id: string | undefined) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
      },
    });
  }

  async findUserByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }

  async updateUser(
    id: string,
    data: Partial<{
      name?: string;
      email?: string;
      password?: string;
      avatar?: string;
      role?: ROLE;
      emailVerified?: boolean;
      emailVerificationToken?: string | null;
      emailVerificationTokenExpiresAt?: Date | null;
      resetPasswordToken?: string | null;
      resetPasswordTokenExpiresAt?: Date | null;
    }>
  ) {
    return await prisma.user.update({ where: { id }, data });
  }

  async deleteUser(id: string) {
    return await prisma.user.delete({ where: { id } });
  }

  async countUsersByRole(role: string) {
    return await prisma.user.count({
      where: { role: role as any },
    });
  }

  async createUser(data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) {
    // Hash the password before storing
    const hashedPassword = await passwordUtils.hashPassword(data.password);

    return await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: data.role as any,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
      },
    });
  }
}
