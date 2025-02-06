/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosConfig from "@/configs/axios";
import { BaseResponseDto, BaseResponsePaginate } from "@/types/response";
import { TPayroll, TPayrollDetail, TSalary } from "./payroll.type";

const PayrollService = {
  getAll: async (params: any) => {
    const response = await axiosConfig.get<BaseResponsePaginate<TPayroll[]>>(
      "/payroll",
      {
        params,
      }
    );
    return response.data;
  },
  create: async (payload: any) => {
    const response = await axiosConfig.post<BaseResponseDto<TPayroll | any>>(
      "/payroll",
      payload
    );
    return response.data;
  },
  createDetail: async (payload: any) => {
    const response = await axiosConfig.post<
      BaseResponseDto<TPayrollDetail | any>
    >("/detail-payroll", payload);
    return response.data;
  },
  update: async (payrollId: number, payload: any) => {
    const response = await axiosConfig.put<BaseResponseDto<TPayroll>>(
      `/payroll/${payrollId}`,
      payload
    );
    return response.data;
  },
  delete: async (payrollId: number) => {
    const response = await axiosConfig.delete<BaseResponseDto<TPayroll>>(
      `/payroll/${payrollId}`
    );
    return response.data;
  },
  deleteDetail: async (payrollId: number) => {
    const response = await axiosConfig.delete<BaseResponseDto<TPayrollDetail>>(
      `/detail-payroll/${payrollId}`
    );
    return response.data;
  },
  getOne: async (payrollId: number, params?: any) => {
    const response = await axiosConfig.get<BaseResponseDto<TPayroll>>(
      `/payroll/${payrollId}`,
      {
        params,
      }
    );
    return response.data;
  },
  getSalary: async (params?: any) => {
    const response = await axiosConfig.get<BaseResponseDto<TSalary>>(
      `/salary`,
      {
        params,
      }
    );
    return response.data;
  },
};

export default PayrollService;
