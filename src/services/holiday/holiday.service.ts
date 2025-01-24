/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseResponseDto, BaseResponsePaginate } from "@/types/response";
import axiosConfig from "@/configs/axios";
import { THoliday } from "./holiday";

const HolidayService = {
  getAll: async (params: any) => {
    const response = await axiosConfig.get<BaseResponsePaginate<THoliday[]>>(
      "/holiday",
      {
        params,
      }
    );
    return response.data;
  },
  create: async (payload: any) => {
    const response = await axiosConfig.post<BaseResponseDto<THoliday>>(
      "/holiday",
      payload
    );
    return response.data;
  },
  update: async (holidayId: number, payload: any) => {
    const response = await axiosConfig.put<BaseResponseDto<THoliday>>(
      `/holiday/${holidayId}`,
      payload
    );
    return response.data;
  },
  delete: async (holidayId: number) => {
    const response = await axiosConfig.delete<BaseResponseDto<THoliday>>(
      `/holiday/${holidayId}`
    );
    return response.data;
  },
  getOne: async (holidayId: number, params?: any) => {
    const response = await axiosConfig.get<BaseResponseDto<THoliday>>(
      `/holiday/${holidayId}`,
      {
        params,
      }
    );
    return response.data;
  },
};

export default HolidayService;
