import { Product } from "./Product";

export type FeaturedProduct = {
  _id?: string;
  order: number;
  quantity?: number;
  productDetails: Product;
  product: {
    _id: string;
  };
};