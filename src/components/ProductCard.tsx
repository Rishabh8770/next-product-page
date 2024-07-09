import { useProductContext } from "@/context/ProductPageContext";
import { Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  business: string[];
  regions: string[];
};

export default function ProductCard({ id, name, business, regions }: Product) {
  const { deleteProduct } = useProductContext();
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      deleteProduct(id);
    } catch (error) {
      console.error(`Error deleting product with id ${id}`, error);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/editProduct?id=${id}`);
  };

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
            <div className="h-10">
              <p>
                <strong>Status</strong>
              </p>
            </div>

          </div>
        </Link>
        <div className="flex justify-between p-2 ">
          <Edit onClick={handleEdit} cursor="pointer"/>
          <Trash2 color="#000000" onClick={handleDelete} cursor="pointer"/>
        </div>
      </div>
    </div>
  );
}
