import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import Order from '@/models/Order';

// Dynamic route handler for PUT
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; // params is now a Promise in Next.js 15
  const body = await req.json();

  if (!id) {
    return NextResponse.json({ message: 'Order ID is required' }, { status: 400 });
  }

  const { status } = body;

  if (!['Pending', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
    return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
  }

  try {
    await connectDB();

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}