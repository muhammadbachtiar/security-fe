"use client";

import { Table } from "antd";
import { useState } from "react";
import useListDivisi from "../_hooks/useListDivisi";
import AddDivision from "./add-division";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import AddSubDivision from "./add-sub-division";
import usePermission from "@/hooks/use-permission";

function Divisi() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const { checkPermission } = usePermission();

  const { columns, isLoading, divisions } = useListDivisi({
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
              title: "Divisi",
              url: "#",
            },
          ]}
        />
      </div>

      <div className="bg-white p-4 rounded-lg space-y-4">
        <div className="border-b pb-3">
          <div className="flex justify-between">
            <p className="text-xl font-medium">Data Divisi</p>
            {checkPermission(["view-division"]) && (
              <div className="flex gap-2">
                <AddDivision />
                <AddSubDivision />
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500">
            Fitur divisi memudahkan pengelolaan struktur organisasi dan
            hirarkinya.
          </p>
        </div>

        <div className="overflow-auto">
          <Table
            id="divisi-table"
            columns={columns}
            dataSource={divisions?.data}
            loading={isLoading}
            pagination={{
              onChange: (page, pageSize) => {
                setPagination({ page, pageSize });
              },
              total: divisions?.meta.total,
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
