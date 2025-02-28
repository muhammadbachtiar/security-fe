/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosConfig, { axiosConfigCore } from "@/configs/axios";
import { BaseResponseDto } from "@/types/response";
import { PlanType, SubsType } from "./plan.type";

const PlanService = {
  getPlans: async (params?: any) => {
    const response = await axiosConfig.get<BaseResponseDto<PlanType[]>>(
      "/plan",
      {
        params,
      }
    );
    return response.data;
  },
  getSubs: async (params?: any) => {
    const response = await axiosConfigCore.get<BaseResponseDto<SubsType[]>>(
      "/subriptions",
      {
        params,
      }
    );
    return response.data;
  },
  payment: async (planId: number) => {
    const response = await axiosConfigCore.post<BaseResponseDto<any>>(
      `/payment/${planId}`
    );
    return response.data;
  },
};

export default PlanService;
