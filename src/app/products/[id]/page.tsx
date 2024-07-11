import ProductStatus from "@/components/ProductStatus";
import productData from "@/data/products.json";
import { ProductProps } from "@/types/Types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProductDetails({ params }: { params: { id: string } }) {
  const product: ProductProps | undefined = productData.find(
    (product) => product.id === params.id
  );
  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <>
      <div className="m-10">
        <Link href="/">
          <ArrowLeft
            width={50}
            height={30}
            className="cursor-pointer border rounded"
          />
        </Link>
      </div>
      <div className="flex justify-center h-[22rem]">
        <div
          key={product.id}
          className="flex flex-col border m-4 w-3/4 lg:w-1/4 justify-evenly items-center rounded-md p-2"
        >
          <strong className="underline">Name:</strong>
          <p>{product.name}</p>

          <strong className="underline">Business:</strong>
          <p>{product.business.join(", ")}</p>

          <strong className="underline">Regions:</strong>
          <p>{product.regions.join(", ")}</p>
        </div>
      </div>
      <div className="px-2 lg:px-10 mt-4">
        <ProductStatus product={product} />
      </div>
    </>
  );
}
