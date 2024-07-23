"use server";

import {
  readData,
  readDeletedData,
  updateStatus,
  writeData,
  writeDeletedData,
} from "@/utils/actionUtils";
import { v4 as uuidv4 } from "uuid";
import { ProductProps } from "@/types/Types";

type Product = ProductProps;

export async function formAction(
  formData: FormData,
  isEditMode: boolean,
  productId: string | null
) {
  const newProductName = formData.get("productName") as string;
  const selectBusiness = formData.getAll("business") as string[];
  const selectRegions = formData.getAll("regions") as string[];

  if (
    (isEditMode && productId) ||
    (newProductName && selectBusiness.length > 0 && selectRegions.length > 0)
  ) {
    const products = readData();
    let productData: Product;

    if (isEditMode && productId) {
      const productToEdit = products.find(
        (product) => product.id === productId
      );
      if (!productToEdit) {
        throw new Error("Product not found for editing");
      }

      productData = {
        id: productId,
        name: productToEdit.name,
        business: selectBusiness,
        regions: selectRegions,
        status: "pending",
      };

      const productIndex = products.findIndex(
        (product) => product.id === productId
      );
      products[productIndex] = productData;
    } else {
      productData = {
        id: uuidv4(),
        name: newProductName,
        business: selectBusiness,
        regions: selectRegions,
        status: "pending",
      };

      // if (!products.find((product) => product.id === productData.id)) {
        products.push(productData);
      // }
      return productData;
    }
    return productData;
  } else {
    throw new Error("Please fill all fields");
  }
}

export const getProducts = async (): Promise<Product[]> => {
  const data = readData();
  const deletedData = readDeletedData();
  return [...data, ...deletedData];
};

export async function addProduct(
  newProduct: ProductProps
): Promise<ProductProps> {
  newProduct.status = "pending";
  const products = readData();
  products.push(newProduct);
  console.log("message 1");

  writeData(products);
  return newProduct;
}

export const updateProduct = (updatedProduct: Product): Product => {
  const products = readData();
  const index = products.findIndex(
    (product) => product.id === updatedProduct.id
  );
  if (index !== -1) {
    products[index] = updatedProduct;
    writeData(products);
  }
  return updatedProduct;
};

export async function deleteProduct(id: string): Promise<ProductProps> {
  const products = readData();
  const deletedProducts = readDeletedData();
  const productIndex = products.findIndex((product) => product.id === id);

  if (productIndex === -1) {
    throw new Error("Product not found");
  }

  const deletedProduct = {
    ...products[productIndex],
    status: "delete_pending",
  };
  products.splice(productIndex, 1);
  writeData(products);

  deletedProducts.push(deletedProduct);
  writeDeletedData(deletedProducts);

  return deletedProduct;
}

export async function approveProductStep(
  productId: string,
  step: "step1" | "step2"
): Promise<ProductProps> {
  const products = readData();
  const deletedProducts = readDeletedData();
  const product =
    products.find((p) => p.id === productId) ||
    deletedProducts.find((p) => p.id === productId);

  if (!product) throw new Error("Product not found");
  let newStatus = product.status;
  if (step === "step1") {
    if (product.status === "pending") {
      newStatus = "approval_pending";
    } else if (product.status === "delete_pending") {
      newStatus = "delete_approval_pending";
    }
  } else if (step === "step2") {
    if (product.status === "approval_pending") {
      newStatus = "active";
    } else if (product.status === "delete_approval_pending") {
      newStatus = "deleted";
    }
  }

  const updatedProduct = updateStatus(productId, newStatus);

  return updatedProduct;
}

// Reject a product
export async function rejectProduct(productId: string): Promise<ProductProps> {
  const updatedProduct = updateStatus(productId, "rejected");
  return updatedProduct;
}
