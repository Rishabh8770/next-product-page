"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import SkeletonCard from "@/components/SkeletonCard"; // Import SkeletonCard
import { useProductContext } from "@/context/ProductPageContext";
import { SearchAndSort, SortOptions } from "@/components/SearchAndSort";
import { ProductProps } from "@/types/Types";
import { MultiSelectDropdown, Option } from "./MultiSelectDropdown";
import FilterProducts from "./FilterProducts";
import { NotificationContainer } from "./UserFeedback";

function delay(milliSeconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliSeconds));
}

export default function HomePage() {
  const { products } = useProductContext();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortedAndFilteredProducts, setSortedAndFilteredProducts] =
    useState<ProductProps[]>(products);
  const [sortOption, setSortOption] =
    useState<SortOptions>("--please select--");
  const [selectedBusinessOptions, setSelectedBusinessOptions] = useState<
    Option[] | null
  >(null);
  const [selectedRegionOptions, setSelectedRegionOptions] = useState<
    Option[] | null
  >(null);
  const [filter, setFilter] = useState<"active" | "non-active">("active");
  const [selectedStatusFilters, setSelectedStatusFilters] = useState<
    Option[] | null
  >(null);
  const [isWaiting, setIsWaiting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      await delay(2000);
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    let filtered = products.filter((product) =>
      product.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedBusinessOptions) {
      const selectedBusinessValues = selectedBusinessOptions.map(
        (option) => option.value
      );
      filtered = filtered.filter((product) =>
        selectedBusinessValues.every((selectedValue) =>
          product.business.includes(selectedValue)
        )
      );
    }

    if (selectedRegionOptions) {
      const selectedRegionValues = selectedRegionOptions.map(
        (option) => option.value
      );
      filtered = filtered.filter((product) =>
        selectedRegionValues.every((selectedValue) =>
          product.regions.includes(selectedValue)
        )
      );
    }

    if (filter === "active") {
      filtered = filtered.filter((product) => product.status === "active");
    } else if (filter === "non-active") {
      filtered = filtered.filter((product) => product.status !== "active");

      if (selectedStatusFilters && selectedStatusFilters.length > 0) {
        const selectedFilterValues = selectedStatusFilters.map(
          (option) => option.value
        );

        filtered = filtered.filter((product) =>
          selectedFilterValues.includes(product.status || "")
        );
      }
    }

    filtered = filtered.sort((a, b) => {
      if (sortOption === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortOption === "business") {
        return a.business.join("").localeCompare(b.business.join(""));
      } else if (sortOption === "regions") {
        return a.regions.join("").localeCompare(b.regions.join(""));
      }
      return 0;
    });

    setSortedAndFilteredProducts(filtered);
  }, [
    searchQuery,
    sortOption,
    products,
    selectedBusinessOptions,
    selectedRegionOptions,
    selectedStatusFilters,
    filter,
  ]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleProductSort = (sortProduct: SortOptions) => {
    setSortOption(sortProduct);
  };

  const handleBusinessFilterChange = (options: Option[] | null) => {
    setSelectedBusinessOptions(options);
  };

  const handleRegionFilterChange = (options: Option[] | null) => {
    setSelectedRegionOptions(options);
  };

  const handleStatusFilterChange = (selectedOptions: Option[] | null) => {
    setSelectedStatusFilters(selectedOptions);
  };

  const handleClick = () => {
    setIsWaiting(true); 
    setTimeout(() => {
      setIsWaiting(false); 
    }, 4000);
    router.push("/addProduct")
  };

  const toggleFilter = () => {
    setFilter((prevFilter) =>
      prevFilter === "active" ? "non-active" : "active"
    );
  };

  const filteredProductsForSkeleton = products.filter((product) =>
    filter === "active" ? product.status === "active" : product.status !== "active"
  );

  const homePageCardClassBase = `flex flex-wrap justify-center items-center w-full pl-0 mt-4 lg:mt-0 ${filter === "active" ? "lg:justify-start":"lg:justify-center"}`;

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start">
      <div className="lg:border lg:border-t-0 w-full lg:w-1/6 h-auto lg:min-h-screen mt-2 md:mt-0 flex flex-col items-center">
        <div className="mt-4 w-full px-4">
          <SearchAndSort
            placeholder="Search Product"
            onSearch={handleSearch}
            onProductSort={handleProductSort}
          />
        </div>
        <div className="border-t border-gray-300 mb-2 w-1/4 mt-4"></div>
        <button
          onClick={handleClick}
          className="border rounded bg-[rgb(8,129,52)] text-white p-2 mt-2"
          style={{ cursor: isWaiting ? "wait" : "pointer" }}
          disabled={isWaiting}
        >
          Add Product
        </button>
        <div className="border-t border-gray-300 mb-4 w-1/4 mt-4"></div>
        <div className="w-full px-4 mt-4">
          <FilterProducts
            onBusinessFilterChange={handleBusinessFilterChange}
            onRegionsFilterChange={handleRegionFilterChange}
          />
        </div>
        <div className="border-t border-gray-300 mb-2 w-1/4 mt-8"></div>
        <div className="flex flex-col items-center m-2">
          <button
            onClick={toggleFilter}
            className="border rounded bg-[rgb(8,129,52)] text-white p-2 my-2"
          >
            Show {filter === "non-active" ? "Active Products" : "Request List"}
          </button>
          {filter === "non-active" && (
            <div className="md:mx-2 my-2 md:my-0">
              <MultiSelectDropdown
                options={["rejected", "pending", "deleted"]}
                placeholder="Filter by Status"
                onChange={handleStatusFilterChange}
                value={selectedStatusFilters}
                name="status"
              />
            </div>
          )}
        </div>
        <div className="border-t  border-gray-300 mb-2 w-full lg:w-1/4 mt-4 lg:mt-4"></div>
      </div>
      <div className={homePageCardClassBase}>
        {loading ? (
          filteredProductsForSkeleton.map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : (
          sortedAndFilteredProducts.length > 0 ? (
            sortedAndFilteredProducts.map((product) =>
              filter === "active" && product.status !== "active" ? null : (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  business={product.business}
                  regions={product.regions}
                  status={product.status}
                />
              )
            )
          ) : (
            <div className="flex items-center h-screen">
              <p className="text-xl">No Product to display</p>
            </div>
          )
        )}
      </div>
      <NotificationContainer />
    </div>
  );
}
