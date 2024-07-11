export type ProductProps = {
    id: string;
    name: string;
    business: string[];
    regions: string[];
    status?: ProductStatus | string;
  };

  export type ProductStatus =
  | "pending"
  | "active"
  | "rejected"
  | "delete_pending"
  | "deleted"
  | "approval_pending"
  | "delete_approval_pending"