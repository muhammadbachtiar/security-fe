import { useQuery } from "@tanstack/react-query";
import { Button, TableProps, Typography } from "antd";
import CoreServices from "@/services/core/core.services";
import { TUser } from "@/services/core/cose.type";
import { useRouter } from "next/navigation";
import { PencilIcon } from "lucide-react";
import { DeleteUser } from "../_components/delete-user";

type Props = {
  page: number;
  limit: number;
};

function useListUser({ limit, page }: Props) {
  const router = useRouter();
  const { data: users, isLoading } = useQuery({
    queryKey: ["USERS", page, limit],
    queryFn: async () => {
      const response = await CoreServices.getAllUsers({
        page_size: limit,
        page,
      });
      return response;
    },
    select(data) {
      return {
        ...data,
        data: data.data.map((user, index) => ({
          ...user,
          no: index + 1 + limit * page - limit,
        })),
      };
    },
  });

  const columns: TableProps<TUser>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "Username",
      dataIndex: "username",
      render: (value = "") => <p>{value}</p>,
    },

    {
      title: "Action",
      key: "",
      render: (value, record) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            <DeleteUser userId={record.id} />
            <Button
              onClick={() => router.push(`/core/users/${record.id}/edit`)}
              icon={<PencilIcon className="w-4 h-4 !text-orange-500" />}
              type="text"
            ></Button>
          </div>
        );
      },
    },
  ];
  return { columns, users, isLoading };
}

export default useListUser;
