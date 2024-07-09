import { useState } from "react";

type SearchAndSortProductProps = {
    // onProductSort: (filter: SortOptions) => void;
    placeholder: string;
    onSearch: (value: string) => void;
  };

  export const SearchAndSort = ({
    // onProductSort,
    placeholder,
    onSearch,
  }: SearchAndSortProductProps) => {
    // const [sortOption, setSortOption] = useState<SortOptions>("--please select--");
    const [search, setSearch] = useState("");
  
    /* const handleProductSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedSortOption = event.target.value as SortOptions;
      setSortOption(selectedSortOption);
      onProductSort(selectedSortOption);
    }; */
  
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearch(value);
      onSearch(value.trim());
    };
  
    return (
      <div className="flex md:flex-row flex-col items-center">
        {/* <div>
          <label htmlFor="filter" className="mx-2 h6">
            Sort By:{" "}
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
        </div> */}
        <div className="mx-2">
          <input
            type="text"
            placeholder={placeholder}
            value={search}
            onChange={handleChange}
            className="rounded w-auto p-2 mx-1 border border-gray-300"
          />
        </div>
      </div>
    );
  };