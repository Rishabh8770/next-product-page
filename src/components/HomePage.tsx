"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import LoadingPage from "@/app/loading";
import { useProductContext } from "@/context/ProductPageContext";
import { SearchAndSort } from "@/components/SearchAndSort";

type Product = {
  id: string;
  name: string;
  business: string[];
  regions: string[];
};

function delay(milliSeconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliSeconds));
}

export default function HomePage() {
  const { products, deleteProduct } = useProductContext();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      await delay(2000);
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start">
      <div className="lg:border lg:border-t-0 w-1/2 lg:w-1/6 h-10 lg:h-[100rem] mt-2 md:mt-0 flex flex-col items-center">
        <div className="mt-4">
          <SearchAndSort placeholder="Search Product" onSearch={handleSearch} />
        </div>
        <button
          onClick={() => router.push("/addProduct")}
          className="border rounded bg-[rgb(8,129,52)] text-white p-2 mt-2"
        >
          Add Product
        </button>
      </div>
      <div className="flex flex-wrap justify-center lg:justify-start pl-0 md:pl-12 mt-14 lg:mt-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              business={product.business}
              regions={product.regions}
            />
          ))
        ) : (
          <div className="flex items-center h-screen">
            <p className="text-xl">
              No such Product
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
