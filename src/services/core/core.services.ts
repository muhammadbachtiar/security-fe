/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseResponseDto, BaseResponsePaginate } from "@/types/response";
import { axiosConfigCore } from "@/configs/axios";
import { TPermission, TRole, TUser } from "./cose.type";

const CoreServices = {
  getAllUsers: async (params: any) => {
    const response = await axiosConfigCore.get<BaseResponsePaginate<TUser[]>>(
      "/user",
      {
        params,
      }
    );
    return response.data;
  },
  getAllRoles: async (params: any) => {
    const response = await axiosConfigCore.get<BaseResponsePaginate<TRole[]>>(
      "/roles",
      {
        params,
      }
    );
    return response.data;
  },
  getAllPermissions: async (params?: any) => {
    const response = await axiosConfigCore.get<
      BaseResponsePaginate<TPermission[]>
    >("/permission", {
      params,
    });
    return response.data;
  },
  createUser: async (payload: any) => {
    const response = await axiosConfigCore.post<BaseResponseDto<TUser>>(
      "/user",
      payload
    );
    return response.data;
  },
  createRole: async (payload: any) => {
    const response = await axiosConfigCore.post<BaseResponseDto<TRole>>(
      "/roles",
      payload
    );
    return response.data;
  },
  updateUser: async (userId: number, payload: any) => {
    const response = await axiosConfigCore.put<BaseResponseDto<TUser>>(
      `/user/${userId}`,
      payload
    );
    return response.data;
  },
  updateRole: async (roleId: number, payload: any) => {
    const response = await axiosConfigCore.put<BaseResponseDto<TRole>>(
      `/roles/${roleId}`,
      payload
    );
    return response.data;
  },
  deleteUser: async (userId: number) => {
    const response = await axiosConfigCore.delete<BaseResponseDto<TUser>>(
      `/user/${userId}`
    );
    return response.data;
  },
  deleteRole: async (roleId: number) => {
    const response = await axiosConfigCore.delete<BaseResponseDto<TRole>>(
      `/roles/${roleId}`
    );
    return response.data;
  },
  getOneUser: async (userId: number, params?: any) => {
    const response = await axiosConfigCore.get<BaseResponseDto<TUser>>(
      `/user/${userId}`,
      {
        params,
      }
    );
    return response.data;
  },
  getOneRole: async (roleId: number, params?: any) => {
    const response = await axiosConfigCore.get<BaseResponseDto<TRole>>(
      `/roles/${roleId}`,
      {
        params,
      }
    );
    return response.data;
  },
};

export default CoreServices;
