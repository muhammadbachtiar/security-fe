/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseResponseDto, BaseResponsePaginate } from "@/types/response";
import { axiosConfigWms } from "@/configs/axios";
import { TMaterial } from "./material.type";

const MaterialService = {
  getAll: async (params: any) => {
    const response = await axiosConfigWms.get<
      BaseResponsePaginate<TMaterial[]>
    >("/bahan", {
      params,
    });
    return response.data;
  },
  create: async (payload: any) => {
    const response = await axiosConfigWms.post<BaseResponseDto<TMaterial>>(
      "/bahan",
      payload
    );
    return response.data;
  },
  update: async (materialId: number, payload: any) => {
    const response = await axiosConfigWms.put<BaseResponseDto<TMaterial>>(
      `/bahan/${materialId}`,
      payload
    );
    return response.data;
  },
  delete: async (materialId: number) => {
    const response = await axiosConfigWms.delete<BaseResponseDto<TMaterial>>(
      `/bahan/${materialId}`
    );
    return response.data;
  },
  getOne: async (materialId: number, params?: any) => {
    const response = await axiosConfigWms.get<BaseResponseDto<TMaterial>>(
      `/bahan/${materialId}`,
      {
        params,
      }
    );
    return response.data;
  },
};

export default MaterialService;
