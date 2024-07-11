import { useState } from "react";

export type SortOptions = "--please select--" | "name" | "business" | "regions";

type SearchAndSortProductProps = {
  onProductSort: (filter: SortOptions) => void;
  placeholder: string;
  onSearch: (value: string) => void;
};

export const SearchAndSort = ({
  onProductSort,
  placeholder,
  onSearch,
}: SearchAndSortProductProps) => {
  const [sortOption, setSortOption] =
    useState<SortOptions>("--please select--");
  const [search, setSearch] = useState("");

  const handleProductSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSortOption = event.target.value as SortOptions;
    setSortOption(selectedSortOption);
    onProductSort(selectedSortOption);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    onSearch(value.trim());
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="mx-2 flex flex-col items-center">
        <p className="mb-2">Search Product</p>
        <input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={handleChange}
          className="rounded w-3/4 p-2 mx-1 border border-gray-300"
        />
      </div>
      <div className="border-t border-gray-300 mb-2 w-1/4 mt-4"></div>
      <div className="my-4 flex flex-col items-center">
        <label htmlFor="filter" className="mr-2 h6 mb-2">
          Sort By
        </label>
        <select
          name="filter"
          value={sortOption}
          onChange={handleProductSort}
          className="rounded p-2 border border-gray-300"
        >
          <option value="">-Please select-</option>
          <option value="name">Name</option>
          <option value="business">Business</option>
          <option value="regions">Regions</option>
        </select>
      </div>
    </div>
  );
};
