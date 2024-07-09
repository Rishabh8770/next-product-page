"use client"

import AddOrEditProduct from "@/components/AddOrEditProduct";
import { useSearchParams } from "next/navigation";

export default function EditProductPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  return <AddOrEditProduct isEditMode={true} productId={productId} />;
}
