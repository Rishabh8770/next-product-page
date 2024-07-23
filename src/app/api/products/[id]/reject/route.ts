/* import { NextResponse } from "next/server";
import { updateStatus } from "@/utils/apiUtils";

export async function PUT(req: Request) {
  const url = new URL(req.url);
  const productId = url.pathname.split("/").slice(-2, -1)[0];

  if (!productId) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    const updatedProduct = updateStatus(productId, "rejected");
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to reject product" },
      { status: 500 }
    );
  }
}
 */