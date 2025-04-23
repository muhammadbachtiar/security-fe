/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button, DatePicker, Table } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import useListLaporan from "../_hooks/useListLaporan";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import errorResponse from "@/lib/error";
import { AxiosError } from "axios";
import StaffService from "@/services/staff/staff.service";
import { DownloadIcon } from "lucide-react";
import moment from "moment-timezone";
import usePermission from "@/hooks/use-permission";
const timezone = moment.tz.guess();

function LaporanPage() {
  const startOfMonth = dayjs().startOf("month");
  const endOfMonth = dayjs().endOf("month");

  const { checkPermission } = usePermission();

  const [dateRange, setDateRange] = useState<dayjs.Dayjs[]>([
    startOfMonth,
    endOfMonth,
  ]);

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const [loading, setLoading] = useState(false);
  const [loadingTotal, setLoadingTotal] = useState(false);

  const { columns, isLoading, staffs } = useListLaporan({
    limit: pagination.pageSize,
    page: pagination.page,
    from: dayjs(dateRange[0]).format("YYYY-MM-DD"),
    to: dayjs(dateRange[1]).format("YYYY-MM-DD"),
  });

  const handleExportDaily = async () => {
    try {
      setLoading(true);
      const res = await StaffService.exportReportPersonal({
        from: dayjs(dateRange[0]).format("YYYY-MM-DD"),
        to: dayjs(dateRange[1]).format("YYYY-MM-DD"),
        timezone,
      });

      const blob = new Blob([res], { type: "'text/csv'" });

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.setAttribute("href", url);
      a.setAttribute("download", `report_daily.xlsx`);

      a.click();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  const handleExportTotal = async () => {
    try {
      setLoadingTotal(true);
      const res = await StaffService.exportReportTotal({
        from: dayjs(dateRange[0]).format("YYYY-MM-DD"),
        to: dayjs(dateRange[1]).format("YYYY-MM-DD"),
        timezone,
      });

      const blob = new Blob([res], { type: "'text/csv'" });

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.setAttribute("href", url);
      a.setAttribute("download", `report_total.xlsx`);

      a.click();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoadingTotal(false);
    }
  };

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

        <div className="flex justify-between">
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
          {checkPermission(["export-laporan"]) && (
            <div className="flex gap-2">
              <Button
                icon={<DownloadIcon className="w-4 h-4" />}
                type="primary"
                loading={loading}
                onClick={handleExportDaily}
              >
                Export Laporan Daily
              </Button>
              <Button
                icon={<DownloadIcon className="w-4 h-4" />}
                type="primary"
                loading={loadingTotal}
                onClick={handleExportTotal}
              >
                Export Laporan Total
              </Button>
            </div>
          )}
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
