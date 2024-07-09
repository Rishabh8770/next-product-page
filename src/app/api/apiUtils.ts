import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type Product = {
  id: string;
  name: string;
  business: string[];
  regions: string[];
};

const getFilePath = () => path.join(process.cwd(), "src/data", "products.json");

export const readData = (): Product[] => {
  const filePath = getFilePath();
  const jsonData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(jsonData);
};

export const writeData = (data: Product[]) => {
  const filePath = getFilePath();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
};

export const handleResponse = <T>(data: T, status: number = 200) => {
  return NextResponse.json(data, { status });
};

export const handleError = (error: string, status: number = 500) => {
  return NextResponse.json({ error }, { status });
};
