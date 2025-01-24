/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseResponseDto, BaseResponsePaginate } from "@/types/response";
import axiosConfig from "@/configs/axios";
import { TDivision } from "./divisi.type";

const DivisionService = {
  getAll: async (params: any) => {
    const response = await axiosConfig.get<BaseResponsePaginate<TDivision[]>>(
      "/division",
      {
        params,
      }
    );
    return response.data;
  },
  add: async (payload: any) => {
    const response = await axiosConfig.post<BaseResponseDto<TDivision>>(
      "/division",
      payload
    );
    return response.data;
  },
  update: async (divId: number, payload: any) => {
    const response = await axiosConfig.put<BaseResponseDto<TDivision>>(
      `/division/${divId}`,
      payload
    );
    return response.data;
  },
  delete: async (divId: number) => {
    const response = await axiosConfig.delete<BaseResponseDto<TDivision>>(
      `/division/${divId}`
    );
    return response.data;
  },
  getOne: async (divId: number, params?: any) => {
    const response = await axiosConfig.get<BaseResponseDto<TDivision>>(
      `/division/${divId}`,
      {
        params,
      }
    );
    return response.data;
  },
};

export default DivisionService;
