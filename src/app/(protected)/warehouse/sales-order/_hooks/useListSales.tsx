import { useQuery } from "@tanstack/react-query";
import { Button, TableProps, Typography } from "antd";
import "moment/locale/id";
import { DeleteSales } from "../_components/delete-sales";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import SalesOrderService from "@/services/sales-order/sales.service";
import { TSales } from "@/services/sales-order/sales.type";

type Props = {
  page: number;
  limit: number;
};

function useListSales({ limit, page }: Props) {
  const router = useRouter();
  const { data: sales, isLoading } = useQuery({
    queryKey: ["SALESES", page, limit],
    queryFn: async () => {
      const response = await SalesOrderService.getAll({
        page_size: limit,
        page,
      });
      return response;
    },
    select(data) {
      return {
        ...data,
        data: data.data.map((po, index) => ({
          ...po,
          no: index + 1 + limit * page - limit,
        })),
      };
    },
  });

  const columns: TableProps<TSales>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
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
            <DeleteSales salesId={record.id} />
            <Button
              className="w-full px-3 !text-blue-500"
              icon={<Edit className="w-5 h-5 !text-blue-500" />}
              type="text"
              onClick={() =>
                router.push(`/warehouse/sales-order/${record.id}/edit`)
              }
            ></Button>
          </div>
        );
      },
    },
  ];
  return {
    columns,
    isLoading,
    sales,
  };
}

export default useListSales;
