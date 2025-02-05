import { useQuery } from "@tanstack/react-query";
import { TableProps, Typography } from "antd";
import "moment/locale/id";
import PayrollService from "@/services/payroll/payroll.service";
import { TPayroll } from "@/services/payroll/payroll.type";
import { TStaff } from "@/services/staff/staff.type";
import "moment/locale/id";
import moment from "moment";
import { DeletePayroll } from "../_components/delete-payroll";
import EditPayroll from "../_components/edit-payroll";

type Props = {
  page: number;
  limit: number;
};

function useListPayroll({ limit, page }: Props) {
  const { data: payrolls, isLoading } = useQuery({
    queryKey: ["PAYROLLS", page, limit],
    queryFn: async () => {
      const response = await PayrollService.getAll({
        page_size: limit,
        page,
        with: "staff",
      });
      return response;
    },
    select(data) {
      return {
        ...data,
        data: data.data.map((pay, index) => ({
          ...pay,
          no: index + 1 + limit * page - limit,
        })),
      };
    },
  });

  const columns: TableProps<TPayroll>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "Staff",
      dataIndex: "staff",
      render: (value: TStaff) => <p>{value.nama}</p>,
    },
    {
      title: "Periode",
      dataIndex: "from",
      render: (value, record) => (
        <p>
          {moment(record.from).format("LL")} - {moment(record.to).format("LL")}
        </p>
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      render: (value = "") => <p>{value}</p>,
    },

    {
      title: "Action",
      key: "",
      render: (value, record) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            <EditPayroll payrollId={record.id} />
            <DeletePayroll payrollId={record.id} />
          </div>
        );
      },
    },
  ];
  return { columns, payrolls, isLoading };
}

export default useListPayroll;
