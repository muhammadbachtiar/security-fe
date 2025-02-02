/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseResponseDto, BaseResponsePaginate } from "@/types/response";
import { axiosConfigWms } from "@/configs/axios";
import { TGudang } from "./gudang.type";

const GudangService = {
  getAll: async (params: any) => {
    const response = await axiosConfigWms.get<BaseResponsePaginate<TGudang[]>>(
      "/gudang",
      {
        params,
      }
    );
    return response.data;
  },
  create: async (payload: any) => {
    const response = await axiosConfigWms.post<BaseResponseDto<TGudang>>(
      "/gudang",
      payload
    );
    return response.data;
  },
  update: async (gudangId: number, payload: any) => {
    const response = await axiosConfigWms.put<BaseResponseDto<TGudang>>(
      `/gudang/${gudangId}`,
      payload
    );
    return response.data;
  },
  delete: async (gudangId: number) => {
    const response = await axiosConfigWms.delete<BaseResponseDto<TGudang>>(
      `/gudang/${gudangId}`
    );
    return response.data;
  },
  getOne: async (gudangId: number, params?: any) => {
    const response = await axiosConfigWms.get<BaseResponseDto<TGudang>>(
      `/gudang/${gudangId}`,
      {
        params,
      }
    );
    return response.data;
  },
};

export default GudangService;
