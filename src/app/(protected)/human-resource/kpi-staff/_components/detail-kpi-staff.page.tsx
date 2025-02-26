/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Skeleton } from "antd";
import KPIService from "@/services/kpi/kpi.service";
import { TKpiStaffDetail } from "@/services/kpi/kpi.type";
import DetailKpiDivTable from "./detail-kpi-table";
import AddKpiStaffDetail from "./add-kpi-staff-detail";

function DetailKPIStaff() {
  const { kpiId } = useParams();

  const { data: kpi, isLoading } = useQuery({
    queryKey: ["KPI_STAFF", kpiId],
    queryFn: async () => {
      const response = await KPIService.getOneStaff(+kpiId, {
        with: "detail,staff",
      });
      return response;
    },
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
              title: "KPI Divisi",
              url: "/human-resource/kpi-divisi",
            },
            {
              title: kpi?.data.name || "",
              url: "#",
            },
          ]}
        />
      </div>
      {isLoading ? (
        <Skeleton />
      ) : (
        <div className="bg-white p-4 rounded-lg space-y-4">
          <div className="border-b pb-3 flex justify-between">
            <p className="text-xl font-medium">{kpi?.data.name || ""}</p>

            <AddKpiStaffDetail detailId={+kpiId} />
          </div>

          <DetailKpiDivTable
            kpiDetail={kpi?.data.detail as TKpiStaffDetail[]}
          />
        </div>
      )}
    </div>
  );
}

export default DetailKPIStaff;
