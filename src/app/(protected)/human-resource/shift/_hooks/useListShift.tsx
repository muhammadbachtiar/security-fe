import { useQuery } from "@tanstack/react-query";
import { TableProps, Typography } from "antd";
import EditShift from "../_components/edit-shift";
import { DeleteShift } from "../_components/delete-shift";
import ShiftService from "@/services/shift/shift.service";
import { TShift } from "@/services/shift/shift.type";
import moment from "moment";
import usePermission from "@/hooks/use-permission";

type Props = {
  page: number;
  limit: number;
};

function useListShift({ limit, page }: Props) {
  const { checkPermission } = usePermission();
  const { data: shifts, isLoading } = useQuery({
    queryKey: ["SHIFTS", page, limit],
    queryFn: async () => {
      const response = await ShiftService.getAll({
        page_size: limit,
        page,
      });
      return response;
    },
    select(data) {
      return {
        ...data,
        data: data.data.map((shift, index) => ({
          ...shift,
          no: index + 1 + limit * page - limit,
        })),
      };
    },
  });

  const columns: TableProps<TShift>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "Shift",
      dataIndex: "nama",
      render: (value = "") => <p>{value}</p>,
    },
    {
      title: "Jam Masuk",
      dataIndex: "jam_masuk",
      render: (value = "") => moment(value).utc().utcOffset(7).format("HH:mm"),
    },
    {
      title: "Jam Keluar",
      dataIndex: "jam_keluar",
      render: (value = "") => moment(value).utc().utcOffset(7).format("HH:mm"),
    },
    {
      title: "Action",
      key: "",
      render: (value, record) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            {checkPermission(["update-shift"]) && (
              <EditShift shiftId={record.id} />
            )}
            {checkPermission(["delete-shift"]) && (
              <DeleteShift shiftId={record.id} />
            )}
          </div>
        );
      },
    },
  ];
  return { columns, shifts, isLoading };
}

export default useListShift;
