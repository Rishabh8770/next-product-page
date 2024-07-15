import { useState } from "react";
import { MultiSelectDropdown, Option } from "./MultiSelectDropdown";
import { useProductContext } from "@/context/ProductPageContext";

type FilterChangeProps = {
  onBusinessFilterChange : (options: Option[] | null) => void
  onRegionsFilterChange : (options: Option[] | null) => void
}

export default function FilterProducts({onBusinessFilterChange, onRegionsFilterChange}: FilterChangeProps) {

  const [selectBusinessOptions, setSelectBusinessOptions] = useState<Option[] | null>(null);
  const [selectRegionOptions, setSelectRegionsOptions] = useState<Option[] | null>(null);
  const { products } = useProductContext();
  const handleSelectBusinessFilterChange = (selectedOptions: Option[] | null) => {
    setSelectBusinessOptions(selectedOptions);
    onBusinessFilterChange(selectedOptions);
  };

  const handleSelectRegionFilterChange = (selectedOptions: Option[] | null) => {
    setSelectRegionsOptions(selectedOptions);
    onRegionsFilterChange(selectedOptions);
  };

  const getUniqueValues = (array: string[]): string[] => {
    return Array.from(new Set(array));
  };

  const businessOptions = getUniqueValues(products.flatMap((product) => product.business))
  const regionOptions = getUniqueValues(products.flatMap((product) => product.regions))

  return (
    <div className="flex flex-col items-center border rounded">
      <div className="text-md my-2">
        Filter By
      </div>
      <div className="border-t border-gray-300 mb-4 w-3/4"></div>
      <div className="flex items-center my-2 md:my-0">
        <h6 className="mx-2 mb-0">Business:</h6>
        <MultiSelectDropdown
          options={businessOptions}
          placeholder="Select Business"
          onChange={handleSelectBusinessFilterChange}
          value={selectBusinessOptions}
        />
      </div>
      <div className="flex align-items-center my-4">
        <h6 className="mx-2 mb-0">Regions:</h6>
        <MultiSelectDropdown
          options={regionOptions}
          placeholder="Select Regions"
          onChange={handleSelectRegionFilterChange}
          value={selectRegionOptions}
        />
      </div>
    </div>
  );
}
