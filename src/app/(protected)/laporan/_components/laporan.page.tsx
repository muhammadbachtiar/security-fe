/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { DatePicker, Table } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import useListLaporan from "../_hooks/useListLaporan";
import AppBreadcrumbs from "@/components/common/app-breadcrums";

function LaporanPage() {
  const startOfMonth = dayjs().startOf("month");
  const endOfMonth = dayjs().endOf("month");

  const [dateRange, setDateRange] = useState<dayjs.Dayjs[]>([
    startOfMonth,
    endOfMonth,
  ]);

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const { columns, isLoading, staffs } = useListLaporan({
    limit: pagination.pageSize,
    page: pagination.page,
    from: dayjs(dateRange[0]).format("YYYY-MM-DD"),
    to: dayjs(dateRange[1]).format("YYYY-MM-DD"),
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
              title: "Laporan",
              url: "#",
            },
          ]}
        />
      </div>

      <div className="bg-white p-4 rounded-lg space-y-4">
        <div className="border-b pb-3">
          <div className="flex justify-between">
            <p className="text-xl font-medium">Laporan</p>
          </div>
          <p className="text-sm text-gray-500">
            Untuk menampilkan total dari data absensi, cuti, izin, dan lemburan
            dalam kurun waktu yang ditentukan.
          </p>
        </div>

        <div className="mb-3">
          <p className="mb-2">Tanggal</p>
          <DatePicker.RangePicker
            value={dateRange as any}
            onChange={(val) => {
              if (val) {
                setDateRange(val as any);
              }
            }}
            allowClear={false}
            format="DD/MM/YYYY"
            className="w-[280px]"
          />
        </div>

        <div className="overflow-auto">
          <Table
            id="shift-table"
            columns={columns}
            dataSource={staffs?.data}
            loading={isLoading}
            pagination={{
              onChange: (page, pageSize) => {
                setPagination({ page, pageSize });
              },
              total: staffs?.meta.total,
              pageSize: pagination.pageSize,
              current: pagination.page,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default LaporanPage;
