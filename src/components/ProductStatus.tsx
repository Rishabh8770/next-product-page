"use client";

import { memo } from "react";
import { useProductContext } from "@/context/ProductPageContext";
import { ProductProps } from "@/types/Types";
import { ProductStatusEnum } from "@/types/ProductStatusEnum";
import {
  disableApproveStep1Statuses,
  disableApproveStep2Statuses,
  disableRejectStatuses,
} from "@/types/StatusSets";

type ProductStatusProps = {
  product: ProductProps | null;
  onStatusUpdate?: (product: ProductProps) => void;
};

const ProductStatus = memo(
  ({ product, onStatusUpdate }: ProductStatusProps) => {
    const { approveProductStep, rejectProduct } = useProductContext();

    const handleApproveStepChange = async (
      productId: string,
      step: "step1" | "step2"
    ) => {
      try {
        await approveProductStep(productId, step);

        if (product && onStatusUpdate) {
          const updatedProduct = { ...product };
          if (step === "step2") {
            if (updatedProduct.status === ProductStatusEnum.ApprovalPending) {
              updatedProduct.status = ProductStatusEnum.Active;
            } else if (
              updatedProduct.status === ProductStatusEnum.DeleteApprovalPending
            ) {
              updatedProduct.status = ProductStatusEnum.Deleted;
            }
          } else if (step === "step1") {
            updatedProduct.status = ProductStatusEnum.ApprovalPending;
          }
          onStatusUpdate(updatedProduct);
        }
      } catch (error) {
        console.error("Error updating product status:", error);
      }
    };

    const handleRejectStatusChange = async (productId: string) => {
      try {
        await rejectProduct(productId);
        if (product) {
          product.status = ProductStatusEnum.Rejected;
        }
      } catch (error) {
        console.error("Error updating product status:", error);
      }
    };

    const approveClassBase =
      "mx-2 p-1 border border-blue-500 text-blue-500 rounded disabled:opacity-45 disabled:cursor-not-allowed";
    const rejectClassBase =
      "p-1 border border-red-500 rounded text-red-500 disabled:opacity-45 disabled:cursor-not-allowed";

    console.log("this  is product", product);

    return (
      <>
        {product ? (
          <div className="flex justify-center flex-col">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b-2 border-gray-200 text-center">
                    Product
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 text-center">
                    Status
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    className="py-2 px-4 border-b border-gray-200 text-center font-bold"
                    rowSpan={2}
                  >
                    <strong>{product.name}</strong>
                  </td>
                  <td
                    className="py-2 px-4 border-b border-gray-200 text-center"
                    rowSpan={2}
                  >
                    {product.status}
                  </td>
                  <td className="py-2 px-4 border-b border-l border-gray-200 text-center">
                    <div className="flex justify-center items-center">
                      <span className="mx-4">Approval-1</span>
                      <button
                        onClick={() =>
                          handleApproveStepChange(product.id, "step1")
                        }
                        className={approveClassBase}
                        disabled={disableApproveStep1Statuses.includes(
                          (product.status as ProductStatusEnum) || ""
                        )}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectStatusChange(product.id)}
                        className={rejectClassBase}
                        disabled={disableRejectStatuses.includes(
                          (product.status as ProductStatusEnum) || ""
                        )}
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
                        onClick={() =>
                          handleApproveStepChange(product.id, "step2")
                        }
                        className={approveClassBase}
                        disabled={disableApproveStep2Statuses.includes(
                          (product.status as ProductStatusEnum) || ""
                        )}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectStatusChange(product.id)}
                        className={rejectClassBase}
                        disabled={disableRejectStatuses.includes(
                          (product.status as ProductStatusEnum) || ""
                        )}
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
);

export default ProductStatus;
