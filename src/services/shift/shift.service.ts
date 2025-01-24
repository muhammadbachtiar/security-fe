/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseResponseDto, BaseResponsePaginate } from "@/types/response";
import axiosConfig from "@/configs/axios";
import { TShift } from "./shift.type";

const ShiftService = {
  getAll: async (params: any) => {
    const response = await axiosConfig.get<BaseResponsePaginate<TShift[]>>(
      "/shift",
      {
        params,
      }
    );
    return response.data;
  },
  add: async (payload: any) => {
    const response = await axiosConfig.post<BaseResponseDto<TShift>>(
      "/shift",
      payload
    );
    return response.data;
  },
  update: async (shiftId: number, payload: any) => {
    const response = await axiosConfig.put<BaseResponseDto<TShift>>(
      `/shift/${shiftId}`,
      payload
    );
    return response.data;
  },
  delete: async (shiftId: number) => {
    const response = await axiosConfig.delete<BaseResponseDto<TShift>>(
      `/shift/${shiftId}`
    );
    return response.data;
  },
  getOne: async (shiftId: number, params?: any) => {
    const response = await axiosConfig.get<BaseResponseDto<TShift>>(
      `/shift/${shiftId}`,
      {
        params,
      }
    );
    return response.data;
  },
};

export default ShiftService;
