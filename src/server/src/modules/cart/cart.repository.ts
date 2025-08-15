import { Prisma } from "@prisma/client";
import prisma from "@/infra/database/database.config";

export class CartRepository {
  async getCartByUserId(userId: string) {
    console.log("🔍 [CART REPOSITORY] getCartByUserId called");
    console.log("🔍 [CART REPOSITORY] userId:", userId);

    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        cartItems: { include: { variant: { include: { product: true } } } },
      },
    });

    console.log("🔍 [CART REPOSITORY] Cart found by userId:", cart);
    console.log("🔍 [CART REPOSITORY] Cart ID:", cart?.id);
    console.log(
      "🔍 [CART REPOSITORY] Cart items count:",
      cart?.cartItems?.length
    );

    return cart;
  }

  async getCartBySessionId(sessionId: string) {
    console.log("🔍 [CART REPOSITORY] getCartBySessionId called");
    console.log("🔍 [CART REPOSITORY] sessionId:", sessionId);

    const cart = await prisma.cart.findUnique({
      where: { sessionId },
      include: {
        cartItems: { include: { variant: { include: { product: true } } } },
      },
    });

    console.log("🔍 [CART REPOSITORY] Cart found by sessionId:", cart);
    console.log("🔍 [CART REPOSITORY] Cart ID:", cart?.id);
    console.log(
      "🔍 [CART REPOSITORY] Cart items count:",
      cart?.cartItems?.length
    );

    return cart;
  }

  async createCart(data: { userId?: string; sessionId?: string }) {
    console.log("🔍 [CART REPOSITORY] createCart called");
    console.log("🔍 [CART REPOSITORY] data:", data);

    const cart = await prisma.cart.create({
      data,
      include: {
        cartItems: { include: { variant: { include: { product: true } } } },
      },
    });

    console.log("🔍 [CART REPOSITORY] Cart created:", cart);
    console.log("🔍 [CART REPOSITORY] Cart ID:", cart.id);

    return cart;
  }

  async findCartItem(cartId: string, variantId: string) {
    console.log("🔍 [CART REPOSITORY] findCartItem called");
    console.log("🔍 [CART REPOSITORY] cartId:", cartId);
    console.log("🔍 [CART REPOSITORY] variantId:", variantId);

    const item = await prisma.cartItem.findFirst({
      where: { cartId, variantId },
    });

    console.log("🔍 [CART REPOSITORY] Cart item found:", item);

    return item;
  }

  async addItemToCart(data: {
    cartId: string;
    variantId: string;
    quantity: number;
  }) {
    console.log("🔍 [CART REPOSITORY] addItemToCart called");
    console.log("🔍 [CART REPOSITORY] data:", data);

    try {
      // Validate stock
      const variant = await prisma.productVariant.findUnique({
        where: { id: data.variantId },
        select: { stock: true },
      });
      console.log(
        "🔍 [CART REPOSITORY] Variant found for stock check:",
        variant
      );

      if (!variant) {
        console.log("🔍 [CART REPOSITORY] ERROR: Variant not found");
        throw new Error("Variant not found");
      }
      if (variant.stock < data.quantity) {
        console.log("🔍 [CART REPOSITORY] ERROR: Insufficient stock");
        throw new Error(`Insufficient stock: only ${variant.stock} available`);
      }

      const item = await prisma.cartItem.create({ data });
      console.log("🔍 [CART REPOSITORY] Cart item created:", item);

      return item;
    } catch (error) {
      console.log("🔍 [CART REPOSITORY] Error in addItemToCart:", error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        console.log("🔍 [CART REPOSITORY] ERROR: Item already exists in cart");
        throw new Error("Item already exists in cart");
      }
      throw error;
    }
  }

  async updateCartItemQuantity(itemId: string, quantity: number) {
    console.log("🔍 [CART REPOSITORY] updateCartItemQuantity called");
    console.log("🔍 [CART REPOSITORY] itemId:", itemId);
    console.log("🔍 [CART REPOSITORY] quantity:", quantity);

    // Validate stock
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { variant: true },
    });
    console.log("🔍 [CART REPOSITORY] Cart item found for update:", cartItem);

    if (!cartItem) {
      console.log("🔍 [CART REPOSITORY] ERROR: Cart item not found");
      throw new Error("Cart item not found");
    }
    if (cartItem.variant.stock < quantity) {
      console.log("🔍 [CART REPOSITORY] ERROR: Insufficient stock for update");
      throw new Error(
        `Insufficient stock: only ${cartItem.variant.stock} available`
      );
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
    console.log("🔍 [CART REPOSITORY] Cart item updated:", updatedItem);

    return updatedItem;
  }

  async removeCartItem(itemId: string) {
    console.log("🔍 [CART REPOSITORY] removeCartItem called");
    console.log("🔍 [CART REPOSITORY] itemId:", itemId);

    const result = await prisma.cartItem.delete({ where: { id: itemId } });
    console.log("🔍 [CART REPOSITORY] Cart item removed:", result);

    return result;
  }

  async mergeCarts(sessionCartId: string, userCartId: string) {
    console.log("🔍 [CART REPOSITORY] mergeCarts called");
    console.log("🔍 [CART REPOSITORY] sessionCartId:", sessionCartId);
    console.log("🔍 [CART REPOSITORY] userCartId:", userCartId);

    const sessionItems = await prisma.cartItem.findMany({
      where: { cartId: sessionCartId },
      include: { variant: true },
    });
    console.log("🔍 [CART REPOSITORY] Session items found:", sessionItems);

    for (const item of sessionItems) {
      const existingItem = await prisma.cartItem.findFirst({
        where: { cartId: userCartId, variantId: item.variantId },
      });
      console.log(
        "🔍 [CART REPOSITORY] Existing item in user cart:",
        existingItem
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + item.quantity;
        console.log("🔍 [CART REPOSITORY] Merging quantities:", newQuantity);

        if (item.variant.stock < newQuantity) {
          console.log(
            "🔍 [CART REPOSITORY] ERROR: Insufficient stock after merge"
          );
          throw new Error(
            `Insufficient stock for variant ${item.variantId}: only ${item.variant.stock} available`
          );
        }
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: newQuantity },
        });
        console.log("🔍 [CART REPOSITORY] Item quantity updated in user cart");
      } else {
        console.log("🔍 [CART REPOSITORY] Adding new item to user cart");
        if (item.variant.stock < item.quantity) {
          console.log(
            "🔍 [CART REPOSITORY] ERROR: Insufficient stock for new item"
          );
          throw new Error(
            `Insufficient stock for variant ${item.variantId}: only ${item.variant.stock} available`
          );
        }
        await prisma.cartItem.create({
          data: {
            cartId: userCartId,
            variantId: item.variantId,
            quantity: item.quantity,
          },
        });
        console.log("🔍 [CART REPOSITORY] New item added to user cart");
      }
    }
    await prisma.cart.delete({ where: { id: sessionCartId } });
    console.log("🔍 [CART REPOSITORY] Session cart deleted");
  }

  async deleteCart(id: string) {
    console.log("🔍 [CART REPOSITORY] deleteCart called");
    console.log("🔍 [CART REPOSITORY] cartId:", id);

    const result = await prisma.cart.delete({ where: { id } });
    console.log("🔍 [CART REPOSITORY] Cart deleted:", result);

    return result;
  }

  async clearCart(userId: string, tx?: Prisma.TransactionClient) {
    console.log("🔍 [CART REPOSITORY] clearCart called");
    console.log("🔍 [CART REPOSITORY] userId:", userId);

    const client = tx || prisma;
    const cart = await client.cart.findFirst({
      where: { userId },
    });

    console.log("🔍 [CART REPOSITORY] Cart found to be cleared:", cart);

    if (!cart) {
      console.log("🔍 [CART REPOSITORY] No cart found to clear");
      return;
    }

    const result = await client.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
    console.log("🔍 [CART REPOSITORY] Cart items cleared:", result);

    return result;
  }
}
