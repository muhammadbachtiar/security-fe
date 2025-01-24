"use client";
import { useState } from "react";
import AppBreadcrumbs from "@/components/common/app-breadcrums";

function Divisi() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  // const { columns, isLoading, leaves } = useLeaveList({
  //   limit: pagination.pageSize,
  //   page: pagination.page,
  // });

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <AppBreadcrumbs
          items={[
            {
              title: "User Management",
              url: "#",
            },
          ]}
        />
      </div>

      <div className="bg-white p-4 rounded-lg space-y-4">
        <div className="border-b pb-3">
          <div className="flex justify-between">
            <p className="text-xl font-medium">User Management</p>
          </div>
          <p className="text-sm text-gray-500">
            Fitur user management memudahkan pengelolaan akses dan data pengguna
            aplikasi.
          </p>
        </div>

        <div className="overflow-auto">
          {/* <Table
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
          /> */}
        </div>
      </div>
    </div>
  );
}

export default Divisi;
