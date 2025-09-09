/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseResponseDto, BaseResponsePaginate } from "@/types/response";
import axiosConfig from "@/configs/axios";
import { TAnalyze, TSecurityScan } from "./security.type";

const SecurityService = {
    getAll: async (tenant: string, params: any = {}) => {
        if (!tenant) return null;
        const response = await axiosConfig.get<BaseResponsePaginate<TSecurityScan[]>>(
            `/${tenant}/scans/latest`,
            {
                params,
            }
        );
        return response.data;
    },
    getOne: async (tenant: string, id: string, params: any = {}) => {
        if (!tenant || !id) return null;
        const response = await axiosConfig.get<{scan: TSecurityScan, analysis: TAnalyze}>(
            `/${tenant}/scans/${id}`,
            {
                params,
            }
        );
        console.log("Response getOne:", response);
        return response.data;
    },
    create: async (tenant: string, payload: any) => {
        if (!tenant) return null;
        const response = await axiosConfig.post<BaseResponseDto<TSecurityScan>>(
            `/${tenant}/webhook/security-scan`,
            payload
        );
        return response.data;
    },
     analayze: async (tenant: string, payload: any) => {
        if (!tenant) return null;
        const response = await axiosConfig.post<BaseResponseDto<TSecurityScan>>(
            `/${tenant}/ai/analyze`,
            payload
        );
        return response.data;
    },
};

export default SecurityService;
