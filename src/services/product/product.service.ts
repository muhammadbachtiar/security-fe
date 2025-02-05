/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseResponseDto, BaseResponsePaginate } from "@/types/response";
import { axiosConfigWms } from "@/configs/axios";
import { TProduct } from "./product.type";

const ProductService = {
  getAll: async (params: any) => {
    const response = await axiosConfigWms.get<BaseResponsePaginate<TProduct[]>>(
      "/product",
      {
        params,
      }
    );
    return response.data;
  },
  create: async (payload: any) => {
    const response = await axiosConfigWms.post<BaseResponseDto<TProduct>>(
      "/product",
      payload
    );
    return response.data;
  },
  update: async (productId: number, payload: any) => {
    const response = await axiosConfigWms.put<BaseResponseDto<TProduct>>(
      `/product/${productId}`,
      payload
    );
    return response.data;
  },
  delete: async (productId: number) => {
    const response = await axiosConfigWms.delete<BaseResponseDto<TProduct>>(
      `/product/${productId}`
    );
    return response.data;
  },
  getOne: async (productId: number, params?: any) => {
    const response = await axiosConfigWms.get<BaseResponseDto<TProduct>>(
      `/product/${productId}`,
      {
        params,
      }
    );
    return response.data;
  },
};

export default ProductService;
