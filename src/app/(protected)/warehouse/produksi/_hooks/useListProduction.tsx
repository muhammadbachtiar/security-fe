import { useQuery } from "@tanstack/react-query";
import { TableProps, Typography } from "antd";
import "moment/locale/id";
import { DeleteProduct } from "../_components/delete-production";
import GudangService from "@/services/gudang/gudang.service";
import { TProduction } from "@/services/gudang/gudang.type";
import EditProduction from "../_components/edit-production";

type Props = {
  page: number;
  limit: number;
};

function useListProduction({ limit, page }: Props) {
  const { data: products, isLoading } = useQuery({
    queryKey: ["PRODUCTIONS", page, limit],
    queryFn: async () => {
      const response = await GudangService.getProduction({
        page_size: limit,
        page,
        with: "product",
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

  const columns: TableProps<TProduction>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "Nama",
      dataIndex: "nama",
      render: (value = "") => <p>{value}</p>,
    },
    // {
    //   title: "Gudang",
    //   dataIndex: "gudang",
    //   render: (value, record) => <p>{record.gudang.nama}</p>,
    // },
    {
      title: "Produk",
      dataIndex: "product",
      render: (value, record) => <p>{record.product.name}</p>,
    },
    {
      title: "Jumlah",
      dataIndex: "jumlah",
      render: (value) => <p>{value}</p>,
    },
    {
      title: "Action",
      key: "",
      render: (value, record) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            <DeleteProduct productId={record.id} />
            <EditProduction prodId={record.id} />
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

export default useListProduction;
