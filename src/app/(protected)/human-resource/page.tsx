"use client";

import AppBreadcrumbs from "@/components/common/app-breadcrums";
import AbsenceService from "@/services/absence/absence.service";
import { Loader2Icon } from "lucide-react";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { ApexOptions } from "apexcharts";
const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-40">
      <Loader2Icon className="animate-spin h-10 w-10" />
    </div>
  ),
});

function DashboardHrdPage() {
  const today = dayjs();
  const yesterday = dayjs().subtract(1, "day");
  const { data: absences, isLoading } = useQuery({
    queryKey: ["ABSENCES_GRAPH"],
    queryFn: async () => {
      const response = await AbsenceService.getGraph({
        graph: true,
        from: dayjs(yesterday).format("YYYY-MM-DD"),
        to: dayjs(today).format("YYYY-MM-DD"),
      });
      return response;
    },
  });

  console.log({ absences });

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

      <div className="bg-white rounded-lg p-4">
        <div className="space-y-3">
          <p className="font-semibold text-lg">Absen Kemarin & Hari Ini</p>
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
