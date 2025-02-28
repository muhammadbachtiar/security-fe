/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import PayrollService from "@/services/payroll/payroll.service";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import DetailPayrollTable from "./detail-payroll-table";
import { Skeleton } from "antd";
import { TPayrollDetail } from "@/services/payroll/payroll.type";
import AddPayrollDetail from "./add-payroll-detail";

function DetailPayroll() {
  const { payrollId } = useParams();

  const { data: payroll, isLoading } = useQuery({
    queryKey: ["PAYROLL", payrollId],
    queryFn: async () => {
      const response = await PayrollService.getOne(+payrollId, {
        with: "staff,detail",
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
              title: "Payroll",
              url: "/payroll",
            },
            {
              title: payroll?.data.staff.nama || "",
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
            <p className="text-xl font-medium">
              {payroll?.data.staff.nama || ""}
            </p>

            <AddPayrollDetail detailId={+payrollId} />
          </div>

          <DetailPayrollTable
            payrollDetail={payroll?.data.detail as TPayrollDetail[]}
          />
        </div>
      )}
    </div>
  );
}

export default DetailPayroll;
