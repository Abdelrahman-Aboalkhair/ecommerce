import AppError from "@/shared/errors/AppError";
import { CartRepository } from "./cart.repository";
import prisma from "@/infra/database/database.config";
import { CART_EVENT } from "@prisma/client";

export class CartService {
  constructor(private cartRepository: CartRepository) {}

  async getOrCreateCart(userId?: string, sessionId?: string) {
    console.log("🔍 [CART SERVICE] getOrCreateCart called");
    console.log("🔍 [CART SERVICE] userId:", userId);
    console.log("🔍 [CART SERVICE] sessionId:", sessionId);

    let cart;

    if (userId) {
      console.log("🔍 [CART SERVICE] Looking for cart by userId:", userId);
      cart = await this.cartRepository.getCartByUserId(userId);
      console.log("🔍 [CART SERVICE] Cart found by userId:", cart);

      if (!cart) {
        console.log(
          "🔍 [CART SERVICE] No cart found by userId, creating new cart"
        );
        cart = await this.cartRepository.createCart({ userId });
        console.log("🔍 [CART SERVICE] New cart created for userId:", cart);
      }
    } else if (sessionId) {
      console.log(
        "🔍 [CART SERVICE] Looking for cart by sessionId:",
        sessionId
      );
      cart = await this.cartRepository.getCartBySessionId(sessionId);
      console.log("🔍 [CART SERVICE] Cart found by sessionId:", cart);

      if (!cart) {
        console.log(
          "🔍 [CART SERVICE] No cart found by sessionId, creating new cart"
        );
        cart = await this.cartRepository.createCart({ sessionId });
        console.log("🔍 [CART SERVICE] New cart created for sessionId:", cart);
      }
    } else {
      console.log(
        "🔍 [CART SERVICE] ERROR: Neither userId nor sessionId provided"
      );
      throw new AppError(400, "User ID or Session ID is required");
    }

    console.log("🔍 [CART SERVICE] Final cart to return:", cart);
    console.log("🔍 [CART SERVICE] Cart ID:", cart?.id);
    console.log("🔍 [CART SERVICE] Cart items count:", cart?.cartItems?.length);
    console.log("🔍 [CART SERVICE] Cart items:", cart?.cartItems);

    return cart;
  }

  async logCartEvent(
    cartId: string,
    eventType: CART_EVENT,
    userId?: string
  ): Promise<void> {
    console.log("🔍 [CART SERVICE] logCartEvent called");
    console.log("🔍 [CART SERVICE] cartId:", cartId);
    console.log("🔍 [CART SERVICE] eventType:", eventType);
    console.log("🔍 [CART SERVICE] userId:", userId);

    await prisma.cartEvent.create({
      data: {
        userId,
        cartId,
        eventType,
      },
    });
    console.log("🔍 [CART SERVICE] Cart event logged successfully");
  }

  async getAbandonedCartMetrics(
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalAbandonedCarts: number;
    abandonmentRate: number;
    potentialRevenueLost: number;
  }> {
    const cartEvents = await prisma.cartEvent.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        cart: {
          include: { cartItems: { include: { variant: true } } },
        },
        user: true,
      },
    });

    const cartEventsByCartId = cartEvents.reduce((acc: any, event) => {
      if (!acc[event.cartId]) acc[event.cartId] = [];
      acc[event.cartId].push(event);
      return acc;
    }, {});

    let totalCarts = 0;
    let totalAbandonedCarts = 0;
    let potentialRevenueLost = 0;

    for (const cartId in cartEventsByCartId) {
      const events = cartEventsByCartId[cartId];
      const hasAddToCart = events.some((e: any) => e.eventType === "ADD");
      const hasCheckoutCompleted = events.some(
        (e: any) => e.eventType === "CHECKOUT_COMPLETED"
      );

      const cart = events[0].cart;
      if (!cart || !cart.cartItems || cart.cartItems.length === 0) continue;

      totalCarts++;

      if (hasAddToCart && !hasCheckoutCompleted) {
        const addToCartEvent = events.find((e: any) => e.eventType === "ADD");
        const oneHourLater = new Date(
          addToCartEvent.timestamp.getTime() + 60 * 60 * 1000
        );
        const now = new Date();

        if (now > oneHourLater) {
          totalAbandonedCarts++;
          potentialRevenueLost += cart.cartItems.reduce(
            (sum: number, item: any) =>
              sum + item.quantity * item.variant.price,
            0
          );
        }
      }
    }

    const abandonmentRate =
      totalCarts > 0 ? (totalAbandonedCarts / totalCarts) * 100 : 0;

    return {
      totalAbandonedCarts,
      abandonmentRate,
      potentialRevenueLost,
    };
  }

  async getCartCount(userId?: string, sessionId?: string) {
    console.log("🔍 [CART SERVICE] getCartCount called");
    console.log("🔍 [CART SERVICE] userId:", userId);
    console.log("🔍 [CART SERVICE] sessionId:", sessionId);

    const cart = await this.getOrCreateCart(userId, sessionId);
    const count = cart.cartItems.length;

    console.log("🔍 [CART SERVICE] Cart count calculated:", count);
    console.log("🔍 [CART SERVICE] Cart items:", cart.cartItems);

    return count;
  }

  async addToCart(
    variantId: string,
    quantity: number,
    userId?: string,
    sessionId?: string
  ) {
    console.log("🔍 [CART SERVICE] addToCart called");
    console.log("🔍 [CART SERVICE] variantId:", variantId);
    console.log("🔍 [CART SERVICE] quantity:", quantity);
    console.log("🔍 [CART SERVICE] userId:", userId);
    console.log("🔍 [CART SERVICE] sessionId:", sessionId);

    if (quantity <= 0) {
      console.log("🔍 [CART SERVICE] ERROR: Quantity must be greater than 0");
      throw new AppError(400, "Quantity must be greater than 0");
    }

    const cart = await this.getOrCreateCart(userId, sessionId);
    console.log("🔍 [CART SERVICE] Cart retrieved for adding item:", cart);
    console.log("🔍 [CART SERVICE] Cart ID:", cart.id);

    const existingItem = await this.cartRepository.findCartItem(
      cart.id,
      variantId
    );
    console.log("🔍 [CART SERVICE] Existing item found:", existingItem);

    if (existingItem) {
      console.log("🔍 [CART SERVICE] Updating existing item quantity");
      const newQuantity = existingItem.quantity + quantity;
      console.log("🔍 [CART SERVICE] New quantity:", newQuantity);

      const updatedItem = await this.cartRepository.updateCartItemQuantity(
        existingItem.id,
        newQuantity
      );
      console.log("🔍 [CART SERVICE] Item updated:", updatedItem);

      await this.logCartEvent(cart.id, "ADD", userId);
      console.log("🔍 [CART SERVICE] Cart event logged for update");

      return updatedItem;
    }

    console.log("🔍 [CART SERVICE] Creating new cart item");
    const item = await this.cartRepository.addItemToCart({
      cartId: cart.id,
      variantId,
      quantity,
    });
    console.log("🔍 [CART SERVICE] New item created:", item);

    await this.logCartEvent(cart.id, "ADD", userId);
    console.log("🔍 [CART SERVICE] Cart event logged for new item");

    return item;
  }

  async updateCartItemQuantity(itemId: string, quantity: number) {
    console.log("🔍 [CART SERVICE] updateCartItemQuantity called");
    console.log("🔍 [CART SERVICE] itemId:", itemId);
    console.log("🔍 [CART SERVICE] quantity:", quantity);

    if (quantity <= 0) {
      console.log("🔍 [CART SERVICE] ERROR: Quantity must be greater than 0");
      throw new AppError(400, "Quantity must be greater than 0");
    }

    const result = this.cartRepository.updateCartItemQuantity(itemId, quantity);
    console.log("🔍 [CART SERVICE] Update result:", result);

    return result;
  }

  async removeFromCart(itemId: string) {
    console.log("🔍 [CART SERVICE] removeFromCart called");
    console.log("🔍 [CART SERVICE] itemId:", itemId);

    const result = this.cartRepository.removeCartItem(itemId);
    console.log("🔍 [CART SERVICE] Remove result:", result);

    return result;
  }

  async mergeCartsOnLogin(sessionId: string, userId: string | undefined) {
    console.log("🔍 [CART SERVICE] mergeCartsOnLogin called");
    console.log("🔍 [CART SERVICE] sessionId:", sessionId);
    console.log("🔍 [CART SERVICE] userId:", userId);

    const sessionCart = await this.cartRepository.getCartBySessionId(sessionId);
    console.log("🔍 [CART SERVICE] Session cart found:", sessionCart);

    if (!sessionCart) {
      console.log("🔍 [CART SERVICE] No session cart found, nothing to merge");
      return;
    }

    const userCart = await this.getOrCreateCart(userId);
    console.log("🔍 [CART SERVICE] User cart retrieved:", userCart);

    await this.cartRepository.mergeCarts(sessionCart.id, userCart.id);
    console.log("🔍 [CART SERVICE] Carts merged successfully");
  }
}
