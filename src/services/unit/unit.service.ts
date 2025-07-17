/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseResponseDto, BaseResponsePaginate } from "@/types/response";
import { TUnit } from "./unit.type";
import { axiosConfigWms } from "@/configs/axios";

const UnitService = {
  getAll: async (params: any) => {
    const response = await axiosConfigWms.get<BaseResponsePaginate<TUnit[]>>(
      "/satuan",
      {
        params,
      }
    );
    return response.data;
  },
  create: async (payload: any) => {
    const response = await axiosConfigWms.post<BaseResponseDto<TUnit>>(
      "/satuan",
      payload
    );
    return response.data;
  },
  update: async (unitId: number, payload: any) => {
    const response = await axiosConfigWms.put<BaseResponseDto<TUnit>>(
      `/satuan/${unitId}`,
      payload
    );
    return response.data;
  },
  delete: async (unitId: number) => {
    const response = await axiosConfigWms.delete<BaseResponseDto<TUnit>>(
      `/satuan/${unitId}`
    );
    return response.data;
  },
  getOne: async (unitId: number, params?: any) => {
    const response = await axiosConfigWms.get<BaseResponseDto<TUnit>>(
      `/satuan/${unitId}`,
      {
        params,
      }
    );
    return response.data;
  },
  export: async (params?: any) => {
    const response = await axiosConfigWms.get(`/export/excel/satuan`, {
      params,
      responseType: "blob",
    });
    return response.data;
  },
  exportProduct: async (params?: any) => {
    const response = await axiosConfigWms.get(`/export/excel/satuan-product`, {
      params,
      responseType: "blob",
    });
    return response.data;
  },
  getAllProductUnit: async (params: any) => {
    const response = await axiosConfigWms.get<BaseResponsePaginate<TUnit[]>>(
      "/product-satuan",
      {
        params,
      }
    );
    return response.data;
  },
  createProductUnit: async (payload: any) => {
    const response = await axiosConfigWms.post<BaseResponseDto<TUnit>>(
      "/product-satuan",
      payload
    );
    return response.data;
  },
  updateProductUnit: async (unitId: number, payload: any) => {
    const response = await axiosConfigWms.put<BaseResponseDto<TUnit>>(
      `/product-satuan/${unitId}`,
      payload
    );
    return response.data;
  },
  deleteProductUnit: async (unitId: number) => {
    const response = await axiosConfigWms.delete<BaseResponseDto<TUnit>>(
      `/product-satuan/${unitId}`
    );
    return response.data;
  },
  getOneProductUnit: async (unitId: number, params?: any) => {
    const response = await axiosConfigWms.get<BaseResponseDto<TUnit>>(
      `/product-satuan/${unitId}`,
      {
        params,
      }
    );
    return response.data;
  },
};

export default UnitService;
