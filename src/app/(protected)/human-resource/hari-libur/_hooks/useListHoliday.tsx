import { useQuery } from "@tanstack/react-query";
import { TableProps, Typography } from "antd";
import EditHoliday from "../_components/edit-holiday";
import { DeleteHoliday } from "../_components/delete-holiday";
import moment from "moment";
import "moment/locale/id";
import HolidayService from "@/services/holiday/holiday.service";
import { THoliday } from "@/services/holiday/holiday";
import usePermission from "@/hooks/use-permission";

type Props = {
  page: number;
  limit: number;
};

function useListHoliday({ limit, page }: Props) {
  const { checkPermission } = usePermission();
  const { data: holidays, isLoading } = useQuery({
    queryKey: ["HOLIDAYS", page, limit],
    queryFn: async () => {
      const response = await HolidayService.getAll({
        page_size: limit,
        page,
      });
      return response;
    },
    select(data) {
      return {
        ...data,
        data: data.data.map((holiday, index) => ({
          ...holiday,
          no: index + 1 + limit * page - limit,
        })),
      };
    },
  });

  const columns: TableProps<THoliday>["columns"] = [
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
      title: "Deskripsi",
      dataIndex: "description",
      render: (value = "") => <p>{value || "-"}</p>,
    },
    {
      title: "Tanggal",
      dataIndex: "date",
      render: (value = "") => <p>{moment(new Date(value)).format("LL")}</p>,
    },

    {
      title: "Action",
      key: "",
      render: (value, record) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            {checkPermission(["update-hari-libur"]) && (
              <EditHoliday holidayId={record.id} />
            )}
            {checkPermission(["delete-hari-libur"]) && (
              <DeleteHoliday holidayId={record.id} />
            )}
          </div>
        );
      },
    },
  ];
  return { columns, holidays, isLoading };
}

export default useListHoliday;
