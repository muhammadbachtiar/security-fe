import { TStaff } from "../staff/staff.type";

export type TPayroll = {
  id: number;
  staff_id: number;
  from: string;
  to: string;
  total: number;
  staff: TStaff;
  detail: {
    payroll_id: number;
    key: string;
    value: number;
  }[];
  created_at: string;
  updated_at: string;
};

export type TPayrollDetail = {
  id: number;
  payroll_id: number;
  key: string;
  value: number;
  created_at: string;
  updated_at: string;
};

export type TSalary = {
  data: {
    total_hour: string;
    total_salary: number;
    salary_per_hour: number;
    staff: TStaff;
  };
};
