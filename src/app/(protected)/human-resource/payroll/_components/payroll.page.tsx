"use client";
import { Table } from "antd";
import { useState } from "react";
import useListHoliday from "../_hooks/useListPayroll";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import AddPayroll from "./add-payroll";
import usePermission from "@/hooks/use-permission";

function PayrollPage() {
  const { checkPermission } = usePermission();
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const { columns, isLoading, payrolls } = useListHoliday({
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
              title: "Payroll",
              url: "#",
            },
          ]}
        />
      </div>

      <div className="bg-white p-4 rounded-lg space-y-4">
        <div className="border-b pb-3">
          <div className="flex justify-between">
            <p className="text-xl font-medium">Payroll</p>
            {checkPermission(["create-payroll"]) && <AddPayroll />}
          </div>
          {/* <p className="text-sm text-gray-500">
            Untuk pengelolaan hari libur yang akan menyesuaikan jam operasional
            perusahaan.
          </p> */}
        </div>

        <div className="overflow-auto">
          <Table
            id="payroll-table"
            columns={columns}
            dataSource={payrolls?.data}
            loading={isLoading}
            pagination={{
              onChange: (page, pageSize) => {
                setPagination({ page, pageSize });
              },
              total: payrolls?.meta.total,
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
