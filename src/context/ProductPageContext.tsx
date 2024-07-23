"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ProductProps } from "@/types/Types";
import {
  getProducts,
  addProduct as serverAddProduct,
  deleteProduct as serverDeleteProduct,
  updateProduct as serverUpdateProduct,
  approveProductStep as serverApproveProductStep,
  rejectProduct as serverRejectProduct
} from "@/actions/productActions";

type ProductContextType = {
  products: ProductProps[];
  addProduct: (newProduct: ProductProps) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  updateProduct: (updatedProduct: ProductProps) => Promise<void>;
  approveProductStep: (
    productId: string,
    step: "step1" | "step2"
  ) => Promise<void>;
  rejectProduct: (productId: string) => Promise<void>;
};

type ProductContextProviderProps = {
  children: React.ReactNode;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("Context must be used within a ProductProvider");
  }
  return context;
};

export function ProductProvider({ children }: ProductContextProviderProps) {
  const [products, setProducts] = useState<ProductProps[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    };
    fetchProducts();
  }, []);

  const addProduct = async (newProduct: ProductProps) => {
    try {
      newProduct.status = "pending";
      const addedProduct = await serverAddProduct(newProduct);
    console.log("message 2");

      setProducts((prevProducts) => [...prevProducts, addedProduct]);
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const deletedProduct = await serverDeleteProduct(productId);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? { ...product, status: deletedProduct.status }
            : product
        )
      );
    } catch (error) {
      console.error(`Error deleting product with id ${productId}`, error);
      throw error;
    }
  };

  const updateProduct = async (updatedProduct: ProductProps) => {
    try {
      updatedProduct.status = "pending"
      const productUpdate = await serverUpdateProduct(updatedProduct);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === updatedProduct.id ? {...product, status: productUpdate?.status} : product
        )
      );
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  const approveProductStep = async (
    productId: string,
    step: "step1" | "step2"
  ) => {
    try {
      const updatedProduct = await serverApproveProductStep(productId, step);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? updatedProduct : product
        )
      );
    } catch (error) {
      console.error("Error approving product:", error);
      throw error;
    }
  };

  const rejectProduct = async (productId: string) => {
    try {
      const updatedProduct = await serverRejectProduct(productId);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? updatedProduct : product
        )
      );
    } catch (error) {
      console.error("Error rejecting product:", error);
      throw error;
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        deleteProduct,
        updateProduct,
        approveProductStep,
        rejectProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
