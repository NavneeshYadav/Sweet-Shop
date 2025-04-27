import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/db'; // Custom MongoDB connection
import Order from '@/models/Order'; // Order model

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = await params; // Extract the order ID from the URL params
    const body = await req.json(); // Get the request body

    if (!id) {
        return NextResponse.json({ message: 'Order ID is required' }, { status: 400 });
    }

    const { status } = body;

    // Check if the status is valid
    if (!['Pending', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
        return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }

    try {
        // Connect to MongoDB
        await connectDB();

        // Update the order status in the database using the Order model
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true } // Return the updated document
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
