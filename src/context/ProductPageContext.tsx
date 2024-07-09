"use client"

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

type Product = {
  id: string;
  name: string;
  business: string[];
  regions: string[];
};

type ProductContextType = {
  products: Product[];
  addProduct: (newProduct: Product) => void;
  deleteProduct:(productId: string) => void;
  updateProduct: (updatedProduct: Product) => void;
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
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(()=> {
    fetchProducts();
  }, [])

  const fetchProducts = async () => {
    const response = await fetch("/api/products");
    const data = await response.json();
    console.log(data)
    setProducts(data);
  };

  const addProduct = async(newProduct: Product) => {
    try {
      const response = await axios.post("/api/products", newProduct);
      setProducts((prevProducts) => [...prevProducts, response.data]);
    } catch (error) {
      console.error("Error adding product", error);
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
    } catch (error) {
      console.error(`Error deleting product with id ${id}`, error);
      // Handle error display or logging here
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    try{
      const response = await axios.put(`api/products/${updatedProduct.id}`, updatedProduct);
      setProducts((prevProducts)=> prevProducts.map((product) => product.id === updatedProduct.id? response.data : product))
    }catch(error) {
      console.error("Error updating product", error)
    }
  }
  

  const contextValue: ProductContextType = {
    products,
    addProduct,
    deleteProduct,
    updateProduct
  }

  return (
    <ProductContext.Provider value={contextValue}>
        {children}
    </ProductContext.Provider>
  )
}
