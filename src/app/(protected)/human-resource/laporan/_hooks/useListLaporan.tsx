import StaffService from "@/services/staff/staff.service";
import { TStaff } from "@/services/staff/staff.type";
import { useQuery } from "@tanstack/react-query";
import { TableProps, Typography } from "antd";

type Props = {
  page: number;
  limit: number;
  from: string;
  to: string;
};

function useListLaporan({ limit, page, from, to }: Props) {
  const { data: staffs, isLoading } = useQuery({
    queryKey: ["STAFFS_REPORT", page, limit, from, to],
    queryFn: async () => {
      const response = await StaffService.getAll({
        page_size: limit,
        page,
        from,
        to,
        absence: true,
        total_absen: true,
        total_leave: true,
        total_hour: true,
        total_overtime: true,
        total_overtime_hour: true,
        total_permit: true,
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
      title: "Jumlah Absen",
      dataIndex: "absences_count",
      render: (value = "") => <p>{value || 0}</p>,
    },
    {
      title: "Total Jam Kerja",
      dataIndex: "absences_sum_hours",
      render: (value = "") => <p>{value || 0} Jam</p>,
    },
    {
      title: "Jumlah Lembur",
      dataIndex: "overtime_count",
      render: (value = "") => <p>{value || 0}</p>,
    },
    {
      title: "Total Jam Lembur",
      dataIndex: "overtime_sum_hours",
      render: (value = "") => <p>{value || 0} Jam</p>,
    },
    {
      title: "Total Izin",
      dataIndex: "permit_count",
      render: (value = "") => <p>{value || 0}</p>,
    },
    {
      title: "Total Cuti",
      dataIndex: "leave_count",
      render: (value = "") => <p>{value || 0}</p>,
    },
  ];
  return { columns, staffs, isLoading };
}

export default useListLaporan;
