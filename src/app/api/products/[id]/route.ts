import { NextResponse } from 'next/server';

export async function GET() {
  const product = {
    id: 1,
    name: 'Chocolate Cake',
    pricePerKg: 500, // ₹ per Kg
    image: 'https://source.unsplash.com/300x200/?cake',
  };

  return NextResponse.json({ success: true, data: product });
}
