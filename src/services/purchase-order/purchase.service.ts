/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseResponseDto, BaseResponsePaginate } from "@/types/response";
import { axiosConfigWms } from "@/configs/axios";
import { TPurchase } from "./purchase.type";

const PurchaseService = {
  getAll: async (params: any) => {
    const response = await axiosConfigWms.get<
      BaseResponsePaginate<TPurchase[]>
    >("/purchase-order", {
      params,
    });
    return response.data;
  },
  create: async (payload: any) => {
    const response = await axiosConfigWms.post<BaseResponseDto<TPurchase>>(
      "/purchase-order",
      payload
    );
    return response.data;
  },
  update: async (poId: number, payload: any) => {
    const response = await axiosConfigWms.put<BaseResponseDto<TPurchase>>(
      `/purchase-order/${poId}`,
      payload
    );
    return response.data;
  },
  delete: async (poId: number) => {
    const response = await axiosConfigWms.delete<BaseResponseDto<TPurchase>>(
      `/purchase-order/${poId}`
    );
    return response.data;
  },
  getOne: async (poId: number, params?: any) => {
    const response = await axiosConfigWms.get<BaseResponseDto<TPurchase>>(
      `/purchase-order/${poId}`,
      {
        params,
      }
    );
    return response.data;
  },
};

export default PurchaseService;
