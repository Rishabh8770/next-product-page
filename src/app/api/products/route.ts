import { readData, writeData, handleResponse, handleError } from "../apiUtils";

export async function GET() {
  try {
    const data = readData();
    return handleResponse(data);
  } catch (error) {
    return handleError("Failed to fetch products", 500);
  }
}

export async function POST(req: Request) {
  try {
    const newProduct = await req.json();
    const data = readData();
    data.push(newProduct);
    writeData(data);
    return handleResponse(newProduct, 201);
  } catch (error) {
    return handleError("Failed to add product", 500);
  }
}
