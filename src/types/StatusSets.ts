import { ProductStatusEnum } from "./ProductStatusEnum";

export const disableApproveStep1Statuses = [
  ProductStatusEnum.Active,
  ProductStatusEnum.Rejected,
  ProductStatusEnum.Deleted,
  ProductStatusEnum.ApprovalPending,
  ProductStatusEnum.DeleteApprovalPending,
];

export const disableApproveStep2Statuses = [
  ProductStatusEnum.Active,
  ProductStatusEnum.Rejected,
  ProductStatusEnum.Deleted,
  ProductStatusEnum.Pending,
  ProductStatusEnum.DeletePending,
];

export const disableRejectStatuses = [
  ProductStatusEnum.Active,
  ProductStatusEnum.Rejected,
  ProductStatusEnum.Deleted,
];

export const disableDeleteAndEdit = [
  ProductStatusEnum.Rejected,
  ProductStatusEnum.Deleted,
  ProductStatusEnum.DeleteApprovalPending,
  ProductStatusEnum.DeletePending,
];

export const showDetailsMessage = [
  ProductStatusEnum.ApprovalPending,
  ProductStatusEnum.DeletePending,
  ProductStatusEnum.Pending,
];
