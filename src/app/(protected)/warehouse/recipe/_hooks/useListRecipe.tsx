import { useQuery } from "@tanstack/react-query";
import { TableProps, Typography } from "antd";
import "moment/locale/id";
import RecipeService from "@/services/recipe/recipe.service";
import { TRecipe } from "@/services/recipe/recipe.type";
import { DeleteRecipe } from "../_components/delete-recipe";
import EditRecipe from "../_components/edit-recipe";

type Props = {
  page: number;
  limit: number;
};

function useListRecipe({ limit, page }: Props) {
  const { data: recipes, isLoading } = useQuery({
    queryKey: ["RECIPES", page, limit],
    queryFn: async () => {
      const response = await RecipeService.getAll({
        page_size: limit,
        page,
      });
      return response;
    },
    select(data) {
      return {
        ...data,
        data: data.data.map((rec, index) => ({
          ...rec,
          no: index + 1 + limit * page - limit,
        })),
      };
    },
  });

  const columns: TableProps<TRecipe>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "Jumlah",
      dataIndex: "jumlah",
      render: (value = "") => <p>{value}</p>,
    },
    {
      title: "Action",
      key: "",
      render: (value, record) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            <DeleteRecipe recipeId={record.id} />
            <EditRecipe recipeId={record.id} />
          </div>
        );
      },
    },
  ];
  return {
    columns,
    isLoading,
    recipes,
  };
}

export default useListRecipe;
