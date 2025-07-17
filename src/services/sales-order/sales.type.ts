export type TSales = {
  id: number;
  code: string;
  customer_id: number;
  name: string;
  tanggal_kirim: string;
  status: string;
  status_payment: string;
  discount: number;
  total_price: number;
  delivery_cost: number;
  shipper: string;
  tax_cost: number;
  deskripsi: string;
  created_at: string;
  updated_at: string;
};

// export type TSalesDetail = {
//   id: string | number;
//   purchase_order_id: number;
//   detailable_type: string;
//   detailable_id: number;
//   price: number;
//   stok_order: number;
//   status: number;
//   created_at: string;
//   updated_at: string;
// };
