/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosConfig from "@/configs/axios";
import { BaseResponseDto, BaseResponsePaginate } from "@/types/response";
import { TKpiDiv, TKpiDivDetail } from "./kpi.type";

const KPIService = {
  getAll: async (params: any) => {
    const response = await axiosConfig.get<BaseResponsePaginate<TKpiDiv[]>>(
      "/kpi",
      {
        params,
      }
    );
    return response.data;
  },
  create: async (payload: any) => {
    const response = await axiosConfig.post<BaseResponseDto<TKpiDiv | any>>(
      "/kpi",
      payload
    );
    return response.data;
  },
  createDetail: async (payload: any) => {
    const response = await axiosConfig.post<
      BaseResponseDto<TKpiDivDetail | any>
    >("/detail-kpi", payload);
    return response.data;
  },
  update: async (kpiId: number, payload: any) => {
    const response = await axiosConfig.put<BaseResponseDto<TKpiDiv>>(
      `/kpi/${kpiId}`,
      payload
    );
    return response.data;
  },
  delete: async (kpiId: number) => {
    const response = await axiosConfig.delete<BaseResponseDto<TKpiDiv>>(
      `/kpi/${kpiId}`
    );
    return response.data;
  },
  deleteDetail: async (kpiId: number) => {
    const response = await axiosConfig.delete<BaseResponseDto<TKpiDivDetail>>(
      `/detail-kpi/${kpiId}`
    );
    return response.data;
  },
  getOne: async (kpiId: number, params?: any) => {
    const response = await axiosConfig.get<BaseResponseDto<TKpiDiv>>(
      `/kpi/${kpiId}`,
      {
        params,
      }
    );
    return response.data;
  },
};

export default KPIService;
