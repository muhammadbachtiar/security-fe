/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseResponseDto, BaseResponsePaginate } from "@/types/response";
import { axiosConfigWms } from "@/configs/axios";
import { TGudang, TMaterialInOut } from "./gudang.type";
import { TMaterial } from "../material/material.type";

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
  getBahanMasuk: async (params: any) => {
    const response = await axiosConfigWms.get<
      BaseResponsePaginate<TMaterialInOut[]>
    >("/masuk", {
      params,
    });
    return response.data;
  },
  getBahanKeluar: async (params: any) => {
    const response = await axiosConfigWms.get<
      BaseResponsePaginate<TMaterialInOut[]>
    >("/keluar", {
      params,
    });
    return response.data;
  },
  checkBahan: async (payload: any) => {
    const response = await axiosConfigWms.post<BaseResponseDto<TMaterial>>(
      "/bahan/code",
      payload
    );
    return response.data;
  },
  submitImportBahan: async (payload: any) => {
    const response = await axiosConfigWms.post<BaseResponseDto<TMaterial[]>>(
      "/masuk",
      payload
    );
    return response.data;
  },
  submitExportBahan: async (payload: any) => {
    const response = await axiosConfigWms.post<BaseResponseDto<TMaterial[]>>(
      "/keluar",
      payload
    );
    return response.data;
  },
  deleteImportBahan: async (id: number) => {
    const response = await axiosConfigWms.delete<BaseResponseDto<TGudang>>(
      `/masuk/${id}`
    );
    return response.data;
  },
  deleteExportBahan: async (id: number) => {
    const response = await axiosConfigWms.delete<BaseResponseDto<TGudang>>(
      `/keluar/${id}`
    );
    return response.data;
  },
};

export default GudangService;
