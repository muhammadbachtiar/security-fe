/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseResponseDto, BaseResponsePaginate } from "@/types/response";
import axiosConfig from "@/configs/axios";
import { TStaff } from "./staff.type";

const StaffService = {
  getAll: async (params: any) => {
    const response = await axiosConfig.get<BaseResponsePaginate<TStaff[]>>(
      "/staff",
      {
        params,
      }
    );
    return response.data;
  },
  getCount: async (params: any) => {
    const response = await axiosConfig.get<
      BaseResponseDto<
        {
          month: string;
          staff_count: number;
        }[]
      >
    >("/staff", {
      params,
    });
    return response.data;
  },
  add: async (payload: any) => {
    const response = await axiosConfig.post<BaseResponseDto<TStaff>>(
      "/staff",
      payload
    );
    return response.data;
  },
  update: async (staffId: number, payload: any) => {
    const response = await axiosConfig.put<BaseResponseDto<TStaff>>(
      `/staff/${staffId}`,
      payload
    );
    return response.data;
  },
  delete: async (staffId: number) => {
    const response = await axiosConfig.delete<BaseResponseDto<TStaff>>(
      `/staff/${staffId}`
    );
    return response.data;
  },
  getOne: async (staffId: number) => {
    const response = await axiosConfig.get<BaseResponseDto<TStaff>>(
      `/staff/${staffId}`
    );
    return response.data;
  },
  exportReportPersonal: async (params: any) => {
    const response = await axiosConfig.get(`/report/personal`, {
      params,
      responseType: "blob",
    });
    return response.data;
  },
  exportReportTotal: async (params: any) => {
    const response = await axiosConfig.get(`/report/total`, {
      params,
      responseType: "blob",
    });
    return response.data;
  },
};

export default StaffService;
