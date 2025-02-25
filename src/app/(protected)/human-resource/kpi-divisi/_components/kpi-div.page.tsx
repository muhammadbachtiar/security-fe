"use client";
import { Table } from "antd";
import { useState } from "react";
import useListHoliday from "../_hooks/useListKpiDiv";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import AddKPIDivisi from "./add-kpi-div";

function PayrollPage() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const { columns, isLoading, kpis } = useListHoliday({
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
              title: "KPI Divisi",
              url: "#",
            },
          ]}
        />
      </div>

      <div className="bg-white p-4 rounded-lg space-y-4">
        <div className="border-b pb-3">
          <div className="flex justify-between">
            <p className="text-xl font-medium">KPI Divisi</p>
            <AddKPIDivisi />
          </div>
        </div>

        <div className="overflow-auto">
          <Table
            id="payroll-table"
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

export default PayrollPage;
