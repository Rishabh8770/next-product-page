/* import { NextResponse } from "next/server";
import { readData, writeData, readDeletedData, writeDeletedData, updateStatus } from "@/utils/apiUtils";

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

    const deletedProduct = { ...data[productIndex], status: "delete_pending" };
    data.splice(productIndex, 1);
    writeData(data);

    const deletedData = readDeletedData();
    deletedData.push(deletedProduct);
    writeDeletedData(deletedData);

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
  const productId = url.pathname.split("/").pop();

  if (!productId) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    const data = await req.json();
    data.status = "pending";
    const allProducts = readData();
    const productIndex = allProducts.findIndex(
      (product) => product.id === productId
    );

    if (productIndex === -1) {
      const deletedProducts = readDeletedData();
      const deletedProductIndex = deletedProducts.findIndex(
        (product) => product.id === productId
      );
      if (deletedProductIndex !== -1) {
        deletedProducts[deletedProductIndex] = { ...deletedProducts[deletedProductIndex], ...data };
        writeDeletedData(deletedProducts);
        return NextResponse.json(deletedProducts[deletedProductIndex], { status: 200 });
      }
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    allProducts[productIndex] = { ...allProducts[productIndex], ...data };
    writeData(allProducts);

    return NextResponse.json(allProducts[productIndex], { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}
 */