import { useQuery } from "@tanstack/react-query";
import { Button, TableProps, Tag, Typography } from "antd";
import moment from "moment";
import "moment/locale/id";
import { EyeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import AbsenceService from "@/services/absence/absence.service";
import { TAbsence } from "@/services/absence/absence.type";
import EditAbsensi from "../_components/edit-absensi";

type Props = {
  page: number;
  limit: number;
  from: string;
  to: string;
};

function useListAbsence({ limit, page, from, to }: Props) {
  const router = useRouter();
  const { data: absences, isLoading } = useQuery({
    queryKey: ["ABSENCES", page, limit, from, to],
    queryFn: async () => {
      const response = await AbsenceService.getAll({
        page_size: limit,
        page,
        from,
        to,
        order: "desc",
        by: "created_at",
        with: "staff,shift",
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

  const columns: TableProps<TAbsence>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "Nama Staff",
      dataIndex: "staff",
      render: (value, record) => <p>{record.staff.nama}</p>,
    },
    {
      title: "Tanggal",
      dataIndex: "tanggal",
      render: (value, record) => (
        <p className="capitalize">{moment(record.tanggal).format("LL")}</p>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value = "") =>
        value.toLowerCase() === "masuk" ? (
          <Tag color="green" className="capitalize">
            {value}
          </Tag>
        ) : value.toLowerCase() === "pulang" ? (
          <Tag color="orange" className="capitalize">
            {value}
          </Tag>
        ) : value.toLowerCase() === "ijin" ? (
          <Tag color="purple" className="capitalize">
            {value}
          </Tag>
        ) : (
          <Tag color="red" className="capitalize">
            Terlambat
          </Tag>
        ),
    },
    // {
    //   title: "Telat",
    //   dataIndex: "telat",
    //   render: (value = "") =>
    //     value.toLowerCase() === "masuk" ? (
    //       <Tag color="green" className="capitalize">
    //         {value}
    //       </Tag>
    //     ) : value.toLowerCase() === "pulang" ? (
    //       <Tag color="orange" className="capitalize">
    //         {value}
    //       </Tag>
    //     ) : (
    //       <Tag color="red" className="capitalize">
    //         Terlambat
    //       </Tag>
    //     ),
    // },
    {
      title: "Jam Masuk",
      dataIndex: "masuk",
      render: (value, record) => (
        <p className="capitalize">{moment(record.masuk).format("HH:mm")}</p>
      ),
    },
    {
      title: "Jam Keluar",
      dataIndex: "keluar",
      render: (value, record) => (
        <p className="capitalize">
          {record.keluar ? moment(record.keluar).format("HH:mm") : "-"}
        </p>
      ),
    },
    {
      title: "Shift",
      dataIndex: "shift",
      render: (value, record) => (
        <div className="capitalize">
          <p>{record.shift.nama}</p>
          <p>
            ({moment(record.shift.jam_masuk).format("HH:mm")} -{" "}
            {moment(record.shift.jam_keluar).format("HH:mm")})
          </p>
        </div>
      ),
    },
    {
      title: "Absence By",
      dataIndex: "by",
      render: (value) =>
        value ? (
          <Tag color="green" className="capitalize">
            Admin
          </Tag>
        ) : (
          <Tag color="purple" className="capitalize">
            Staff
          </Tag>
        ),
    },
    {
      title: "Action",
      key: "",
      render: (value, record) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            <EditAbsensi absenceId={record.id} />
            <Button
              icon={<EyeIcon className="w-4 h-4 !text-primary " />}
              type="text"
              onClick={() =>
                router.push(`/human-resource/absensi/${record.id}`)
              }
            ></Button>
          </div>
        );
      },
    },
  ];
  return { columns, absences, isLoading };
}

export default useListAbsence;
