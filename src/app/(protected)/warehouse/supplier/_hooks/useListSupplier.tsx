import { useQuery } from "@tanstack/react-query";
import { TableProps, Typography } from "antd";
import "moment/locale/id";
import { DeleteSupplier } from "../_components/delete-supplier";
import EditSupplier from "../_components/edit-supplier";
import SupplierService from "@/services/supplier/supplier.service";
import { TSupplier } from "@/services/supplier/supplier.type";

type Props = {
  page: number;
  limit: number;
};

function useListSupplier({ limit, page }: Props) {
  const { data: suppliers, isLoading } = useQuery({
    queryKey: ["SUPPLIERS", page, limit],
    queryFn: async () => {
      const response = await SupplierService.getAll({
        page_size: limit,
        page,
      });
      return response;
    },
    select(data) {
      return {
        ...data,
        data: data.data.map((sup, index) => ({
          ...sup,
          no: index + 1 + limit * page - limit,
        })),
      };
    },
  });

  const columns: TableProps<TSupplier>["columns"] = [
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
    {
      title: "Alamat",
      dataIndex: "alamat",
      render: (value = "") => <p>{value}</p>,
    },
    {
      title: "Action",
      key: "",
      render: (value, record) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            <DeleteSupplier supplierId={record.id} />
            <EditSupplier supplierId={record.id} />
          </div>
        );
      },
    },
  ];
  return {
    columns,
    isLoading,
    suppliers,
  };
}

export default useListSupplier;
