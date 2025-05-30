/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseResponseDto, BaseResponsePaginate } from "@/types/response";
import { axiosConfigWms } from "@/configs/axios";
import { TSales } from "./sales.type";

const SalesOrderService = {
  getAll: async (params: any) => {
    const response = await axiosConfigWms.get<BaseResponsePaginate<TSales[]>>(
      "/sales-order",
      {
        params,
      }
    );
    return response.data;
  },
  create: async (payload: any) => {
    const response = await axiosConfigWms.post<BaseResponseDto<TSales>>(
      "/sales-order",
      payload
    );
    return response.data;
  },
  update: async (poId: number, payload: any) => {
    const response = await axiosConfigWms.put<BaseResponseDto<TSales>>(
      `/sales-order/${poId}`,
      payload
    );
    return response.data;
  },
  delete: async (poId: number) => {
    const response = await axiosConfigWms.delete<BaseResponseDto<TSales>>(
      `/sales-order/${poId}`
    );
    return response.data;
  },
  getOne: async (poId: number, params?: any) => {
    const response = await axiosConfigWms.get<BaseResponseDto<TSales>>(
      `/sales-order/${poId}`,
      {
        params,
      }
    );
    return response.data;
  },
};

export default SalesOrderService;
