"use client";

import { useProductContext } from "@/context/ProductPageContext";
import { MultiSelectDropdown, Option } from "./MultiSelectDropdown";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import {
  notifyAddProduct,
  notifyEditProduct,
  notifyErrorAddingProduct,
  notifyErrorEditingProduct,
  notifyMandatoryWarn,
} from "@/utils/NotificationUtils";
import { NotificationContainer } from "./UserFeedback";
import ProductStatus from "./ProductStatus";
import { ProductProps } from "@/types/Types";
import { ArrowLeft } from "lucide-react";
import { debounce } from "lodash";
import { formAction } from "@/actions/productActions";
import { getUniqueValues, arraysEqual } from "@/utils/uniqueValuesUtils";

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
  const [selectBusinessOptions, setSelectBusinessOptions] = useState<Option[] | null>(null);
  const [selectRegionsOptions, setSelectRegionsOptions] = useState<Option[] | null>(null);
  const [businessOptions, setBusinessOptions] = useState<string[]>([]);
  const [regionsOptions, setRegionsOptions] = useState<string[]>([]);
  const [productToEdit, setProductToEdit] = useState<ProductProps | null>(null);
  const [addedProduct, setAddedProduct] = useState<ProductProps | null>(null);
  const [initialBusinessOptions, setInitialBusinessOptions] = useState<Option[]>([]);
  const [initialRegionsOptions, setInitialRegionsOptions] = useState<Option[]>([]);
  const router = useRouter();
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearFormFields = () => {
    setProductName("");
    setSelectBusinessOptions(null);
    setSelectRegionsOptions(null);
  };

  const initializeFormFields = (product?: ProductProps) => {
    if (product) {
      setProductName(product.name);
      const businessOptions = product.business.map((biz) => ({
        value: biz,
        label: biz,
      }));
      const regionsOptions = product.regions.map((region) => ({
        value: region,
        label: region,
      }));

      setSelectBusinessOptions(businessOptions);
      setSelectRegionsOptions(regionsOptions);
      setInitialBusinessOptions(businessOptions);
      setInitialRegionsOptions(regionsOptions);
    } else {
      clearFormFields();
    }
  };

  const resetFormFields = () => {
    if (productToEdit) {
      initializeFormFields(productToEdit);
    } else {
      clearFormFields();
    }
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

    if (isEditMode && productId && products) {
      const product = products.find((product) => product.id === productId);
      if (product) {
        setProductToEdit(product);
        initializeFormFields(product);
      }
    }
  }, [isEditMode, productId, products]);

  const handleSelectBusinessFilterChange = useCallback(
    (selectedOptions: Option[] | null) => {
      setSelectBusinessOptions(selectedOptions);
    },
    []
  );

  const handleSelectRegionsFilterChange = useCallback(
    (selectedOptions: Option[] | null) => {
      setSelectRegionsOptions(selectedOptions);
    },
    []
  );

  const handleArrowClick = useCallback(() => {
    router.push("/");
  }, [router]);

  

  const isFormChanged = (): boolean => {
    const isBusinessChanged = !arraysEqual(
      selectBusinessOptions || [],
      initialBusinessOptions
    );
    const isRegionsChanged = !arraysEqual(
      selectRegionsOptions || [],
      initialRegionsOptions
    );

    return isBusinessChanged || isRegionsChanged;
  };

  const handleProductNameChange = useCallback(
    debounce((value) => setProductName(value), 300),
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectBusinessOptions && selectRegionsOptions) {
      const productData: ProductProps = {
        id: isEditMode && productId ? productId : uuidv4(),
        name: productName,
        business: selectBusinessOptions.map((option) => option.value) ?? [],
        regions: selectRegionsOptions.map((option) => option.value) ?? [],
        status: isEditMode ? productToEdit?.status || "pending" : "pending",
      };
  
      const formData = new FormData(e.target as HTMLFormElement);
  
      try {
        await formAction(formData, isEditMode, productId ?? null);
  
        if (isEditMode) {
          await updateProduct(productData);
          setProductToEdit(productData);
          notifyEditProduct();
        } else {
          await addProduct(productData);
          setAddedProduct(productData);
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
      notifyMandatoryWarn();
    }
  };
  

  const handleStatusUpdate = useCallback(
    (updatedProduct: ProductProps) => {
      if (isEditMode) {
        setProductToEdit(updatedProduct);
      } else {
        setAddedProduct(updatedProduct);
      }
    },
    [isEditMode]
  );

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className="m-10">
        <ArrowLeft
          onClick={handleArrowClick}
          className="cursor-pointer border rounded-full size-10 p-1"
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
                defaultValue={productName}
                onChange={(e) => handleProductNameChange(e.target.value)}
                className="w-full p-2 border rounded"
                name="productName"
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
              name="business"
            />
          </div>
          <div className="rounded w-5/6 lg:w-1/2 mb-4 text-center lg:text-start">
            <span className="mb-2">Regions</span>
            <MultiSelectDropdown
              options={regionsOptions}
              placeholder="Select Regions"
              onChange={handleSelectRegionsFilterChange}
              value={selectRegionsOptions}
              name="regions"
            />
          </div>
          <div>
            <button
              type="submit"
              className={`p-2 bg-blue-700 text-white rounded disabled:opacity-65 disabled:cursor-not-allowed ${
                isEditMode && !isFormChanged()
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              disabled={ !productName ||
                !selectBusinessOptions ||
                !selectRegionsOptions ||
                (isEditMode && !isFormChanged())
              }
            >
              {isEditMode ? "Update" : "Add Product"}
            </button>
            <button
              type="button"
              className="p-2 m-3 bg-slate-100 text-black rounded"
              onClick={() => {
                resetFormFields();
                router.push("/");
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div className="px-2 lg:px-10">
        <ProductStatus
          product={productToEdit ? productToEdit : addedProduct}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>

      <NotificationContainer />
    </>
  );
}
