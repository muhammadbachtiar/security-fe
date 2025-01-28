"use client";
import { Table } from "antd";
import { useState } from "react";
import useListHoliday from "../_hooks/useListHoliday";
import AddHoliday from "./add-holiday";
import AppBreadcrumbs from "@/components/common/app-breadcrums";

function HolidayPage() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const { columns, isLoading, holidays } = useListHoliday({
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
              title: "Hari Libur",
              url: "#",
            },
          ]}
        />
      </div>

      <div className="bg-white p-4 rounded-lg space-y-4">
        <div className="border-b pb-3">
          <div className="flex justify-between">
            <p className="text-xl font-medium">Hari Libur</p>
            <AddHoliday />
          </div>
          <p className="text-sm text-gray-500">
            Untuk pengelolaan hari libur yang akan menyesuaikan jam operasional
            perusahaan.
          </p>
        </div>

        <div className="overflow-auto">
          <Table
            id="shift-table"
            columns={columns}
            dataSource={holidays?.data}
            loading={isLoading}
            pagination={{
              onChange: (page, pageSize) => {
                setPagination({ page, pageSize });
              },
              total: holidays?.meta.total,
              pageSize: pagination.pageSize,
              current: pagination.page,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default HolidayPage;
