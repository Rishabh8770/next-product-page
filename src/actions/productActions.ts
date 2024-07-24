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
import { ProductStatusEnum } from "@/types/ProductStatusEnum";

export async function formAction(
  formData: FormData,
  isEditMode: boolean,
  productId: string | null
) {
  const newProductName = formData.get("productName") as string;
  const selectBusiness = formData.getAll("business") as string[];
  const selectRegions = formData.getAll("regions") as string[];

  if ((isEditMode && productId) || (newProductName && selectBusiness.length > 0 && selectRegions.length > 0)) {
    const products = readData();
    let productData: ProductProps;

    if (isEditMode && productId) {
      const productToEdit = products.find((product) => product.id === productId);

      if (!productToEdit) {
        throw new Error("Product not found for editing");
      }

      productData = {
        id: productId,
        name: productToEdit.name,
        business: selectBusiness,
        regions: selectRegions,
        status: ProductStatusEnum.Pending,
      };

      const productIndex = products.findIndex((product) => product.id === productId);
      products[productIndex] = productData;
    } else {
      productData = {
        id: uuidv4(),
        name: newProductName,
        business: selectBusiness,
        regions: selectRegions,
        status: ProductStatusEnum.Pending,
      };

      if (!products.find((product) => product.id === productData.id)) {
      products.push(productData);
      }
      return productData;
    }
    return productData;
  } else {
    throw new Error("Please fill all fields");
  }
}

export const getProducts = async (): Promise<ProductProps[]> => {
  const data = readData();
  const deletedData = readDeletedData();
  return [...data, ...deletedData];
};

export async function addProduct(newProduct: ProductProps) {
  newProduct.status = ProductStatusEnum.Pending;
  const products = readData();
  products.push(newProduct);
  console.log("message 1");

  writeData(products);
  return newProduct;
}

export const updateProduct = (updatedProduct: ProductProps): ProductProps => {
  const products = readData();
  const index = products.findIndex((product) => product.id === updatedProduct.id);
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
    status: ProductStatusEnum.DeletePending,
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
    if (product.status === ProductStatusEnum.Pending) {
      newStatus = ProductStatusEnum.ApprovalPending;
    } else if (product.status === ProductStatusEnum.DeletePending) {
      newStatus = ProductStatusEnum.DeleteApprovalPending;
    }
  } else if (step === "step2") {
    if (product.status === ProductStatusEnum.ApprovalPending) {
      newStatus = ProductStatusEnum.Active;
    } else if (product.status === ProductStatusEnum.DeleteApprovalPending) {
      newStatus = ProductStatusEnum.Deleted;
    }
  }

  const updatedProduct = updateStatus(productId, newStatus);

  return updatedProduct;
}

export async function rejectProduct(productId: string): Promise<ProductProps> {
  const updatedProduct = updateStatus(productId, ProductStatusEnum.Rejected);
  return updatedProduct;
}
