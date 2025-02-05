/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseResponseDto, BaseResponsePaginate } from "@/types/response";
import { axiosConfigWms } from "@/configs/axios";
import { TCustomer } from "./customer.type";

const CustomerService = {
  getAll: async (params: any) => {
    const response = await axiosConfigWms.get<
      BaseResponsePaginate<TCustomer[]>
    >("/customer", {
      params,
    });
    return response.data;
  },
  create: async (payload: any) => {
    const response = await axiosConfigWms.post<BaseResponseDto<TCustomer>>(
      "/customer",
      payload
    );
    return response.data;
  },
  update: async (customerId: number, payload: any) => {
    const response = await axiosConfigWms.put<BaseResponseDto<TCustomer>>(
      `/customer/${customerId}`,
      payload
    );
    return response.data;
  },
  delete: async (customerId: number) => {
    const response = await axiosConfigWms.delete<BaseResponseDto<TCustomer>>(
      `/customer/${customerId}`
    );
    return response.data;
  },
  getOne: async (customerId: number, params?: any) => {
    const response = await axiosConfigWms.get<BaseResponseDto<TCustomer>>(
      `/customer/${customerId}`,
      {
        params,
      }
    );
    return response.data;
  },
};

export default CustomerService;
