/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosConfig from "@/configs/axios";
import { BaseResponseDto, BaseResponsePaginate } from "@/types/response";
import { TKpiDiv, TKpiDivDetail, TKpiStaff, TKpiStaffDetail } from "./kpi.type";

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
  getAllStaff: async (params: any) => {
    const response = await axiosConfig.get<BaseResponsePaginate<TKpiStaff[]>>(
      "/task-kpi",
      {
        params,
      }
    );
    return response.data;
  },
  createStaff: async (payload: any) => {
    const response = await axiosConfig.post<BaseResponseDto<TKpiStaff | any>>(
      "/task-kpi",
      payload
    );
    return response.data;
  },
  createDetailStaff: async (payload: any) => {
    const response = await axiosConfig.post<
      BaseResponseDto<TKpiStaffDetail | any>
    >("/detail-task-kpi", payload);
    return response.data;
  },
  updateStaff: async (kpiId: number, payload: any) => {
    const response = await axiosConfig.put<BaseResponseDto<TKpiStaff>>(
      `/task-kpi/${kpiId}`,
      payload
    );
    return response.data;
  },
  deleteStaff: async (kpiId: number) => {
    const response = await axiosConfig.delete<BaseResponseDto<TKpiStaff>>(
      `/task-kpi/${kpiId}`
    );
    return response.data;
  },
  deleteDetailStaff: async (kpiId: number) => {
    const response = await axiosConfig.delete<BaseResponseDto<TKpiStaffDetail>>(
      `/detail-task-kpi/${kpiId}`
    );
    return response.data;
  },
  getOneStaff: async (kpiId: number, params?: any) => {
    const response = await axiosConfig.get<BaseResponseDto<TKpiStaff>>(
      `/task-kpi/${kpiId}`,
      {
        params,
      }
    );
    return response.data;
  },
};

export default KPIService;
