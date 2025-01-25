"use client";
import { Table } from "antd";
import { useState } from "react";
import useLeaveList from "../_hooks/useOvertimeList";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import { ShowQRAOvertime } from "./show-qr-overtime";

function OvertimePage() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const { columns, isLoading, overtimes } = useLeaveList({
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
              title: "Lembur",
              url: "#",
            },
          ]}
        />
      </div>

      <div className="bg-white p-4 rounded-lg space-y-4">
        <div className="border-b pb-3">
          <div className="flex justify-between">
            <p className="text-xl font-medium">Data Lembur</p>
          </div>
          <p className="text-sm text-gray-500">
            Untuk pengelolaan pengajuan lemburan serta menyetujui atau
            menolaknya.
          </p>
        </div>

        <div>
          <ShowQRAOvertime />
        </div>

        <div className="overflow-auto">
          <Table
            id="overtime-table"
            columns={columns}
            dataSource={overtimes?.data}
            loading={isLoading}
            pagination={{
              onChange: (page, pageSize) => {
                setPagination({ page, pageSize });
              },
              total: overtimes?.meta.total,
              pageSize: pagination.pageSize,
              current: pagination.page,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default OvertimePage;
