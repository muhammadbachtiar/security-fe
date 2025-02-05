import { useQuery } from "@tanstack/react-query";
import { TableProps, Typography } from "antd";
import "moment/locale/id";
import { DeleteProduct } from "../_components/delete-product";
import ProductService from "@/services/product/product.service";
import { TProduct } from "@/services/product/product.type";
import EditProduct from "../_components/edit-product";

type Props = {
  page: number;
  limit: number;
};

function useListProduct({ limit, page }: Props) {
  const { data: products, isLoading } = useQuery({
    queryKey: ["PRODUCTS", page, limit],
    queryFn: async () => {
      const response = await ProductService.getAll({
        page_size: limit,
        page,
      });
      return response;
    },
    select(data) {
      return {
        ...data,
        data: data.data.map((prod, index) => ({
          ...prod,
          no: index + 1 + limit * page - limit,
        })),
      };
    },
  });

  const columns: TableProps<TProduct>["columns"] = [
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
      title: "SKU",
      dataIndex: "sku",
      render: (value = "") => <p>{value}</p>,
    },
    {
      title: "Action",
      key: "",
      render: (value, record) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            <DeleteProduct productId={record.id} />
            <EditProduct productId={record.id} />
          </div>
        );
      },
    },
  ];
  return {
    columns,
    isLoading,
    products,
  };
}

export default useListProduct;
