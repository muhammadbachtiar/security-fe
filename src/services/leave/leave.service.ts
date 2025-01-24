/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseResponseDto, BaseResponsePaginate } from "@/types/response";
import axiosConfig from "@/configs/axios";
import { TLeave } from "./leave.type";

const LeaveService = {
  getAll: async (params: any) => {
    const response = await axiosConfig.get<BaseResponsePaginate<TLeave[]>>(
      "/leave",
      {
        params,
      }
    );
    return response.data;
  },
  create: async (payload: any) => {
    const response = await axiosConfig.post<BaseResponseDto<TLeave>>(
      "/leave",
      payload
    );
    return response.data;
  },
  update: async (divId: number, payload: any) => {
    const response = await axiosConfig.put<BaseResponseDto<TLeave>>(
      `/leave/${divId}`,
      payload
    );
    return response.data;
  },
  delete: async (divId: number) => {
    const response = await axiosConfig.delete<BaseResponseDto<TLeave>>(
      `/leave/${divId}`
    );
    return response.data;
  },
  getOne: async (divId: number, params?: any) => {
    const response = await axiosConfig.get<BaseResponseDto<TLeave>>(
      `/leave/${divId}`,
      {
        params,
      }
    );
    return response.data;
  },
};

export default LeaveService;
