import prisma from "@/infra/database/database.config";
import { Prisma } from "@prisma/client";

export class ProductRepository {
  async findManyProducts(params: {
    where?: Prisma.ProductWhereInput & { categorySlug?: string };
    orderBy?:
      | Prisma.ProductOrderByWithRelationInput
      | Prisma.ProductOrderByWithRelationInput[];
    skip?: number;
    take?: number;
    select?: Prisma.ProductSelect;
  }) {
    const {
      where = {},
      orderBy = { createdAt: "desc" },
      skip = 0,
      take = 10,
      select,
    } = params;

    const { categorySlug, ...restWhere } = where;

    const finalWhere: Prisma.ProductWhereInput = {
      ...restWhere,
      ...(categorySlug
        ? {
            category: {
              is: {
                slug: {
                  equals: categorySlug,
                  mode: "insensitive",
                },
              },
            },
          }
        : {}),
    };

    const queryOptions: any = {
      where: finalWhere,
      orderBy,
      skip,
      take,
    };

    if (select) {
      queryOptions.select = select;
    } else {
      queryOptions.include = {
        variants: {
          include: {
            attributes: {
              include: {
                attribute: true,
                value: true,
              },
            },
          },
        },
      };
    }

    return prisma.product.findMany(queryOptions);
  }

  async countProducts(params: { where?: Prisma.ProductWhereInput }) {
    const { where = {} } = params;
    return prisma.product.count({ where });
  }

  async findProductById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: {
          include: {
            attributes: {
              include: {
                attribute: true,
                value: true,
              },
            },
          },
        },
      },
    });
  }

  async findProductByName(name: string) {
    return prisma.product.findUnique({
      where: { name },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });
  }

  async findProductBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: {
          include: {
            attributes: {
              include: {
                attribute: true,
                value: true,
              },
            },
          },
        },
      },
    });
  }

  async findProductNameById(id: string): Promise<string | null> {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { name: true },
    });
    return product?.name || null;
  }

  async createProduct(data: {
    name: string;
    slug: string;
    description?: string;
    isNew?: boolean;
    isTrending?: boolean;
    isBestSeller?: boolean;
    isFeatured?: boolean;
    categoryId?: string;
  }) {
    return prisma.product.create({
      data,
      include: {
        category: true,
        variants: {
          include: {
            attributes: { include: { attribute: true, value: true } },
          },
        },
      },
    });
  }

  async createManyProducts(
    data: {
      name: string;
      slug: string;
      description?: string;
      basePrice: number;
      discount?: number;
      isNew?: boolean;
      isTrending?: boolean;
      isBestSeller?: boolean;
      isFeatured?: boolean;
      categoryId?: string;
    }[]
  ) {
    return prisma.product.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async incrementSalesCount(id: string, quantity: number) {
    return prisma.product.update({
      where: { id },
      data: { salesCount: { increment: quantity } },
    });
  }

  async updateProduct(
    id: string,
    data: Partial<{
      name: string;
      slug: string;
      description?: string;
      basePrice: number;
      discount?: number;
      isNew?: boolean;
      isTrending?: boolean;
      isBestSeller?: boolean;
      isFeatured?: boolean;
      categoryId?: string;
    }>
  ) {
    return prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        variants: {
          include: {
            attributes: {
              include: {
                attribute: true,
                value: true,
              },
            },
          },
        },
      },
    });
  }

  async deleteProduct(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }
}
