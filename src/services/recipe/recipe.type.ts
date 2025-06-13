import { TMaterial } from "../material/material.type";
import { TProduct } from "../product/product.type";

export type TRecipe = {
  id: number;
  product_id: number;
  bahan_id: number;
  jumlah: number;
  bahan: TMaterial;
  product: TProduct;
  created_at: string;
  updated_at: string;
};
