import { useQuery } from "@tanstack/react-query";
import { Button, TableProps, Typography } from "antd";
import CoreServices from "@/services/core/core.services";
import { TRole } from "@/services/core/cose.type";
import { DeleteRole } from "../_components/delete-role";
import { useRouter } from "next/navigation";
import { PencilIcon } from "lucide-react";

type Props = {
  page: number;
  limit: number;
};

function useListRoles({ limit, page }: Props) {
  const router = useRouter();
  const { data: roles, isLoading } = useQuery({
    queryKey: ["ROLES", page, limit],
    queryFn: async () => {
      const response = await CoreServices.getAllRoles({
        page_size: limit,
        page,
      });
      return response;
    },
    select(data) {
      return {
        ...data,
        data: data.data.map((staff, index) => ({
          ...staff,
          no: index + 1 + limit * page - limit,
        })),
      };
    },
  });

  const columns: TableProps<TRole>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "Nama Role",
      dataIndex: "name",
      render: (value = "") => <p>{value}</p>,
    },

    {
      title: "Action",
      key: "",
      render: (value, record) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            <DeleteRole roleId={record.id} />
            <Button
              onClick={() => router.push(`/core/roles/${record.id}/edit`)}
              icon={<PencilIcon className="w-4 h-4 !text-orange-500" />}
              type="text"
            ></Button>
          </div>
        );
      },
    },
  ];
  return { columns, roles, isLoading };
}

export default useListRoles;
