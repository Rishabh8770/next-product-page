import React from "react";
import { useProductContext } from "@/context/ProductPageContext";
import { Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductProps } from "@/types/Types";
import { notifyDeleteProduct } from "@/utils/NotificationUtils";
import { debounce } from "lodash";
import SkeletonCard from "@/components/SkeletonCard";
import { ProductStatusEnum } from "@/types/ProductStatusEnum";
import { disableDeleteAndEdit, showDetailsMessage } from "@/types/StatusSets";

interface ProductCardProps extends ProductProps {
  loading?: boolean;
}

export default function ProductCard({
  id,
  name,
  business,
  regions,
  status = ProductStatusEnum.Pending,
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
    status === ProductStatusEnum.Pending
      ? "text-status-pending-text bg-status-pending-bg"
      : status === ProductStatusEnum.Active
      ? "text-status-active-text bg-status-active-bg"
      : status === ProductStatusEnum.Rejected
      ? "text-status-rejected-text bg-status-rejected-bg"
      : "text-status-default-text bg-status-default-bg"
  }`;

  const cardStatusClass = `w-[17rem] h-[22rem] overflow-y-hidden border rounded-md m-4 shadow-md ${
    status === ProductStatusEnum.Active
      ? "shadow-status-active"
      : status === ProductStatusEnum.Rejected
      ? "shadow-status-rejected"
      : status === ProductStatusEnum.Pending
      ? "shadow-status-pending"
      : "shadow-status-default"
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
              <span className="font-semibold">Business</span> :{" "}
              {business.join(", ")}
            </div>
            <div className="h-20">
              <span className="font-semibold">Regions</span> :{" "}
              {regions.join(", ")}
            </div>
            <div>
              <div className={statusClass}>
                <p>{status}</p>
              </div>

              {showDetailsMessage.includes(status as ProductStatusEnum) ? (
                <div className="pb-4">
                  <span className="text-red-500 text-center">
                    * Please go to details page for pending approvals
                  </span>
                </div>
              ) : (
                <div className="py-5 italic">
                  * This card has been{" "}
                  <span className="font-semibold italic">
                    {status === ProductStatusEnum.Active
                      ? "Activated"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Link>
        <div className="flex justify-between p-2">
          {!disableDeleteAndEdit.includes(status as ProductStatusEnum) && (
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
