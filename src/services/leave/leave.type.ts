import { TStaff } from "../staff/staff.type";

export type TLeave = {
  id: number;
  staff_id: number;
  tanggal: string;
  jam: string;
  status: string;
  alasan: string;
  tipe: "ijin" | "cuti";
  keterangan: string;
  replacement: string | null;
  staff: TStaff;
  created_at: string;
  updated_at: string;
};

export type RequestBodyLeave = {
  name: string;
};
