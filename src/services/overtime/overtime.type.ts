import { TStaff } from "../staff/staff.type";

export type TOvertime = {
  id: number;
  staff_id: number;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  status: string;
  alasan: string;
  hours: 1;
  staff: TStaff;
  created_at: string;
  updated_at: string;
};
