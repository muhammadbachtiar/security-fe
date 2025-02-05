/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseResponseDto, BaseResponsePaginate } from "@/types/response";
import { axiosConfigWms } from "@/configs/axios";
import { TRecipe } from "./recipe.type";

const RecipeService = {
  getAll: async (params: any) => {
    const response = await axiosConfigWms.get<BaseResponsePaginate<TRecipe[]>>(
      "/recipe",
      {
        params,
      }
    );
    return response.data;
  },
  create: async (payload: any) => {
    const response = await axiosConfigWms.post<BaseResponseDto<TRecipe>>(
      "/recipe",
      payload
    );
    return response.data;
  },
  update: async (recipeId: number, payload: any) => {
    const response = await axiosConfigWms.put<BaseResponseDto<TRecipe>>(
      `/recipe/${recipeId}`,
      payload
    );
    return response.data;
  },
  delete: async (recipeId: number) => {
    const response = await axiosConfigWms.delete<BaseResponseDto<TRecipe>>(
      `/recipe/${recipeId}`
    );
    return response.data;
  },
  getOne: async (recipeId: number, params?: any) => {
    const response = await axiosConfigWms.get<BaseResponseDto<TRecipe>>(
      `/recipe/${recipeId}`,
      {
        params,
      }
    );
    return response.data;
  },
};

export default RecipeService;
