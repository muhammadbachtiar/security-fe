import { useQuery } from "@tanstack/react-query";
import { TableProps, Tag, Typography } from "antd";
import { DeleteLeave } from "../_components/delete-leave";
import { ActionLeave } from "../_components/action-leave";
import LeaveService from "@/services/leave/leave.service";
import { TLeave } from "@/services/leave/leave.type";
import { DialogText } from "@/components/common/dialog-text";
import moment from "moment";
import "moment/locale/id";
import usePermission from "@/hooks/use-permission";

type Props = {
  page: number;
  limit: number;
  status: string;
};

function useLeaveList({ limit, page, status }: Props) {
  const { checkPermission } = usePermission();
  const { data: leaves, isLoading } = useQuery({
    queryKey: ["LEAVES", page, limit, status],
    queryFn: async () => {
      const response = await LeaveService.getAll({
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
        data: data.data.map((leave, index) => ({
          ...leave,
          no: index + 1 + limit * page - limit,
        })),
      };
    },
  });

  const columns: TableProps<TLeave>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "Nama Staff",
      dataIndex: "staff",
      render: (value, record) => <p>{record.staff?.nama}</p>,
    },
    {
      title: "Divisi",
      dataIndex: "divisi",
      render: (value, record) => <p>{record.staff.divisi.name}</p>,
    },
    {
      title: "Tipe",
      dataIndex: "tipe",
      render: (value, record) => <p className="capitalize">{record.tipe}</p>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value = "") =>
        value.toLowerCase().startsWith("approve") ? (
          <Tag color="green" className="capitalize">
            Approved
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
      dataIndex: "jam",
      render: (value = "") => moment(value).utc(true).format("HH:mm"),
    },
    {
      title: "Tanggal",
      dataIndex: "tanggal",
      render: (value = "") => moment(value).format("LL"),
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
            {checkPermission(["update-leave"]) &&
              record.status === "pending" && (
                <>
                  <ActionLeave leaveId={record.id} status="approved" />
                  <ActionLeave leaveId={record.id} status="rejected" />
                </>
              )}
            {checkPermission(["delete-leave"]) && (
              <DeleteLeave leaveId={record.id} />
            )}
          </div>
        );
      },
    },
  ];
  return { columns, leaves, isLoading };
}

export default useLeaveList;
