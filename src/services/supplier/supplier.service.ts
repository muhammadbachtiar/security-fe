/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseResponseDto, BaseResponsePaginate } from "@/types/response";
import { axiosConfigWms } from "@/configs/axios";
import { TSupplier } from "./supplier.type";

const SupplierService = {
  getAll: async (params: any) => {
    const response = await axiosConfigWms.get<
      BaseResponsePaginate<TSupplier[]>
    >("/supplier", {
      params,
    });
    return response.data;
  },
  create: async (payload: any) => {
    const response = await axiosConfigWms.post<BaseResponseDto<TSupplier>>(
      "/supplier",
      payload
    );
    return response.data;
  },
  update: async (supplierId: number, payload: any) => {
    const response = await axiosConfigWms.put<BaseResponseDto<TSupplier>>(
      `/supplier/${supplierId}`,
      payload
    );
    return response.data;
  },
  delete: async (supplierId: number) => {
    const response = await axiosConfigWms.delete<BaseResponseDto<TSupplier>>(
      `/supplier/${supplierId}`
    );
    return response.data;
  },
  getOne: async (supplierId: number, params?: any) => {
    const response = await axiosConfigWms.get<BaseResponseDto<TSupplier>>(
      `/supplier/${supplierId}`,
      {
        params,
      }
    );
    return response.data;
  },
};

export default SupplierService;
