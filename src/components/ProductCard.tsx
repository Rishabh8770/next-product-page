import { useProductContext } from "@/context/ProductPageContext";
import { Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductProps } from "@/types/Types";
import { notifyDeleteProduct } from "@/utils/NotificationUtils";
import { debounce } from "lodash";

export default function ProductCard({
  id,
  name,
  business,
  regions,
  status = "pending",
}: ProductProps) {
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

  const statusClass = `w-[fit-content] rounded p-1 mb-2 ${
    status === "pending" ? "text-gray-500 bg-gray-200" : ""
  }`;

  return (
    <div
      key={id}
      className="w-[17rem] h-[18rem] overflow-y-hidden shadow-md border rounded m-4"
    >
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
            <div className={statusClass}>
              <p>{status}</p>
            </div>
          </div>
        </Link>
        <div className="flex justify-between p-2">
          <Edit onClick={handleEdit} cursor="pointer" />
          <Trash2 color="#000000" onClick={handleDelete} cursor="pointer" />
        </div>
      </div>
    </div>
  );
}
