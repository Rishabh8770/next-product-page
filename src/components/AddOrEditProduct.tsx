"use client";

import { useProductContext } from "@/context/ProductPageContext";
import { MultiSelectDropdown, Option } from "./MultiSelectDropdown";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import {
  notifyAddProduct,
  notifyEditProduct,
  notifyErrorAddingProduct,
  notifyErrorEditingProduct,
} from "@/utils/NotificationUtils";
import { NotificationContainer } from "./UserFeedback";
import ProductStatus from "./ProductStatus";
import { ProductProps } from "@/types/Types";
import { ArrowLeft } from "lucide-react";

type AddOrEditProductProps = {
  isEditMode: boolean;
  productId?: string | null;
};

export default function AddOrEditProduct({
  isEditMode,
  productId,
}: AddOrEditProductProps) {
  const { products, addProduct, updateProduct } = useProductContext();
  const [productName, setProductName] = useState("");
  const [selectBusinessOptions, setSelectBusinessOptions] = useState<
    Option[] | null
  >(null);
  const [selectRegionsOptions, setSelectRegionsOptions] = useState<
    Option[] | null
  >(null);
  const [businessOptions, setBusinessOptions] = useState<string[]>([]);
  const [regionsOptions, setRegionsOptions] = useState<string[]>([]);
  const [productToEdit, setProductToEdit] = useState<ProductProps | null>(null);
  const [addedProduct, setAddedProduct] = useState<ProductProps | null>(null);
  const router = useRouter();

  const getUniqueValues = (array: string[]): string[] => {
    return Array.from(new Set(array));
  };

  const clearFormFields = () => {
    setProductName("");
    setSelectBusinessOptions(null);
    setSelectRegionsOptions(null);
  };

  useEffect(() => {
    if (products) {
      const allBusinessOptions = products.flatMap(
        (product) => product.business
      );
      const allRegionsOptions = products.flatMap((product) => product.regions);

      setBusinessOptions(getUniqueValues(allBusinessOptions));
      setRegionsOptions(getUniqueValues(allRegionsOptions));
    }

    if (isEditMode && productId) {
      const productToEdit = products.find(
        (product) => product.id === productId
      );
      if (productToEdit) {
        setProductToEdit(productToEdit);
        setProductName(productToEdit.name);
        setSelectBusinessOptions(
          productToEdit.business.map((biz) => ({ value: biz, label: biz }))
        );
        setSelectRegionsOptions(
          productToEdit.regions.map((region) => ({
            value: region,
            label: region,
          }))
        );
      }
    }
  }, [products, isEditMode, productId]);

  const handleSelectBusinessFilterChange = (
    selectedOptions: Option[] | null
  ) => {
    setSelectBusinessOptions(selectedOptions);
  };

  const handleSelectRegionsFilterChange = (
    selectedOptions: Option[] | null
  ) => {
    setSelectRegionsOptions(selectedOptions);
  };

  const handleArrowClick = () => {
    router.push("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (productName && selectBusinessOptions && selectRegionsOptions) {
      const productData = {
        id: isEditMode && productId ? productId : uuidv4(),
        name: productName,
        business: selectBusinessOptions.map((option) => option.value),
        regions: selectRegionsOptions.map((option) => option.value),
      };

      try {
        if (isEditMode) {
          await updateProduct(productData);
          notifyEditProduct();
        } else {
          await addProduct(productData);
          const addedProduct = {
            ...productData
          };
          setAddedProduct(addedProduct);
          clearFormFields();
          notifyAddProduct();
        }
      } catch (error) {
        if (isEditMode) {
          notifyErrorEditingProduct();
        } else {
          notifyErrorAddingProduct();
        }
        console.error("Error submitting form", error);
      }
    } else {
      alert("Please fill all fields");
    }
  };

  return (
    <>
      <div className="m-10">
        <ArrowLeft
          width={50}
          height={30}
          onClick={handleArrowClick}
          className="cursor-pointer border rounded"
        />
      </div>
      <div className="m-10 underline flex justify-center lg:justify-start">
        <p className="text-2xl">
          {isEditMode ? "Edit Product" : "Add New Product"}
        </p>
      </div>

      <div className="flex flex-col items-center justify-center border m-10 p-10">
        <form
          className="w-full flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          {!isEditMode && (
            <div className="rounded w-5/6 lg:w-1/2 mb-4 text-center lg:text-start">
              <span>Product Name</span>
              <input
                type="text"
                placeholder="Enter product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          )}

          <div className="rounded w-5/6 lg:w-1/2 mb-4 text-center lg:text-start">
            <span className="mb-2">Business</span>
            <MultiSelectDropdown
              options={businessOptions}
              placeholder="Select Business"
              onChange={handleSelectBusinessFilterChange}
              value={selectBusinessOptions}
            />
          </div>
          <div className="rounded w-5/6 lg:w-1/2 mb-4 text-center lg:text-start">
            <span className="mb-2">Regions</span>
            <MultiSelectDropdown
              options={regionsOptions}
              placeholder="Select Regions"
              onChange={handleSelectRegionsFilterChange}
              value={selectRegionsOptions}
            />
          </div>
          <div className="w-1/2">
            <button
              type="submit"
              className="p-2 bg-blue-700 text-white rounded disabled:opacity-65"
              disabled={
                !productName || !selectBusinessOptions || !selectRegionsOptions
              }
            >
              {isEditMode ? "Update" : "Add Product"}
            </button>
            <button
              className="p-2 m-3 bg-slate-100 text-black rounded"
              onClick={() => router.push("/")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div className="px-2 lg:px-10">
        <ProductStatus product={productToEdit ? productToEdit : addedProduct} />
      </div>

      <NotificationContainer />
    </>
  );
}
