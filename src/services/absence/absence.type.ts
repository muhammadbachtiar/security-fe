import { TShift } from "../shift/shift.type";
import { TStaff } from "../staff/staff.type";

export type TAbsence = {
  id: number;
  staff_id: number;
  shift_id: number;
  tanggal: string;
  masuk: string;
  keluar: string;
  // telat: string | boolean;
  waktu: string;
  by: string | null;
  lat: number;
  long: number;
  lat_pulang: number;
  long_pulang: number;
  status: "pulang" | "masuk";
  // pulang: null;
  hours: number;
  staff: TStaff;
  shift: TShift;
  created_at: string;
  updated_at: string;
};
