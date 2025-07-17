import { useQuery } from "@tanstack/react-query";
import { Button, TableProps, Typography } from "antd";
import "moment/locale/id";
import { DeleteCustomer } from "../_components/delete-customer";
import { useRouter } from "next/navigation";
import { PencilIcon } from "lucide-react";
import CustomerService from "@/services/customer/customer.service";
import { TCustomer } from "@/services/customer/customer.type";

type Props = {
  page: number;
  limit: number;
};

function useListCustomer({ limit, page }: Props) {
  const router = useRouter();
  const { data: customers, isLoading } = useQuery({
    queryKey: ["CUSTOMERS", page, limit],
    queryFn: async () => {
      const response = await CustomerService.getAll({
        page_size: limit,
        page,
      });
      return response;
    },
    select(data) {
      return {
        ...data,
        data: data.data.map((cus, index) => ({
          ...cus,
          no: index + 1 + limit * page - limit,
        })),
      };
    },
  });

  const columns: TableProps<TCustomer>["columns"] = [
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
      title: "Alamat",
      dataIndex: "address",
      render: (value = "") => <p>{value}</p>,
    },
    {
      title: "Nomor Telepon",
      dataIndex: "mobile_phone",
      render: (value = "") => <p>{value}</p>,
    },
    {
      title: "Action",
      key: "",
      render: (value, record) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            <DeleteCustomer customerId={record.id} />
            <Button
              icon={<PencilIcon className="w-4 h-4 !text-orange-500" />}
              type="text"
              onClick={() =>
                router.push(`/warehouse/customer/${record.id}/edit`)
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
    customers,
  };
}

export default useListCustomer;
