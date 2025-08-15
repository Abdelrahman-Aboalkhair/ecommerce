import { ROLE, PERMISSION_ACTION, RESOURCE_TYPE } from "@prisma/client";
import PermissionService from "../PermissionService";

describe("PermissionService", () => {
  describe("hasPermission", () => {
    describe("USER role permissions", () => {
      it("should allow user to read products", () => {
        const hasPermission = PermissionService.hasPermission(
          ROLE.USER,
          PERMISSION_ACTION.READ,
          RESOURCE_TYPE.PRODUCT
        );
        expect(hasPermission).toBe(true);
      });

      it("should allow user to read categories", () => {
        const hasPermission = PermissionService.hasPermission(
          ROLE.USER,
          PERMISSION_ACTION.READ,
          RESOURCE_TYPE.CATEGORY
        );
        expect(hasPermission).toBe(true);
      });

      it("should allow user to read reviews", () => {
        const hasPermission = PermissionService.hasPermission(
          ROLE.USER,
          PERMISSION_ACTION.READ,
          RESOURCE_TYPE.REVIEW
        );
        expect(hasPermission).toBe(true);
      });

      it("should allow user to create reviews", () => {
        const hasPermission = PermissionService.hasPermission(
          ROLE.USER,
          PERMISSION_ACTION.CREATE,
          RESOURCE_TYPE.REVIEW
        );
        expect(hasPermission).toBe(true);
      });

      it("should allow user to update own profile", () => {
        const hasPermission = PermissionService.hasPermission(
          ROLE.USER,
          PERMISSION_ACTION.UPDATE,
          RESOURCE_TYPE.USER
        );
        expect(hasPermission).toBe(true);
      });

      it("should NOT allow user to create products", () => {
        const hasPermission = PermissionService.hasPermission(
          ROLE.USER,
          PERMISSION_ACTION.CREATE,
          RESOURCE_TYPE.PRODUCT
        );
        expect(hasPermission).toBe(false);
      });

      it("should NOT allow user to delete products", () => {
        const hasPermission = PermissionService.hasPermission(
          ROLE.USER,
          PERMISSION_ACTION.DELETE,
          RESOURCE_TYPE.PRODUCT
        );
        expect(hasPermission).toBe(false);
      });

      it("should NOT allow user to access admin panel", () => {
        const hasPermission = PermissionService.hasPermission(
          ROLE.USER,
          PERMISSION_ACTION.ACCESS_ADMIN_PANEL,
          RESOURCE_TYPE.SETTINGS
        );
        expect(hasPermission).toBe(false);
      });
    });

    describe("ADMIN role permissions", () => {
      it("should allow admin to read products", () => {
        const hasPermission = PermissionService.hasPermission(
          ROLE.ADMIN,
          PERMISSION_ACTION.READ,
          RESOURCE_TYPE.PRODUCT
        );
        expect(hasPermission).toBe(true);
      });

      it("should allow admin to create products", () => {
        const hasPermission = PermissionService.hasPermission(
          ROLE.ADMIN,
          PERMISSION_ACTION.CREATE,
          RESOURCE_TYPE.PRODUCT
        );
        expect(hasPermission).toBe(true);
      });

      it("should allow admin to update products", () => {
        const hasPermission = PermissionService.hasPermission(
          ROLE.ADMIN,
          PERMISSION_ACTION.UPDATE,
          RESOURCE_TYPE.PRODUCT
        );
        expect(hasPermission).toBe(true);
      });

      it("should allow admin to manage orders", () => {
        const hasPermission = PermissionService.hasPermission(
          ROLE.ADMIN,
          PERMISSION_ACTION.MANAGE_ORDERS,
          RESOURCE_TYPE.ORDER
        );
        expect(hasPermission).toBe(true);
      });

      it("should allow admin to access admin panel", () => {
        const hasPermission = PermissionService.hasPermission(
          ROLE.ADMIN,
          PERMISSION_ACTION.ACCESS_ADMIN_PANEL,
          RESOURCE_TYPE.SETTINGS
        );
        expect(hasPermission).toBe(true);
      });

      it("should allow admin to read payments", () => {
        const hasPermission = PermissionService.hasPermission(
          ROLE.ADMIN,
          PERMISSION_ACTION.READ,
          RESOURCE_TYPE.PAYMENT
        );
        expect(hasPermission).toBe(true);
      });

      it("should allow admin to update payments", () => {
        const hasPermission = PermissionService.hasPermission(
          ROLE.ADMIN,
          PERMISSION_ACTION.UPDATE,
          RESOURCE_TYPE.PAYMENT
        );
        expect(hasPermission).toBe(true);
      });

      it("should NOT allow admin to delete products", () => {
        const hasPermission = PermissionService.hasPermission(
          ROLE.ADMIN,
          PERMISSION_ACTION.DELETE,
          RESOURCE_TYPE.PRODUCT
        );
        expect(hasPermission).toBe(false);
      });

      it("should NOT allow admin to manage users", () => {
        const hasPermission = PermissionService.hasPermission(
          ROLE.ADMIN,
          PERMISSION_ACTION.MANAGE_USERS,
          RESOURCE_TYPE.USER
        );
        expect(hasPermission).toBe(false);
      });
    });

    describe("SUPERADMIN role permissions", () => {
      it("should allow superadmin to read products", () => {
        const hasPermission = PermissionService.hasPermission(
          ROLE.SUPERADMIN,
          PERMISSION_ACTION.READ,
          RESOURCE_TYPE.PRODUCT
        );
        expect(hasPermission).toBe(true);
      });

      it("should allow superadmin to create products", () => {
        const hasPermission = PermissionService.hasPermission(
          ROLE.SUPERADMIN,
          PERMISSION_ACTION.CREATE,
          RESOURCE_TYPE.PRODUCT
        );
        expect(hasPermission).toBe(true);
      });

      it("should allow superadmin to update products", () => {
        const hasPermission = PermissionService.hasPermission(
          ROLE.SUPERADMIN,
          PERMISSION_ACTION.UPDATE,
          RESOURCE_TYPE.PRODUCT
        );
        expect(hasPermission).toBe(true);
      });

      it("should allow superadmin to delete products", () => {
        const hasPermission = PermissionService.hasPermission(
          ROLE.SUPERADMIN,
          PERMISSION_ACTION.DELETE,
          RESOURCE_TYPE.PRODUCT
        );
        expect(hasPermission).toBe(true);
      });

      it("should allow superadmin to manage users", () => {
        const hasPermission = PermissionService.hasPermission(
          ROLE.SUPERADMIN,
          PERMISSION_ACTION.MANAGE_USERS,
          RESOURCE_TYPE.USER
        );
        expect(hasPermission).toBe(true);
      });

      it("should allow superadmin to delete users", () => {
        const hasPermission = PermissionService.hasPermission(
          ROLE.SUPERADMIN,
          PERMISSION_ACTION.DELETE,
          RESOURCE_TYPE.USER
        );
        expect(hasPermission).toBe(true);
      });

      it("should allow superadmin to manage settings", () => {
        const hasPermission = PermissionService.hasPermission(
          ROLE.SUPERADMIN,
          PERMISSION_ACTION.MANAGE_SETTINGS,
          RESOURCE_TYPE.SETTINGS
        );
        expect(hasPermission).toBe(true);
      });

      it("should allow superadmin to access admin panel", () => {
        const hasPermission = PermissionService.hasPermission(
          ROLE.SUPERADMIN,
          PERMISSION_ACTION.ACCESS_ADMIN_PANEL,
          RESOURCE_TYPE.SETTINGS
        );
        expect(hasPermission).toBe(true);
      });
    });
  });

  describe("canAccessAdminPanel", () => {
    it("should return false for USER role", () => {
      const canAccess = PermissionService.canAccessAdminPanel(ROLE.USER);
      expect(canAccess).toBe(false);
    });

    it("should return true for ADMIN role", () => {
      const canAccess = PermissionService.canAccessAdminPanel(ROLE.ADMIN);
      expect(canAccess).toBe(true);
    });

    it("should return true for SUPERADMIN role", () => {
      const canAccess = PermissionService.canAccessAdminPanel(ROLE.SUPERADMIN);
      expect(canAccess).toBe(true);
    });
  });

  describe("canManageUsers", () => {
    it("should return false for USER role", () => {
      const canManage = PermissionService.canManageUsers(ROLE.USER);
      expect(canManage).toBe(false);
    });

    it("should return false for ADMIN role", () => {
      const canManage = PermissionService.canManageUsers(ROLE.ADMIN);
      expect(canManage).toBe(false);
    });

    it("should return true for SUPERADMIN role", () => {
      const canManage = PermissionService.canManageUsers(ROLE.SUPERADMIN);
      expect(canManage).toBe(true);
    });
  });

  describe("canManageProducts", () => {
    it("should return false for USER role", () => {
      const canManage = PermissionService.canManageProducts(ROLE.USER);
      expect(canManage).toBe(false);
    });

    it("should return true for ADMIN role", () => {
      const canManage = PermissionService.canManageProducts(ROLE.ADMIN);
      expect(canManage).toBe(true);
    });

    it("should return true for SUPERADMIN role", () => {
      const canManage = PermissionService.canManageProducts(ROLE.SUPERADMIN);
      expect(canManage).toBe(true);
    });
  });

  describe("canManageOrders", () => {
    it("should return false for USER role", () => {
      const canManage = PermissionService.canManageOrders(ROLE.USER);
      expect(canManage).toBe(false);
    });

    it("should return true for ADMIN role", () => {
      const canManage = PermissionService.canManageOrders(ROLE.ADMIN);
      expect(canManage).toBe(true);
    });

    it("should return true for SUPERADMIN role", () => {
      const canManage = PermissionService.canManageOrders(ROLE.SUPERADMIN);
      expect(canManage).toBe(true);
    });
  });

  describe("getRolePermissions", () => {
    it("should return user permissions for USER role", () => {
      const permissions = PermissionService.getRolePermissions(ROLE.USER);
      expect(permissions).toBeDefined();
      expect(permissions.length).toBeGreaterThan(0);
      expect(
        permissions.some(
          (p) =>
            p.action === PERMISSION_ACTION.READ &&
            p.resource === RESOURCE_TYPE.PRODUCT
        )
      ).toBe(true);
    });

    it("should return admin permissions for ADMIN role", () => {
      const permissions = PermissionService.getRolePermissions(ROLE.ADMIN);
      expect(permissions).toBeDefined();
      expect(permissions.length).toBeGreaterThan(0);
      expect(
        permissions.some(
          (p) =>
            p.action === PERMISSION_ACTION.MANAGE_PRODUCTS &&
            p.resource === RESOURCE_TYPE.PRODUCT
        )
      ).toBe(true);
    });

    it("should return superadmin permissions for SUPERADMIN role", () => {
      const permissions = PermissionService.getRolePermissions(ROLE.SUPERADMIN);
      expect(permissions).toBeDefined();
      expect(permissions.length).toBeGreaterThan(0);
      expect(
        permissions.some(
          (p) =>
            p.action === PERMISSION_ACTION.MANAGE_USERS &&
            p.resource === RESOURCE_TYPE.USER
        )
      ).toBe(true);
    });

    it("should return empty array for invalid role", () => {
      const permissions = PermissionService.getRolePermissions(
        "INVALID_ROLE" as ROLE
      );
      expect(permissions).toEqual([]);
    });
  });

  describe("getAvailableRoles", () => {
    it("should return all available roles", () => {
      const roles = PermissionService.getAvailableRoles();
      expect(roles).toBeDefined();
      expect(roles.length).toBe(3);
      expect(roles.map((r) => r.value)).toEqual([
        ROLE.USER,
        ROLE.ADMIN,
        ROLE.SUPERADMIN,
      ]);
    });

    it("should include role descriptions", () => {
      const roles = PermissionService.getAvailableRoles();
      expect(roles[0].description).toBe("Regular user with basic permissions");
      expect(roles[1].description).toBe(
        "Administrator with management permissions"
      );
      expect(roles[2].description).toBe("Super administrator with full access");
    });
  });
});

