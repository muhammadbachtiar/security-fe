/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { Button, TableProps, Tag, Typography } from "antd";
import { NetworkIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { DeleteDivision } from "../_components/delete-division";
import EditDivision from "../_components/edit-division";
import { ToggleShift } from "../_components/toggle-shift";
import DivisionService from "@/services/divisi/divisi.service";
import { TDivision } from "@/services/divisi/divisi.type";
import usePermission from "@/hooks/use-permission";

type Props = {
  page: number;
  limit: number;
};

function useListDivisi({ limit, page }: Props) {
  const { checkPermission } = usePermission();
  const router = useRouter();
  const { data: divisions, isLoading } = useQuery({
    queryKey: ["DIVISIONS", page, limit],
    queryFn: async () => {
      const response = await DivisionService.getAll({
        page_size: limit,
        page,
      });
      return response;
    },
    select(data) {
      return {
        ...data,
        data: data.data.map((divisi, index) => ({
          ...divisi,
          no: index + 1 + limit * page - limit,
        })),
      };
    },
  });

  const columns: TableProps<TDivision>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "Nama Divisi",
      dataIndex: "name",
      render: (value = "") => <p>{value}</p>,
    },
    ...(checkPermission(["update-division"])
      ? [
          {
            title: "Shift",
            dataIndex: "is_shift",
            render: (value: string, record: any) => (
              <ToggleShift divId={record.id} shift={record.is_shift} />
            ),
          },
        ]
      : []),
    {
      title: "Status",
      dataIndex: "division_id",
      render: (value = "") =>
        !value ? (
          <Tag color="orange">Parent</Tag>
        ) : (
          <Tag color="blue">Child</Tag>
        ),
    },

    {
      title: "Action",
      key: "",
      render: (value, record) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            {checkPermission(["update-division"]) && (
              <EditDivision divId={record.id} />
            )}
            {checkPermission(["delete-division"]) && (
              <DeleteDivision divId={record.id} />
            )}

            <Button
              className="w-full px-3 !text-blue-500"
              icon={<NetworkIcon className="w-5 h-5 !text-blue-500" />}
              type="text"
              onClick={() => router.push(`/human-resource/divisi/${record.id}`)}
            ></Button>
          </div>
        );
      },
    },
  ];
  return { columns, divisions, isLoading };
}

export default useListDivisi;
