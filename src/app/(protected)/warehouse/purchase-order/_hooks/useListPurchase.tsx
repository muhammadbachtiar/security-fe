import { useQuery } from "@tanstack/react-query";
import { Button, TableProps, Typography } from "antd";
import "moment/locale/id";
import PurchaseService from "@/services/purchase-order/purchase.service";
import { TPurchase } from "@/services/purchase-order/purchase.type";
import { DeletePurchase } from "../_components/delete-purchase";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  page: number;
  limit: number;
};

function useListPurchase({ limit, page }: Props) {
  const router = useRouter();
  const { data: purchases, isLoading } = useQuery({
    queryKey: ["PURCHASES", page, limit],
    queryFn: async () => {
      const response = await PurchaseService.getAll({
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

  const columns: TableProps<TPurchase>["columns"] = [
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
            <DeletePurchase purchaseId={record.id} />
            <Button
              className="w-full px-3 !text-blue-500"
              icon={<Edit className="w-5 h-5 !text-blue-500" />}
              type="text"
              onClick={() =>
                router.push(`/warehouse/purchase-order/${record.id}/edit`)
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
    purchases,
  };
}

export default useListPurchase;
