import { useQuery } from "@tanstack/react-query";
import { Button, TableProps, Tag, Typography } from "antd";
import "moment/locale/id";
import "moment/locale/id";
import KPIService from "@/services/kpi/kpi.service";
import { TKpiStaff } from "@/services/kpi/kpi.type";
import { DeleteKPIStaff } from "../_components/delete-kpi-staff";
import EditKpiStaff from "../_components/edit-kpi-staff";
import { EyeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { TStaff } from "@/services/staff/staff.type";

type Props = {
  page: number;
  limit: number;
};

function useListKpiStaff({ limit, page }: Props) {
  const router = useRouter();
  const { data: kpis, isLoading } = useQuery({
    queryKey: ["KPIS_STAFF", page, limit],
    queryFn: async () => {
      const response = await KPIService.getAllStaff({
        page_size: limit,
        page,
        with: "detail,staff",
      });
      return response;
    },
    select(data) {
      return {
        ...data,
        data: data.data.map((kpi, index) => ({
          ...kpi,
          no: index + 1 + limit * page - limit,
        })),
      };
    },
  });

  const columns: TableProps<TKpiStaff>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "Nama",
      dataIndex: "name",
      render: (value: string) => <p>{value}</p>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value: string) =>
        value.toLowerCase() === "active" ? (
          <Tag color="green" className="capitalize">
            Aktif
          </Tag>
        ) : (
          <Tag color="red" className="capitalize">
            Nonaktif
          </Tag>
        ),
    },
    {
      title: "Staff",
      dataIndex: "staff",
      render: (value: TStaff) => <p>{value.nama}</p>,
    },

    {
      title: "Action",
      key: "",
      render: (value, record) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            <Button
              icon={<EyeIcon className="w-4 h-4 !text-primary " />}
              type="text"
              onClick={() =>
                router.push(`/human-resource/kpi-staff/${record.id}`)
              }
            ></Button>
            <EditKpiStaff kpiId={record.id} />
            <DeleteKPIStaff kpiId={record.id} />
          </div>
        );
      },
    },
  ];
  return { columns, kpis, isLoading };
}

export default useListKpiStaff;
