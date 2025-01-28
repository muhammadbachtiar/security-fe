/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { DatePicker, Table } from "antd";
import { useState } from "react";
import useListAbsence from "../_hooks/useListAbsence";
import dayjs from "dayjs";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import { ShowQRAbsence } from "./show-qr-absence";

function AbsensiPage() {
  const today = dayjs();
  const [dateRange, setDateRange] = useState<dayjs.Dayjs[]>([today, today]);

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const { columns, isLoading, absences } = useListAbsence({
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
              title: "Absensi",
              url: "#",
            },
          ]}
        />
      </div>
      <div className="bg-white p-4 rounded-lg space-y-4">
        <div className="border-b pb-3">
          <p className="text-xl font-medium">Data Absensi</p>
          <p className="text-sm text-gray-500">
            Fitur absensi memudahkan pencatatan kehadiran real-time dengan opsi
            waktu masuk, keluar, lokasi, dan riwayat absensi.
          </p>
        </div>

        <div className="flex justify-between items-end">
          <div>
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

          <ShowQRAbsence />
        </div>
        <div className="overflow-auto">
          <Table
            id="absensi-table"
            columns={columns as any}
            dataSource={absences?.data}
            loading={isLoading}
            pagination={{
              onChange: (page, pageSize) => {
                setPagination({ page, pageSize });
              },
              total: absences?.meta.total,
              pageSize: pagination.pageSize,
              current: pagination.page,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default AbsensiPage;
