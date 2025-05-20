import { TMaterial } from "../material/material.type";
import { TProduct } from "../product/product.type";

export type TGudang = {
  id: number;
  nama: string;
  tipe: string;
  deskripsi: string | null;
  gambar: string | null;
  no_telp: string;
  email: string;
  status: "aktif" | "nonaktif";
  alamat: null;
  kapasistas: number;
  luas: number;
  lat: string;
  long: string;
};

export type TMaterialInOut = {
  id: number;
  gudang_id: number;
  bahan_id: number;
  jumlah: number;
  keterangan: string;
  nama: string;
  bahan: TMaterial;
  created_at: string;
  updated_at: string;
};

export type TProductInOut = {
  id: number;
  gudang_id: number;
  product_id: number;
  jumlah: number;
  keterangan: string;
  nama: string;
  product: TProduct;
  created_at: string;
  updated_at: string;
};
