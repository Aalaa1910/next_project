import { NextResponse } from "next/server";
import { getProduct } from "@/app/lib/products";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;

  try {
    const product = await getProduct(id);
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }
}
