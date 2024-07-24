import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ProductProps } from "@/types/Types";
import { ProductStatusEnum } from "@/types/ProductStatusEnum";

const getFilePath = () => path.join(process.cwd(), "src/data", "products.json");
const getDeleteFilePath = () =>
  path.join(process.cwd(), "src/data", "deletedProductData.json");

export const readData = (): ProductProps[] => {
  const filePath = getFilePath();
  const jsonData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(jsonData);
};

export const readDeletedData = (): ProductProps[] => {
  const filePath = getDeleteFilePath();
  const jsonData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(jsonData);
};

export const writeData = (data: ProductProps[]) => {
  const filePath = getFilePath();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
};

export const writeDeletedData = (data: ProductProps[]) => {
  const filePath = getDeleteFilePath();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
};

export const handleResponse = <T>(data: T, status: number = 200) => {
  return NextResponse.json(data, { status });
};

export const handleError = (error: string, status: number = 500) => {
  return NextResponse.json({ error }, { status });
};

const updateProductsStatus = () => {
  const products = readData();

  const updatedProducts = products.map((product) => ({
    ...product,
    status: product.status || ProductStatusEnum.Pending,
  }));

  writeData(updatedProducts);
};

updateProductsStatus();

export const updateStatus = (
  id: string,
  status:
    | ProductStatusEnum.Active
    | ProductStatusEnum.Rejected
    | ProductStatusEnum.DeletePending
    | ProductStatusEnum.DeleteApprovalPending
    | ProductStatusEnum.Deleted
    | string
    | undefined
) => {
  const items = readData();
  const deletedItems = readDeletedData();
  const productIndex = items.findIndex((item) => item.id === id);
  const deletedProductIndex = deletedItems.findIndex((item) => item.id === id);

  // console.log("Updating status:", status);
  // console.log("Product Index:", productIndex);
  // console.log("Deleted Product Index:", deletedProductIndex);

  if (
    status === ProductStatusEnum.DeletePending ||
    status === ProductStatusEnum.DeleteApprovalPending
  ) {
    if (productIndex !== -1) {
      items[productIndex].status = status;
      writeData(items);
      return items[productIndex];
    } else if (deletedProductIndex !== -1) {
      deletedItems[deletedProductIndex].status = status;
      writeDeletedData(deletedItems);
      return deletedItems[deletedProductIndex];
    }
  } else if (status === ProductStatusEnum.Deleted) {
    if (deletedProductIndex !== -1) {
      deletedItems[deletedProductIndex].status = status;
      writeDeletedData(deletedItems);

      if (productIndex !== -1) {
        items.splice(productIndex, 1);
        writeData(items);
      }

      return deletedItems[deletedProductIndex];
    }
  } else {
    if (productIndex !== -1) {
      items[productIndex].status = status;
      writeData(items);
      return items[productIndex];
    } else if (deletedProductIndex !== -1) {
      deletedItems[deletedProductIndex].status = status;
      writeDeletedData(deletedItems);
      return deletedItems[deletedProductIndex];
    }
  }

  throw new Error("Product not found");
};
