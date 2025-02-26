import { Table, TableProps } from "antd";
import { TKpiDivDetail, TKpiStaffDetail } from "@/services/kpi/kpi.type";
import { DeleteKpiStaffDetail } from "./delete-kpi-staff-detail";
import { isPercent } from "@/lib/utils";

function DetailKpiStaffTable({ kpiDetail }: { kpiDetail: TKpiStaffDetail[] }) {
  const columns: TableProps<TKpiDivDetail>["columns"] = [
    {
      title: "Keterangan",
      dataIndex: "key",
      render: (value = "") => <p>{value}</p>,
    },
    {
      title: "Nilai",
      dataIndex: "value",
      render: (value = "") => (
        <p>{isPercent(value) ? `${value * 100}%` : value}</p>
      ),
    },

    {
      title: "",
      key: "",
      render: (value, record) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            <DeleteKpiStaffDetail kpiId={record.kpi_id} detailId={record.id} />
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
        dataSource={kpiDetail}
      />
    </div>
  );
}

export default DetailKpiStaffTable;
