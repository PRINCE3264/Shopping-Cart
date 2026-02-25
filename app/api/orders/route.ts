import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/requestHelpers";

/**
 * POST /api/orders
 * Create an order from the current cart
 */
export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    const body = (await req.json().catch(() => ({}))) as { sessionId?: string };
    const sessionId = body.sessionId;

    if (!user && !sessionId) {
      return NextResponse.json({ error: "Unauthorized or missing session" }, { status: 401 });
    }

    // Find cart
    const cart = await prisma.cart.findFirst({
      where: user ? { userId: user._id } : { sessionId },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Calculate total and prepare items
    let total = 0;
    const orderItemsData = cart.items.map(item => {
      const itemTotal = item.qty * item.priceSnapshot;
      total += itemTotal;
      return {
        productId: item.productId,
        name: item.product.name,
        qty: item.qty,
        price: item.priceSnapshot,
      };
    });

    // Create order and clear cart in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create Order
      const newOrder = await tx.order.create({
        data: {
          userId: user ? user._id : null,
          total: total,
          status: "pending",
          items: {
            create: orderItemsData
          }
        },
        include: { items: true }
      });

      // Update stock
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.qty } }
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return newOrder;
    });

    return NextResponse.json({ ok: true, orderId: order.id, order }, { status: 200 });
  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * GET /api/orders
 * Fetch orders for the logged-in user
 */
export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: user._id },
      include: { items: true },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (err) {
    console.error("GET /api/orders error:", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
