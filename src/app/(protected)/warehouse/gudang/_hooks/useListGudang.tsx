import { useQuery } from "@tanstack/react-query";
import { Button, TableProps, Typography } from "antd";
import "moment/locale/id";
import { DeleteGudang } from "../_components/delete-gudang";
import GudangService from "@/services/gudang/gudang.service";
import { TGudang } from "@/services/gudang/gudang.type";
import { useRouter } from "next/navigation";
import { EyeIcon, PencilIcon } from "lucide-react";

type Props = {
  page: number;
  limit: number;
};

function useListGudang({ limit, page }: Props) {
  const router = useRouter();
  const { data: gudang, isLoading } = useQuery({
    queryKey: ["WAREHOUSES", page, limit],
    queryFn: async () => {
      const response = await GudangService.getAll({
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

  const columns: TableProps<TGudang>["columns"] = [
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
            <DeleteGudang gudangId={record.id} />
            <Button
              icon={<PencilIcon className="w-4 h-4 !text-orange-500" />}
              type="text"
              onClick={() => router.push(`/warehouse/gudang/${record.id}/edit`)}
            ></Button>
            <Button
              icon={<EyeIcon className="w-4 h-4 !text-blue-500" />}
              type="text"
              onClick={() => router.push(`/warehouse/gudang/${record.id}`)}
            ></Button>
          </div>
        );
      },
    },
  ];
  return {
    columns,
    isLoading,
    gudang,
  };
}

export default useListGudang;
