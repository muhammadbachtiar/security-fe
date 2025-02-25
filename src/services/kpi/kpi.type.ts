import { TDivision } from "../divisi/divisi.type";
import { TStaff } from "../staff/staff.type";

export type TKpiDiv = {
  id: number;
  division_id: number;
  name: string;
  status: string;
  detail: TKpiDivDetail[];
  division: TDivision;
  created_at: string;
  updated_at: string;
};

export type TKpiDivDetail = {
  id: number;
  kpi_id: number;
  key: string;
  value: number;
  created_at: string;
  updated_at: string;
};

export type TKpiStaff = {
  id: number;
  staff_id: number;
  name: string;
  status: string;
  from: string;
  to: string;
  detail: TKpiDivDetail[];
  staff: TStaff;
  created_at: string;
  updated_at: string;
};

export type TKpiStaffDetail = {
  id: number;
  kpi_id: number;
  key: string;
  value: number;
  created_at: string;
  updated_at: string;
};
