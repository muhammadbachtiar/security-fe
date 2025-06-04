/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseResponseDto, BaseResponsePaginate } from "@/types/response";
import { axiosConfigWms } from "@/configs/axios";
import {
  TGudang,
  TMaterialInOut,
  TProductInOut,
  TProduction,
} from "./gudang.type";
import { TMaterial } from "../material/material.type";
import { TProduct } from "../product/product.type";

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
  getProductMasuk: async (params: any) => {
    const response = await axiosConfigWms.get<
      BaseResponsePaginate<TProductInOut[]>
    >("/product-masuk", {
      params,
    });
    return response.data;
  },
  getProductKeluar: async (params: any) => {
    const response = await axiosConfigWms.get<
      BaseResponsePaginate<TProductInOut[]>
    >("/product-keluar", {
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
  checkProduct: async (payload: any) => {
    const response = await axiosConfigWms.post<BaseResponseDto<TMaterial>>(
      "/product/code",
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
  submitImportProduct: async (payload: any) => {
    const response = await axiosConfigWms.post<BaseResponseDto<TProduct[]>>(
      "/product-masuk",
      payload
    );
    return response.data;
  },
  submitExportProduct: async (payload: any) => {
    const response = await axiosConfigWms.post<BaseResponseDto<TProduct[]>>(
      "/product-keluar",
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
  deleteImportProduct: async (id: number) => {
    const response = await axiosConfigWms.delete<BaseResponseDto<TGudang>>(
      `/product-masuk/${id}`
    );
    return response.data;
  },
  deleteExportProduct: async (id: number) => {
    const response = await axiosConfigWms.delete<BaseResponseDto<TGudang>>(
      `/product-keluar/${id}`
    );
    return response.data;
  },
  exportStockOpname: async (params?: any) => {
    const response = await axiosConfigWms.get(`/export/excel/stok-opname`, {
      params,
      responseType: "blob",
    });
    return response.data;
  },
  exportHistory: async (params?: any) => {
    const response = await axiosConfigWms.get(`/export/excel/history`, {
      params,
      responseType: "blob",
    });
    return response.data;
  },
  exportInOut: async (params?: any) => {
    const response = await axiosConfigWms.get(`/export/excel/masuk-keluar`, {
      params,
      responseType: "blob",
    });
    return response.data;
  },

  // Production
  getProduction: async (params: any) => {
    const response = await axiosConfigWms.get<
      BaseResponsePaginate<TProduction[]>
    >("/production", {
      params,
    });
    return response.data;
  },
  createProduction: async (payload: any) => {
    const response = await axiosConfigWms.post<BaseResponseDto<TProduction[]>>(
      "/production",
      payload
    );
    return response.data;
  },
  updateProduction: async (id: number, payload: any) => {
    const response = await axiosConfigWms.put<BaseResponseDto<TProduction[]>>(
      `/production/${id}`,
      payload
    );
    return response.data;
  },
  deleteProduction: async (id: number) => {
    const response = await axiosConfigWms.delete<
      BaseResponseDto<TProduction[]>
    >(`/production/${id}`);
    return response.data;
  },
  getOneProduction: async (id: number, params?: any) => {
    const response = await axiosConfigWms.get<BaseResponseDto<TProduction>>(
      `/production/${id}`,
      { params }
    );
    return response.data;
  },
};

export default GudangService;
