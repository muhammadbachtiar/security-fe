"use client";
import { Table } from "antd";
import { useState } from "react";
import useListKpiStaff from "../_hooks/useListKpiStaff";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import AddKPIStaff from "./add-kpi-staff";
// import AddKPIDivisi from "./add-kpi-div";

function KpiStaffPage() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const { columns, isLoading, kpis } = useListKpiStaff({
    limit: pagination.pageSize,
    page: pagination.page,
  });

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <AppBreadcrumbs
          items={[
            {
              title: "Home",
              url: "/",
            },
            {
              title: "KPI Staff",
              url: "#",
            },
          ]}
        />
      </div>

      <div className="bg-white p-4 rounded-lg space-y-4">
        <div className="border-b pb-3">
          <div className="flex justify-between">
            <p className="text-xl font-medium">KPI Staff</p>
            <AddKPIStaff />
          </div>
        </div>

        <div className="overflow-auto">
          <Table
            id="kpi-table"
            columns={columns}
            dataSource={kpis?.data}
            loading={isLoading}
            pagination={{
              onChange: (page, pageSize) => {
                setPagination({ page, pageSize });
              },
              total: kpis?.meta.total,
              pageSize: pagination.pageSize,
              current: pagination.page,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default KpiStaffPage;
