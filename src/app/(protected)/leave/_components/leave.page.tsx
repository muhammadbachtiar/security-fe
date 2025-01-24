"use client";
import { Table } from "antd";
import { useState } from "react";
import useLeaveList from "../_hooks/useLeaveList";
import AppBreadcrumbs from "@/components/common/app-breadcrums";

function Divisi() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const { columns, isLoading, leaves } = useLeaveList({
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
              title: "Cuti & Izin",
              url: "#",
            },
          ]}
        />
      </div>

      <div className="bg-white p-4 rounded-lg space-y-4">
        <div className="border-b pb-3">
          <div className="flex justify-between">
            <p className="text-xl font-medium">Data Cuti & Izin</p>
          </div>
          <p className="text-sm text-gray-500">
            Untuk pengelolaan pengajuan cuti & izin serta menyetujui atau
            menolaknya.
          </p>
        </div>

        <div className="overflow-auto">
          <Table
            id="leave-table"
            columns={columns}
            dataSource={leaves?.data}
            loading={isLoading}
            pagination={{
              onChange: (page, pageSize) => {
                setPagination({ page, pageSize });
              },
              total: leaves?.meta.total,
              pageSize: pagination.pageSize,
              current: pagination.page,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Divisi;
