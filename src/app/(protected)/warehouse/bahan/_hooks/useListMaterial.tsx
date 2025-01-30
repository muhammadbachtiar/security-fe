import { useQuery } from "@tanstack/react-query";
import { TableProps, Typography } from "antd";
import "moment/locale/id";
import { DeleteMaterial } from "../_components/delete-material";
import { TMaterial } from "@/services/material/material.type";
import MaterialService from "@/services/material/material.service";
import EditMaterial from "../_components/edit-material";

type Props = {
  page: number;
  limit: number;
};

function useListMaterial({ limit, page }: Props) {
  const { data: materials, isLoading } = useQuery({
    queryKey: ["MATERIALS", page, limit],
    queryFn: async () => {
      const response = await MaterialService.getAll({
        page_size: limit,
        page,
      });
      return response;
    },
    select(data) {
      return {
        ...data,
        data: data.data.map((mat, index) => ({
          ...mat,
          no: index + 1 + limit * page - limit,
        })),
      };
    },
  });

  const columns: TableProps<TMaterial>["columns"] = [
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
            <DeleteMaterial materialId={record.id} />
            <EditMaterial materialId={record.id} />
          </div>
        );
      },
    },
  ];
  return {
    columns,
    isLoading,
    materials,
  };
}

export default useListMaterial;
