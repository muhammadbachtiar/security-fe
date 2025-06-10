import { useQuery } from "@tanstack/react-query";
import { TableProps, Tag, Typography } from "antd";
import { DeleteOvertime } from "../_components/delete-overtime";
import { ActionOvertime } from "../_components/action-overtime";
import moment from "moment";
import "moment/locale/id";
import OvertimeService from "@/services/overtime/overtime.service";
import { TOvertime } from "@/services/overtime/overtime.type";
import { DialogText } from "@/components/common/dialog-text";
import usePermission from "@/hooks/use-permission";

type Props = {
  page: number;
  limit: number;
  status: string;
};

function useLeaveList({ limit, page, status }: Props) {
  const { checkPermission } = usePermission();
  const { data: overtimes, isLoading } = useQuery({
    queryKey: ["OVERTIMES", page, limit, status],
    queryFn: async () => {
      const response = await OvertimeService.getAll({
        page_size: limit,
        page,
        with: "staff.divisi",
        ...(status && { status }),
      });
      return response;
    },
    select(data) {
      return {
        ...data,
        data: data.data.map((ovt, index) => ({
          ...ovt,
          no: index + 1 + limit * page - limit,
        })),
      };
    },
  });

  const columns: TableProps<TOvertime>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "Nama Staff",
      dataIndex: "staff",
      render: (value, record) => <p>{record?.staff?.nama}</p>,
    },
    {
      title: "Divisi",
      dataIndex: "divisi",
      render: (value, record) => <p>{record.staff.divisi.name}</p>,
    },
    {
      title: "Tipe",
      dataIndex: "tanggal",
      render: (value, record) => (
        <p className="capitalize">{moment(record.tanggal).format("LL")}</p>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value = "") =>
        value.toLowerCase().startsWith("approve") ? (
          <Tag color="green" className="capitalize">
            {value}
          </Tag>
        ) : value.toLowerCase() === "pending" ? (
          <Tag color="orange" className="capitalize">
            {value}
          </Tag>
        ) : (
          <Tag color="red" className="capitalize">
            {value}
          </Tag>
        ),
    },
    {
      title: "Jam",
      dataIndex: "jam_mulai",
      render: (value, record) => (
        <p className="capitalize">
          {moment(value).utc().format("HH:mm")} -{" "}
          {moment(record.jam_selesai).utc().format("HH:mm")}
        </p>
      ),
    },
    {
      title: "Alasan",
      dataIndex: "alasan",
      render: (value = "") => (
        <DialogText content={value} textButton="Lihat Alasan" title="Alasan" />
      ),
    },

    {
      title: "Action",
      key: "",
      render: (value, record) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            {checkPermission(["update-overtime"]) &&
              record.status === "pending" && (
                <>
                  <ActionOvertime ovtId={record.id} status="approved" />
                  <ActionOvertime ovtId={record.id} status="rejected" />
                </>
              )}
            {checkPermission(["delete-overtime"]) && (
              <DeleteOvertime ovtId={record.id} />
            )}
          </div>
        );
      },
    },
  ];
  return { columns, overtimes, isLoading };
}

export default useLeaveList;
