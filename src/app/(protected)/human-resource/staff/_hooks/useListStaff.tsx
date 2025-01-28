import { useQuery } from "@tanstack/react-query";
import { Button, TableProps, Typography } from "antd";
import { PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { DeleteStaff } from "../_components/delete-staff";
import StaffService from "@/services/staff/staff.service";
import { TStaff } from "@/services/staff/staff.type";

type Props = {
  page: number;
  limit: number;
};

function useListStaff({ limit, page }: Props) {
  const router = useRouter();
  const { data: staffs, isLoading } = useQuery({
    queryKey: ["STAFFS", page, limit],
    queryFn: async () => {
      const response = await StaffService.getAll({
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

  const columns: TableProps<TStaff>["columns"] = [
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
      title: "NIP",
      dataIndex: "nip",
      render: (value = "") => <p>{value}</p>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value = "") => <p className="capitalize">{value}</p>,
    },

    {
      title: "Action",
      key: "",
      render: (value, record) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            <Button
              onClick={() =>
                router.push(`/human-resource/staff/${record.id}/edit`)
              }
              icon={<PencilIcon className="w-4 h-4 !text-orange-500" />}
              type="text"
            ></Button>
            <DeleteStaff staffId={record.id} />
          </div>
        );
      },
    },
  ];
  return { columns, staffs, isLoading };
}

export default useListStaff;
