import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Sync logic:
 * 1. Find cart for user or session
 * 2. If item exists, update it
 * 3. Else, create new item
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, sessionId, productId, qty } = body;

        if (!productId || qty === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (!userId && !sessionId) {
            return NextResponse.json({ error: "User ID or Session ID is required" }, { status: 400 });
        }

        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // Find or create cart
        let cart = await prisma.cart.findFirst({
            where: userId ? { userId } : { sessionId },
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: userId ? { userId } : { sessionId: sessionId },
            });
        }

        // Check if item exists in cart
        const existingItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId: productId,
            },
        });

        if (existingItem) {
            // Update quantity (absolute value if it's a sync, relative if it's an add)
            // For simplicity, let's treat POST as "Add/Update"
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { qty: qty },
            });
        } else {
            // Create new cart item
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: productId,
                    qty: qty,
                    priceSnapshot: product.price,
                },
            });
        }

        const updatedCart = await prisma.cart.findUnique({
            where: { id: cart.id },
            include: {
                items: {
                    include: { product: true },
                },
            },
        });

        return NextResponse.json(updatedCart, { status: 200 });
    } catch (err) {
        console.error("Cart POST error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * Fetch cart for user or session
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const sessionId = searchParams.get("sessionId");

        if (!userId && !sessionId) {
            return NextResponse.json({ error: "Missing user identification" }, { status: 400 });
        }

        const cart = await prisma.cart.findFirst({
            where: userId ? { userId } : { sessionId: sessionId || undefined },
            include: {
                items: {
                    include: { product: true },
                },
            },
        });

        return NextResponse.json(cart || { items: [] }, { status: 200 });
    } catch (err) {
        console.error("GET Cart error:", err);
        return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
    }
}

/**
 * Delete a specific item or clear cart
 */
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const sessionId = searchParams.get("sessionId");
        const productId = searchParams.get("productId");

        if (!userId && !sessionId) {
            return NextResponse.json({ error: "Missing user identification" }, { status: 400 });
        }

        const cart = await prisma.cart.findFirst({
            where: userId ? { userId } : { sessionId: sessionId || undefined },
        });

        if (!cart) return NextResponse.json({ ok: true });

        if (productId) {
            // Remove specific item
            await prisma.cartItem.deleteMany({
                where: {
                    cartId: cart.id,
                    productId: productId,
                },
            });
        } else {
            // Clear entire cart
            await prisma.cartItem.deleteMany({
                where: { cartId: cart.id },
            });
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("Cart DELETE error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
