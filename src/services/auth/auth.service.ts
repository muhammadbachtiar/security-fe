import axiosConfig, { axiosConfigCore, axiosConfigWms } from "@/configs/axios";
import { BaseResponseDto } from "@/types/response";
import { LoginResponseDto, UserType } from "./auth.dto";

const AuthService = {
  me: async (params?: { with?: string }) => {
    const response = await axiosConfigCore.get<BaseResponseDto<UserType>>(
      "/auth",
      {
        params,
      }
    );
    return response.data;
  },
  loginHrd: async (payload: { username: string; password: string }) => {
    const response = await axiosConfig.post<BaseResponseDto<LoginResponseDto>>(
      "/login",
      payload
    );
    return response.data;
  },
  loginWms: async (payload: { username: string; password: string }) => {
    const response = await axiosConfigWms.post<
      BaseResponseDto<LoginResponseDto>
    >("/login", payload);
    return response.data;
  },
  loginCore: async (payload: { username: string; password: string }) => {
    const response = await axiosConfigCore.post<
      BaseResponseDto<LoginResponseDto>
    >("/login", payload);
    return response.data;
  },
};

export default AuthService;
