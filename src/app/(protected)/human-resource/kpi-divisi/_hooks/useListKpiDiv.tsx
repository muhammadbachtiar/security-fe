import { useQuery } from "@tanstack/react-query";
import { Button, TableProps, Tag, Typography } from "antd";
import "moment/locale/id";
import "moment/locale/id";
import KPIService from "@/services/kpi/kpi.service";
import { TKpiDiv } from "@/services/kpi/kpi.type";
import { TDivision } from "@/services/divisi/divisi.type";
import { DeleteKPIDiv } from "../_components/delete-kpi-div";
import EditKpiDiv from "../_components/edit-kpi-div";
import { EyeIcon } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  page: number;
  limit: number;
};

function useListKpiDiv({ limit, page }: Props) {
  const router = useRouter();
  const { data: kpis, isLoading } = useQuery({
    queryKey: ["KPIS_DIV", page, limit],
    queryFn: async () => {
      const response = await KPIService.getAll({
        page_size: limit,
        page,
        with: "detail,division",
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

  const columns: TableProps<TKpiDiv>["columns"] = [
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
      title: "Divisi",
      dataIndex: "division",
      render: (value: TDivision) => <p>{value.name}</p>,
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
                router.push(`/human-resource/kpi-divisi/${record.id}`)
              }
            ></Button>
            <EditKpiDiv kpiId={record.id} />
            <DeleteKPIDiv kpiId={record.id} />
          </div>
        );
      },
    },
  ];
  return { columns, kpis, isLoading };
}

export default useListKpiDiv;
