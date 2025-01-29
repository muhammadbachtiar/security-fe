import { useQuery } from "@tanstack/react-query";
import { TableProps, Typography } from "antd";
import "moment/locale/id";
import CategoryService from "@/services/category/category.service";
import { TCategory } from "@/services/category/category.type";
import { DeleteCategory } from "../_components/delete-category";
import EditCategory from "../_components/edit-category";

type Props = {
  page: number;
  limit: number;
  isProduct: boolean;
};

function useListCategory({ limit, page, isProduct }: Props) {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["CATEGORIES", page, limit],
    enabled: !isProduct,
    queryFn: async () => {
      const response = await CategoryService.getAll({
        page_size: limit,
        page,
      });
      return response;
    },
    select(data) {
      return {
        ...data,
        data: data.data.map((cat, index) => ({
          ...cat,
          no: index + 1 + limit * page - limit,
        })),
      };
    },
  });

  const { data: categoriesProduct, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["CATEGORIES_PRODUCT", page, limit],
    enabled: isProduct,
    queryFn: async () => {
      const response = await CategoryService.getAllProductCategory({
        page_size: limit,
        page,
      });
      return response;
    },
    select(data) {
      return {
        ...data,
        data: data.data.map((cat, index) => ({
          ...cat,
          no: index + 1 + limit * page - limit,
        })),
      };
    },
  });

  const columns: TableProps<TCategory>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "Nama",
      dataIndex: "name",
      render: (value = "") => <p>{value}</p>,
    },
    {
      title: "Kode",
      dataIndex: "code",
      render: (value = "") => <p>{value}</p>,
    },
    {
      title: "Action",
      key: "",
      render: (value, record) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            <EditCategory isProduct={isProduct} categoryId={record.id} />
            <DeleteCategory isProduct={isProduct} categoryId={record.id} />
          </div>
        );
      },
    },
  ];
  return {
    columns,
    categories,
    categoriesProduct,
    isLoading,
    isLoadingProduct,
  };
}

export default useListCategory;
