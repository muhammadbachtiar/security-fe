/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseResponseDto, BaseResponsePaginate } from "@/types/response";
import { axiosConfigWms } from "@/configs/axios";
import { TCategory } from "./category.type";

const CategoryService = {
  getAll: async (params: any) => {
    const response = await axiosConfigWms.get<
      BaseResponsePaginate<TCategory[]>
    >("/category", {
      params,
    });
    return response.data;
  },
  create: async (payload: any) => {
    const response = await axiosConfigWms.post<BaseResponseDto<TCategory>>(
      "/category",
      payload
    );
    return response.data;
  },
  update: async (unitId: number, payload: any) => {
    const response = await axiosConfigWms.put<BaseResponseDto<TCategory>>(
      `/category/${unitId}`,
      payload
    );
    return response.data;
  },
  delete: async (unitId: number) => {
    const response = await axiosConfigWms.delete<BaseResponseDto<TCategory>>(
      `/category/${unitId}`
    );
    return response.data;
  },
  export: async (params?: any) => {
    const response = await axiosConfigWms.get(`/export/excel/category`, {
      params,
      responseType: "blob",
    });
    return response.data;
  },
  exportProduct: async (params?: any) => {
    const response = await axiosConfigWms.get(
      `/export/excel/product-category`,
      {
        params,
        responseType: "blob",
      }
    );
    return response.data;
  },
  getOne: async (unitId: number, params?: any) => {
    const response = await axiosConfigWms.get<BaseResponseDto<TCategory>>(
      `/category/${unitId}`,
      {
        params,
      }
    );
    return response.data;
  },
  getAllProductCategory: async (params: any) => {
    const response = await axiosConfigWms.get<
      BaseResponsePaginate<TCategory[]>
    >("/product-category", {
      params,
    });
    return response.data;
  },
  createProductCategory: async (payload: any) => {
    const response = await axiosConfigWms.post<BaseResponseDto<TCategory>>(
      "/product-category",
      payload
    );
    return response.data;
  },
  updateProductCategory: async (unitId: number, payload: any) => {
    const response = await axiosConfigWms.put<BaseResponseDto<TCategory>>(
      `/product-category/${unitId}`,
      payload
    );
    return response.data;
  },
  deleteProductCategory: async (unitId: number) => {
    const response = await axiosConfigWms.delete<BaseResponseDto<TCategory>>(
      `/product-category/${unitId}`
    );
    return response.data;
  },
  getOneProductCategory: async (unitId: number, params?: any) => {
    const response = await axiosConfigWms.get<BaseResponseDto<TCategory>>(
      `/product-category/${unitId}`,
      {
        params,
      }
    );
    return response.data;
  },
};

export default CategoryService;
