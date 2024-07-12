"use client"

import { useProductContext } from "@/context/ProductPageContext";
import { ProductProps } from "@/types/Types";

type ProductStatusProps = {
  product: ProductProps | null;
};

export default function ProductStatus({ product }: ProductStatusProps) {
  const { approveProductStep, rejectProduct } = useProductContext();

  const handleApproveStepChange = async (productId: string, step: "step1" | "step2") => {
    try {
      await approveProductStep(productId, step);
      if (step === "step2" && product) {
        product.status = "active";
      }
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };

  const handleRejectStatusChange = async (productId: string, status: "rejected") => {
    try {
      await rejectProduct(productId, status);
      if (product) {
        product.status = "rejected";
      }
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };

  return (
    <>
      {product ? (
        <div className="flex justify-center flex-col">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b-2 border-gray-200 text-center">Product</th>
                <th className="py-2 px-4 border-b-2 border-gray-200 text-center">Status</th>
                <th className="py-2 px-4 border-b-2 border-gray-200 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b border-gray-200 text-center font-bold" rowSpan={2}>
                  <strong>{product.name}</strong>
                </td>
                <td className="py-2 px-4 border-b border-gray-200 text-center" rowSpan={2}>
                  {product.status}
                </td>
                <td className="py-2 px-4 border-b border-l border-gray-200 text-center">
                  <div className="flex justify-center items-center">
                    <span className="mx-4">Approval-1</span>
                    <button
                      onClick={() => handleApproveStepChange(product.id, "step1")}
                      className="mx-2 p-1 border border-blue-500 text-blue-500 rounded disabled:opacity-65"
                      disabled={["active", "rejected", "deleted", "approval_pending", "delete_approval_pending"].includes(product.status || "")}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectStatusChange(product.id, "rejected")}
                      className="p-1 border border-red-500 rounded text-red-500 disabled:opacity-65"
                      disabled={["active", "rejected", "deleted"].includes(product.status || "")}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b border-l border-gray-200 text-center">
                  <div className="flex justify-center items-center">
                    <span className="mx-4">Approval-2</span>
                    <button
                      onClick={() => handleApproveStepChange(product.id, "step2")}
                      className="mx-2 p-1 border border-blue-500 text-blue-500 rounded disabled:opacity-65"
                      disabled={["active", "rejected", "deleted", "pending", "delete_pending"].includes(product.status || "")}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectStatusChange(product.id, "rejected")}
                      className="p-1 border border-red-500 rounded text-red-500 disabled:opacity-65"
                      disabled={["active", "rejected", "deleted"].includes(product.status || "")}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div>{""}</div>
      )}
    </>
  );
}
