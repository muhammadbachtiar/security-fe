"use client";

import AppBreadcrumbs from "@/components/common/app-breadcrums";
import errorResponse from "@/lib/error";
import { formatCurrency } from "@/lib/utils";
import PlanService from "@/services/plan/auth.service";
import { useQuery } from "@tanstack/react-query";
import { Button, Skeleton } from "antd";
import { AxiosError } from "axios";
import { useState } from "react";

function PlanPage() {
  const [selectedPlan, setSelectedPlan] = useState<null | number>(null);
  const { data: plans, isLoading } = useQuery({
    queryKey: ["PLANS"],
    queryFn: async () => {
      const response = await PlanService.getPlans({
        page_size: 100,
        page: 1,
        with: "app",
      });
      return response;
    },
  });

  const handleBuyPlan = async (planId: number) => {
    try {
      setSelectedPlan(planId);
      const res = await PlanService.payment(planId);
      window.location.href = res.data?.Url;
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setSelectedPlan(null);
    }
  };

  return (
    <div className="p-4">
      <div className="space-y-2">
        <AppBreadcrumbs
          items={[
            {
              title: "Plan",
              url: "#",
            },
          ]}
        />
        <p className="text-xl font-medium">Plan</p>
        <div className="bg-white rounded-xl p-5">
          {isLoading ? (
            <div className="flex justify-center">
              <Skeleton />
            </div>
          ) : plans?.data?.length ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {plans?.data.map((plan) => (
                <div key={plan.id} className="border rounded-lg">
                  <div className="p-4">
                    <p>
                      {plan.app.name} ({plan.name})
                    </p>
                    <p className="text-gray-500">{plan.duration} Hari</p>
                  </div>
                  <div className="px-4 py-2 border-t items-center flex justify-between">
                    <p> {formatCurrency(plan.harga)}</p>
                    <Button
                      loading={plan.id === selectedPlan}
                      type="primary"
                      onClick={() => handleBuyPlan(plan.id)}
                    >
                      Beli
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center">
              <p>Belum ada Plan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlanPage;
