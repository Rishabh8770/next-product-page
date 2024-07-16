import { readData, writeData, handleResponse, handleError, readDeletedData } from "@/utils/apiUtils";


export async function GET(req: Request) {
  try {
    const data = readData();
    const deletedData = readDeletedData();
    return handleResponse([...data, ...deletedData]);
  } catch (error) {
    return handleError("Failed to fetch products", 500);
  }
}

export async function POST(req: Request) {
  try {
    const newProduct = await req.json();
    newProduct.status = "pending";
    const data = readData();
    data.push(newProduct);
    writeData(data);
    return handleResponse(newProduct, 201);
  } catch (error) {
    return handleError("Failed to add product", 500);
  }
}
