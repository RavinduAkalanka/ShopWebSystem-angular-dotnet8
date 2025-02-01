export interface IProduct {
  productId: number;
  productCode: string;
  productName: string;
  productCategory: string;
  unitPrice: number;
  stock: number;
  reorderPoint: number;
}

export interface APIResponseModel {
  message: string;
  result: boolean;
  data: any;
}
