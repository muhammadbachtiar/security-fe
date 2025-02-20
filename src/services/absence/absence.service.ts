/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosConfig from "@/configs/axios";
import { TAbsence, TGraphAbsence } from "./absence.type";
import { BaseResponseDto, BaseResponsePaginate } from "@/types/response";

const AbsenceService = {
  getAll: async (params: any) => {
    const response = await axiosConfig.get<BaseResponsePaginate<TAbsence[]>>(
      "/absence",
      {
        params,
      }
    );
    return response.data;
  },
  getGraph: async (params: any) => {
    const response = await axiosConfig.get<BaseResponseDto<TGraphAbsence>>(
      "/absence",
      {
        params,
      }
    );
    return response.data;
  },
  create: async (payload: any) => {
    const response = await axiosConfig.post<BaseResponseDto<TAbsence | any>>(
      "/absence",
      payload
    );
    return response.data;
  },
  update: async (divId: number, payload: any) => {
    const response = await axiosConfig.put<BaseResponseDto<TAbsence>>(
      `/absence/${divId}`,
      payload
    );
    return response.data;
  },
  delete: async (divId: number) => {
    const response = await axiosConfig.delete<BaseResponseDto<TAbsence>>(
      `/absence/${divId}`
    );
    return response.data;
  },
  getOne: async (divId: number, params?: any) => {
    const response = await axiosConfig.get<BaseResponseDto<TAbsence>>(
      `/absence/${divId}`,
      {
        params,
      }
    );
    return response.data;
  },
};

export default AbsenceService;
