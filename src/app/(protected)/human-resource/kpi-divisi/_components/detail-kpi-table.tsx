import { Table, TableProps } from "antd";
import { TKpiDivDetail } from "@/services/kpi/kpi.type";
import { DeleteKpiDivDetail } from "./delete-kpi-div-detail";

function DetailKpiDivTable({ kpiDetail }: { kpiDetail: TKpiDivDetail[] }) {
  const columns: TableProps<TKpiDivDetail>["columns"] = [
    {
      title: "Keterangan",
      dataIndex: "key",
      render: (value = "") => <p>{value}</p>,
    },
    {
      title: "Nilai",
      dataIndex: "value",
      render: (value = "") => <p>{value}</p>,
    },

    {
      title: "",
      key: "",
      render: (value, record) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            <DeleteKpiDivDetail kpiId={record.kpi_id} detailId={record.id} />
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

export default DetailKpiDivTable;
