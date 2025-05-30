export type TPurchase = {
  id: number;
  code: string;
  gudang_id: number;
  supplier_id: number;
  client: string;
  alamat: string;
  status: number;
  detail: TPurchaseDetail[];
  created_at: string;
  updated_at: string;
};

export type TPurchaseDetail = {
  id: string | number;
  purchase_order_id: number;
  detailable_type: string;
  detailable_id: number;
  price: number;
  stok_order: number;
  status: number;
  created_at: string;
  updated_at: string;
};

export type TPurchaseDetailInput = {
  id: string | number;
  product_id?: number | null;
  bahan_id?: number | null;
  jumlah: number | null;
  price: number | null;
  type: "bahan" | "product";
  keterangan: string;
  // "stok_order": number
};
