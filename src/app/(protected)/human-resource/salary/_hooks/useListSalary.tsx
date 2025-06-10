import { useQuery } from "@tanstack/react-query";
import { TableProps, Typography } from "antd";
import StaffService from "@/services/staff/staff.service";
import { TStaff } from "@/services/staff/staff.type";
import { DetailSalary } from "../_components/detail-salary";

type Props = {
  page: number;
  limit: number;
  from: string;
  to: string;
};

function useListSalary({ limit, page, from, to }: Props) {
  const { data: staffs, isLoading } = useQuery({
    queryKey: ["STAFFS", page, limit, from, to],
    queryFn: async () => {
      const response = await StaffService.getAll({
        page_size: limit,
        page,
        with: "divisi",
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
      title: "Divisi",
      dataIndex: "divisi",
      render: (value, record) => <p>{record.divisi.name}</p>,
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
            <DetailSalary staffId={record.id} from={from} to={to} />
          </div>
        );
      },
    },
  ];
  return { columns, staffs, isLoading };
}

export default useListSalary;
