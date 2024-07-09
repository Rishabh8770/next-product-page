import { NextResponse } from "next/server";
import { readData, writeData } from "../../apiUtils";

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const productId = url.pathname.split("/").pop();

  if (!productId) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    const data = readData();
    const productIndex = data.findIndex((product) => product.id === productId);

    if (productIndex === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    data.splice(productIndex, 1);
    writeData(data);

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
    const url = new URL(req.url);
    const productId = url.pathname.split('/').pop();

    if (!productId) {
        return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    try {
        const data = await req.json();
        const allProducts = readData();
        const productIndex = allProducts.findIndex((product) => product.id === productId);

        if (productIndex === -1) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        allProducts[productIndex] = { ...allProducts[productIndex], ...data };
        writeData(allProducts);

        return NextResponse.json({ message: 'Product updated successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}
