"use client";

import { Table } from "antd";
import { useState } from "react";
import useListShift from "../_hooks/useListShift";
import AddShift from "./add-shift";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import usePermission from "@/hooks/use-permission";

function Divisi() {
  const { checkPermission } = usePermission();

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const { columns, isLoading, shifts } = useListShift({
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
              title: "Shift",
              url: "#",
            },
          ]}
        />
      </div>

      <div className="bg-white p-4 rounded-lg space-y-4">
        <div className="border-b pb-3">
          <div className="flex justify-between">
            <p className="text-xl font-medium">Data Shift</p>
            {checkPermission(["create-shift"]) && <AddShift />}
          </div>
          <p className="text-sm text-gray-500">Untuk pengelolaan jam kerja.</p>
        </div>

        <div className="overflow-auto">
          <Table
            id="shift-table"
            columns={columns}
            dataSource={shifts?.data}
            loading={isLoading}
            pagination={{
              onChange: (page, pageSize) => {
                setPagination({ page, pageSize });
              },
              total: shifts?.meta.total,
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
