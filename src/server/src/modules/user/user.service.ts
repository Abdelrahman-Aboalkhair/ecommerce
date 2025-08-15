import AppError from "@/shared/errors/AppError";
import { UserRepository } from "./user.repository";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getAllUsers() {
    return await this.userRepository.findAllUsers();
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new AppError(404, "User not found");
    }
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new AppError(404, "User not found");
    }
    return user;
  }

  async getMe(id: string | undefined) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new AppError(404, "User not found");
    }
    return user;
  }

  async updateMe(
    id: string,
    data: Partial<{
      name?: string;
      email?: string;
      avatar?: string;
    }>
  ) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new AppError(404, "User not found");
    }
    return await this.userRepository.updateUser(id, data);
  }

  async deleteUser(id: string, currentUserId: string) {
    // Prevent self-deletion
    if (id === currentUserId) {
      throw new AppError(400, "You cannot delete your own account");
    }

    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    // Prevent deletion of last SUPERADMIN
    if (user.role === "SUPERADMIN") {
      const superAdminCount = await this.userRepository.countUsersByRole(
        "SUPERADMIN"
      );
      if (superAdminCount <= 1) {
        throw new AppError(400, "Cannot delete the last SuperAdmin");
      }
    }

    await this.userRepository.deleteUser(id);
  }

  async createAdmin(
    adminData: {
      name: string;
      email: string;
      password: string;
    },
    createdByUserId: string
  ) {
    const creator = await this.userRepository.findUserById(createdByUserId);

    if (!creator) {
      throw new AppError(404, "Creator user not found");
    }

    if (creator.role !== "SUPERADMIN") {
      throw new AppError(403, "Only SuperAdmins can create new admins");
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findUserByEmail(
      adminData.email
    );
    if (existingUser) {
      throw new AppError(400, "User with this email already exists");
    }

    // Create new admin with ADMIN role (not SUPERADMIN)
    const newAdmin = await this.userRepository.createUser({
      ...adminData,
      role: "ADMIN",
    });

    return newAdmin;
  }
}
