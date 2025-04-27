import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db'; // You should have a db.ts for MongoDB connection
import Order from '@/models/Order';    // Create an Order model

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
