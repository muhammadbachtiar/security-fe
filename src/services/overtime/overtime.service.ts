/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseResponseDto, BaseResponsePaginate } from "@/types/response";
import axiosConfig from "@/configs/axios";
import { TOvertime } from "./overtime.type";

const OvertimeService = {
  getAll: async (params: any) => {
    const response = await axiosConfig.get<BaseResponsePaginate<TOvertime[]>>(
      "/overtime",
      {
        params,
      }
    );
    return response.data;
  },
  create: async (payload: any) => {
    const response = await axiosConfig.post<BaseResponseDto<TOvertime>>(
      "/overtime",
      payload
    );
    return response.data;
  },
  update: async (overtimeId: number, payload: any) => {
    const response = await axiosConfig.put<BaseResponseDto<TOvertime>>(
      `/overtime/${overtimeId}`,
      payload
    );
    return response.data;
  },
  delete: async (overtimeId: number) => {
    const response = await axiosConfig.delete<BaseResponseDto<TOvertime>>(
      `/overtime/${overtimeId}`
    );
    return response.data;
  },
  getOne: async (overtimeId: number, params?: any) => {
    const response = await axiosConfig.get<BaseResponseDto<TOvertime>>(
      `/overtime/${overtimeId}`,
      {
        params,
      }
    );
    return response.data;
  },
};

export default OvertimeService;
