import { formatCurrency } from "@/lib/utils";
import { TPayrollDetail } from "@/services/payroll/payroll.type";
import { Table, TableProps } from "antd";
import { DeletePayrollDetail } from "./delete-payroll-detail";
import usePermission from "@/hooks/use-permission";

function DetailPayrollTable({
  payrollDetail,
}: {
  payrollDetail: TPayrollDetail[];
}) {
  const { checkPermission } = usePermission();
  const columns: TableProps<TPayrollDetail>["columns"] = [
    {
      title: "Keterangan",
      dataIndex: "key",
      render: (value = "") => <p>{value}</p>,
    },
    {
      title: "Nilai",
      dataIndex: "value",
      render: (value = "") => <p>{formatCurrency(value)}</p>,
    },

    {
      title: "",
      key: "",
      render: (value, record) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            {checkPermission(["delete-payroll"]) && (
              <DeletePayrollDetail
                payrollId={record.payroll_id}
                detailId={record.id}
              />
            )}
          </div>
        );
      },
    },
  ];
  return (
    <div className="overflow-auto">
      <Table
        size="small"
        pagination={false}
        columns={columns}
        dataSource={payrollDetail}
      />
    </div>
  );
}

export default DetailPayrollTable;
