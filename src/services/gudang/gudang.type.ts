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
