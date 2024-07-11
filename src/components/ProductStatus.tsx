import { ProductProps } from "@/types/Types";

type ProductStatusProps = {
  product: ProductProps | null;
};

export default function ProductStatus({ product }: ProductStatusProps) {
  return (
    <>
      {product ? (
        <div className="flex justify-center flex-col">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b-2 border-gray-200 text-center">
                  Product
                </th>
                <th className="py-2 px-4 border-b-2 border-gray-200 text-center">
                  Status
                </th>
                <th className="py-2 px-4 border-b-2 border-gray-200 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  className="py-2 px-4 border-b border-gray-200 text-center font-bold"
                  rowSpan={2}
                >
                  <strong>{product?.name}</strong>
                </td>
                <td
                  className="py-2 px-4 border-b border-gray-200 text-center"
                  rowSpan={2}
                >
                  {product?.status}
                </td>
                <td className="py-2 px-4 border-b border-l border-gray-200 text-center">
                  <div className="flex justify-center items-center">
                    <span className="mx-4">Approval-1</span>
                    <button className="mx-4 p-1 bg-green-500 rounded text-white">
                      Approve
                    </button>
                    <button className="p-1 bg-red-500 rounded text-white">
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b border-l border-gray-200 text-center">
                  <div className="flex justify-center items-center">
                    <span className="mx-4">Approval-2</span>
                    <button className="mx-4 p-1 bg-green-500 rounded text-white">
                      Approve
                    </button>
                    <button className="p-1 bg-red-500 rounded text-white">
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div>{""}</div>
      )}
    </>
  );
}
