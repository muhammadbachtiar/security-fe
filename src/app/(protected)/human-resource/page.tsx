"use client";

import AppBreadcrumbs from "@/components/common/app-breadcrums";
import AbsenceService from "@/services/absence/absence.service";
import { ArrowDown, ArrowUp, CircleEqualIcon, Loader2Icon } from "lucide-react";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { ApexOptions } from "apexcharts";
import StaffService from "@/services/staff/staff.service";
import moment from "moment";
import { Table, TableProps, Tag, Typography } from "antd";
import { TAbsence } from "@/services/absence/absence.type";
import { useState } from "react";
const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-40">
      <Loader2Icon className="animate-spin h-10 w-10" />
    </div>
  ),
});

const columns: TableProps<TAbsence>["columns"] = [
  {
    title: "No",
    dataIndex: "no",
    render: (text: string) => <Typography.Text>{text}</Typography.Text>,
    align: "center",
  },
  {
    title: "Nama Staff",
    dataIndex: "staff",
    render: (value, record) => <p>{record.staff.nama}</p>,
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (value = "") =>
      value.toLowerCase() === "masuk" ? (
        <Tag color="green" className="capitalize">
          {value}
        </Tag>
      ) : value.toLowerCase() === "pulang" ? (
        <Tag color="orange" className="capitalize">
          {value}
        </Tag>
      ) : value.toLowerCase() === "ijin" ? (
        <Tag color="purple" className="capitalize">
          {value}
        </Tag>
      ) : (
        <Tag color="red" className="capitalize">
          Terlambat
        </Tag>
      ),
  },

  {
    title: "Jam Masuk",
    dataIndex: "masuk",
    render: (value, record) => (
      <p className="capitalize">{moment(record.masuk).format("HH:mm")}</p>
    ),
  },
  {
    title: "Jam Keluar",
    dataIndex: "keluar",
    render: (value, record) => (
      <p className="capitalize">
        {record.keluar ? moment(record.keluar).format("HH:mm") : "-"}
      </p>
    ),
  },
  {
    title: "Shift",
    dataIndex: "shift",
    render: (value, record) => (
      <div className="capitalize">
        <p>{record.shift.nama}</p>
        <p>
          ({moment(record.shift.jam_masuk).utc().format("HH:mm")} -{" "}
          {moment(record.shift.jam_keluar).utc().format("HH:mm")})
        </p>
      </div>
    ),
  },
];

function DashboardHrdPage() {
  const today = dayjs();
  const yesterday = dayjs().subtract(1, "day");
  const startOfMonth = dayjs().startOf("month").format("YYYY-MM-DD");
  const currentMonth = dayjs().format("YYYY-MM");
  const previousMonth = dayjs().subtract(1, "month").format("YYYY-MM");

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 5,
  });
  const [pagination2, setPagination2] = useState({
    page: 1,
    pageSize: 5,
  });

  const { data: absences } = useQuery({
    queryKey: ["ABSENCES_GRAPH"],
    queryFn: async () => {
      const response = await AbsenceService.getGraph({
        graph: true,
        from: dayjs(startOfMonth).format("YYYY-MM-DD"),
        to: dayjs(today).format("YYYY-MM-DD"),
      });
      return response;
    },
  });

  const { data: absenceTomorrow, isLoading } = useQuery({
    queryKey: ["ABSENCES_TOMORROW"],
    queryFn: async () => {
      const response = await AbsenceService.getAll({
        page_size: 99999,
        page: 1,
        from: dayjs(yesterday).format("YYYY-MM-DD"),
        to: dayjs(yesterday).format("YYYY-MM-DD"),
        order: "desc",
        by: "created_at",
        with: "staff,shift",
      });
      return response;
    },
    select(data) {
      return {
        ...data,
        data: data.data.map((abs, index) => ({
          ...abs,
          no:
            index +
            1 +
            pagination.pageSize * pagination.page -
            pagination.pageSize,
        })),
      };
    },
  });
  const { data: absenceToday, isLoading: isLoadingToday } = useQuery({
    queryKey: ["ABSENCES_TODAY"],
    queryFn: async () => {
      const response = await AbsenceService.getAll({
        page_size: 99999,
        page: 1,
        from: dayjs(today).format("YYYY-MM-DD"),
        to: dayjs(today).format("YYYY-MM-DD"),
        order: "desc",
        by: "created_at",
        with: "staff,shift",
      });
      return response;
    },
    select(data) {
      return {
        ...data,
        data: data.data.map((abs, index) => ({
          ...abs,
          no:
            index +
            1 +
            pagination2.pageSize * pagination2.page -
            pagination2.pageSize,
        })),
      };
    },
  });

  const { data: staffCount } = useQuery({
    queryKey: ["STAFFS_COUNT"],
    queryFn: async () => {
      const response = await StaffService.getCount({
        monthly_staff_count: [previousMonth, currentMonth],
      });
      return response;
    },
  });

  const resultPrevious = staffCount?.data[0]?.staff_count || 0;
  const resultCurrent = staffCount?.data[1]?.staff_count || 0;

  const difference = resultCurrent - resultPrevious;

  const pieAbsence = {
    series: [
      absences?.data.ijin.value || 0,
      absences?.data.lupa_absen.value || 0,
      absences?.data.masuk.value || 0,
      absences?.data.telat.value || 0,
      absences?.data.tidak_absen_pulang.value || 0,
    ],
    options: {
      chart: {
        type: "donut",
      },
      labels: ["Izin", "Lupa Absen", "Masuk", "Telat", "Tidak absen pulang"],
      colors: ["#6597fc", "#fc6d65", "#42f57e", "#f5bc42", "#f54242"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  return (
    <div className="p-4 space-y-3">
      <div className="space-y-2">
        <AppBreadcrumbs
          items={[
            {
              title: "Dashboard",
              url: "#",
            },
          ]}
        />
        <p className="text-xl font-medium">Dashboard</p>
      </div>

      <div>
        <div className="max-w-[280px] p-4 rounded-xl bg-white space-y-2">
          <p className="font-semibold">Jumlah Staff</p>
          <div className="flex justify-between">
            <p className="font-bold text-2xl">
              {staffCount?.data[1]?.staff_count || 0}
            </p>

            {difference < 0 ? (
              <ArrowDown className="text-red-500" />
            ) : difference > 0 ? (
              <ArrowUp className="text-green-500" />
            ) : difference === 0 ? (
              <CircleEqualIcon className="text-gray-500" />
            ) : null}
          </div>
          <div className="flex justify-end">
            <p className="text-gray-500 text-sm">
              {difference === 0 ? "Jumlah sama " : difference} dari bulan lalu
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 flex-col lg:flex-row">
        <div className="overflow-auto flex-1 bg-white p-3 rounded-lg">
          <p className="font-semibold mb-3">Absen Kemarin</p>
          <Table
            columns={columns}
            dataSource={absenceTomorrow?.data}
            loading={isLoading}
            pagination={{
              onChange: (page, pageSize) => {
                setPagination({ page, pageSize });
              },
              total: absenceTomorrow?.meta.total,
              pageSize: pagination.pageSize,
              current: pagination.page,
            }}
          />
        </div>
        <div className="overflow-auto flex-1 bg-white p-3 rounded-lg">
          <p className="font-semibold mb-3">Absen Hari Ini</p>
          <Table
            columns={columns}
            dataSource={absenceToday?.data}
            loading={isLoadingToday}
            pagination={{
              onChange: (page, pageSize) => {
                setPagination2({ page, pageSize });
              },
              total: absenceToday?.meta.total,
              pageSize: pagination2.pageSize,
              current: pagination2.page,
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg p-4">
        <div className="space-y-3">
          <p className="font-semibold text-lg">Persentase Absen Bulan ini</p>
          <Chart
            options={pieAbsence.options as ApexOptions}
            series={pieAbsence.series}
            type="donut"
            width={"100%"}
            height={350}
          />
        </div>
      </div>
    </div>
  );
}

export default DashboardHrdPage;
