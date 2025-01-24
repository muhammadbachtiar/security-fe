import axiosConfig from "@/configs/axios";
import { BaseResponseDto } from "@/types/response";
import { LoginResponseDto, UserType } from "./auth.dto";

const AuthService = {
  me: async (params: { with?: string }) => {
    const response = await axiosConfig.get<BaseResponseDto<UserType>>("/auth", {
      params,
    });
    return response.data;
  },
  login: async (payload: { username: string; password: string }) => {
    const response = await axiosConfig.post<BaseResponseDto<LoginResponseDto>>(
      "/login",
      payload
    );
    return response.data;
  },
};

export default AuthService;
