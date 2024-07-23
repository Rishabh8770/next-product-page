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
    const { status } = await req.json();
    let updatedProduct;

    if (
      status === "approval_pending" ||
      status === "active" ||
      status === "delete_pending" ||
      status === "delete_approval_pending" ||
      status === "deleted"
    ) {
      updatedProduct = updateStatus(productId, status);
    } else {
      return NextResponse.json({ error: "Invalid status update" }, { status: 400 });
    }

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product status" },
      { status: 500 }
    );
  }
}
 */