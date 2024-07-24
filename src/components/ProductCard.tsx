import React from "react";
import { useProductContext } from "@/context/ProductPageContext";
import { Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductProps } from "@/types/Types";
import { notifyDeleteProduct } from "@/utils/NotificationUtils";
import { debounce } from "lodash";
import SkeletonCard from "@/components/SkeletonCard";

interface ProductCardProps extends ProductProps {
  loading?: boolean;
}

export default function ProductCard({
  id,
  name,
  business,
  regions,
  status = "pending",
  loading = false,
}: ProductCardProps) {
  const { deleteProduct } = useProductContext();
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      debounce(() => {
        notifyDeleteProduct({ id, name }, () => deleteProduct(id));
      }, 500)();
    } catch (error) {
      console.error(`Error deleting product with id ${id}`, error);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/editProduct?id=${id}`);
  };

  if (loading) {
    return <SkeletonCard />;
  }

  const statusClass = `w-[fit-content] rounded p-1 mb-2 ${
    status === "pending"
      ? "text-gray-500 bg-gray-200"
      : status === "active"
      ? "text-green-500 bg-green-100"
      : status === "rejected"
      ? "text-red-500 bg-red-100"
      : "text-white bg-gray-700"
  }`;

  const cardStatusClass = `w-[17rem] h-[22rem] overflow-y-hidden border rounded m-4 shadow-md ${
    status === "active"
      ? "shadow-green-300"
      : status === "rejected"
      ? "shadow-red-300"
      : status === "pending"
      ? "shadow-gray-300"
      : "shadow-black"
  }`;

  return (
    <div key={id} className={cardStatusClass}>
      <div className="flex flex-col h-full p-2">
        <Link href={`/products/${id}`}>
          <div>
            <h5 className="underline font-medium">{name}</h5>
          </div>
          <div className="d-flex flex-column flex-grow">
            <div className="my-4 h-16">
              <p>
                <strong>Business :</strong> {business.join(", ")}
              </p>
            </div>
            <div className="h-20">
              <p>
                <strong>Regions :</strong> {regions.join(", ")}
              </p>
            </div>
            <div>
              <div className={statusClass}>
                <p>{status}</p>
              </div>
              {["approval_pending", "delete_pending", "pending"].includes(
                status
              ) ? (
                <span className="text-red-500 text-center">
                  * Please go to details page for pending approvals
                </span>
              ): (<div className="pt-10">{""}</div>)}
            </div>
          </div>
        </Link>
        <div className="flex justify-between p-2">
          {!["delete_pending", "delete_approval_pending", "deleted", "rejected"].includes(
            status
          ) && (
            <>
              <Edit onClick={handleEdit} cursor="pointer" />
              <Trash2 color="#000000" onClick={handleDelete} cursor="pointer" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
