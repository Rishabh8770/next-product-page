import { ShieldAlert } from "lucide-react";
import { toast, ToastOptions } from "react-toastify";

// import { ProductProps } from "../types/types";

const options: ToastOptions = {
  position: "bottom-right",
  autoClose: 1500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

type NotifyDeleteProps = {
  name: string;
  id: string;
};

export const notifyAddProduct = () => {
  toast.success("Product has been added and waiting for approval!", options);
};

export const notifyErrorAddingProduct = () => {
  toast.error("There is an error on adding the product", options);
};

export const notifyEditProduct = () => {
  toast.info("Product edited successfully!", options);
};

export const notifyErrorEditingProduct = () => {
  toast.error("There is an error on Editing the product", options);
};

export const notifyMandatoryWarn = () => {
  toast.warn("Please fill all the mandatory field(s)", options);
};

export const notifyDeleteProduct = (
  product: NotifyDeleteProps,
  deleteCallback: () => void
) => {
  const confirmDelete = () => {
    deleteCallback();
    toast.dismiss();
    toast.success("Product deleted successfully!", options);
  };

  const cancelDelete = () => {
    toast.dismiss();
    toast.error("Deletion Cancelled", options);
  };

  const DeleteConfirmation = () => (
    <div className="flex justify-center flex-col">
      <div>
        <div className="flex justify-center items-center">
          <ShieldAlert color="#fb2d2d" width={50} height={50} />
        </div>
        <p className="mx-2 my-3 flex justify-center">
          Are you sure you want to delete product : "{product.name}"?
        </p>
      </div>
      <div className="m-2 flex items-center justify-center text-white">
        <button
          className="mx-2 border rounded px-2"
          style={{ backgroundColor: "rgb(241,0,0)" }}
          onClick={confirmDelete}
        >
          Yes
        </button>
        <button
          onClick={cancelDelete}
          className="border rounded px-2"
          style={{ backgroundColor: "rgb(0,157,0)" }}
        >
          No
        </button>
      </div>
    </div>
  );

  toast(<DeleteConfirmation />, {
    ...options,
    position: "top-center",
    autoClose: false,
    style: {
      minWidth: "45rem",
      fontSize: "1.3rem",
      right: "12.5rem",
      border: "0.063rem solid red",
    },
  });
};

export const notifyDeletionError = () => {
  toast.error("Error deleting a product", options);
};
