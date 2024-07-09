import productData from "@/data/products.json";

type Product = {
  id: string;
  name: string;
  business: string[];
  regions: string[];
};

export default function ProductDetails({ params }: { params: { id: string } }) {
  const product: Product | undefined = productData.find(
    (product) => product.id === params.id
  );
  if (!product) {
    return <div>Product not found</div>;
  }

  return (
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
  );
}
