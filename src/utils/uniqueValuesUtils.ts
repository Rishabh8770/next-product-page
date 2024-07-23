import { Option } from "@/components/MultiSelectDropdown";

export const getUniqueValues = (array: string[]): string[] => {
  return Array.from(new Set(array));
};

export const arraysEqual = (a: Option[], b: Option[]): boolean => {
  if (a.length !== b.length) return false;
  a.sort((x, y) => x.value.localeCompare(y.value));
  b.sort((x, y) => x.value.localeCompare(y.value));
  return JSON.stringify(a) === JSON.stringify(b);
};
