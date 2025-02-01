export class Product {
  productId: number;
  productCode: string;
  productName: string;
  productCategory: string;
  unitPrice: number;
  stock: number;
  reorderPoint: number;

  constructor() {
    this.productId = 0;
    this.productCode = '';
    this.productName = '';
    this.productCategory = '';
    this.unitPrice = 0;
    this.stock = 0;
    this.reorderPoint = 0;
  }
}
