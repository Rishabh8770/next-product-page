"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { ProductProps } from "@/types/Types";

type ProductContextType = {
  products: ProductProps[];
  addProduct: (newProduct: ProductProps) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  updateProduct: (updatedProduct: ProductProps) => Promise<void>;
  fetchProducts: () => Promise<void>;
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
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const addProduct = async (newProduct: ProductProps) => {
    try {
      const response = await axios.post("/api/products", {
        ...newProduct,
        status: "pending",
      });
      setProducts((prevProducts) => [...prevProducts, response.data]);
    } catch (error) {
      console.error("Error adding product", error);
      throw error;
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await axios.delete(`/api/products/${productId}`);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? { ...product, status: "delete_pending" }
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
      const response = await axios.put(
        `/api/products/${updatedProduct.id}`,
        updatedProduct
      );
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === updatedProduct.id ? response.data : product
        )
      );
    } catch (error) {
      console.error("Error updating product", error);
      throw error;
    }
  };

  const approveProductStep = async (
    productId: string,
    step: "step1" | "step2"
  ) => {
    try {
      const product = products.find((product) => product.id === productId);
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
  
      await axios.put(`/api/products/${productId}/approve`, {
        status: newStatus,
      });
  
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? { ...product, status: newStatus } : product
        )
      );
    } catch (error) {
      console.error("Error approving product", error);
      throw error;
    }
  };
  
  const rejectProduct = async (productId: string) => {
    try {
      await axios.put(`/api/products/${productId}/reject`);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? { ...product, status: "rejected" } : product
        )
      );
    } catch (error) {
      console.error("Error rejecting product", error);
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
        fetchProducts,
        approveProductStep,
        rejectProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
