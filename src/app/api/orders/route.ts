import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db'; // You should have a db.ts for MongoDB connection
import Order from '@/models/Order';    // Create an Order model

export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find().sort({ createdAt: -1 }); // latest orders first
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const newOrder = await Order.create(body);
    return NextResponse.json({ success: true, order: newOrder });
  } catch (error) {
    console.error('Order creation failed:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
