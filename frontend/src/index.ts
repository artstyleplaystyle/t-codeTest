export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount: number;
  photo?: string;
  sku?: string;
  discountPrice?: string;
}