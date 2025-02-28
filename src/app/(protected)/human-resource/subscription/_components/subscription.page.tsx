"use client";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import PlanService from "@/services/plan/auth.service";
import { useQuery } from "@tanstack/react-query";
import { Skeleton, Tag } from "antd";
import moment from "moment";
import "moment/locale/id";

function PlanPage() {
  const { data: plans, isLoading } = useQuery({
    queryKey: ["SUBS"],
    queryFn: async () => {
      const response = await PlanService.getSubs({
        page_size: 100,
        page: 1,
      });
      return response;
    },
  });

  return (
    <div className="p-4">
      <div className="space-y-2">
        <AppBreadcrumbs
          items={[
            {
              title: "Subscription",
              url: "#",
            },
          ]}
        />
        <p className="text-xl font-medium">Subscription</p>
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
                    {/* <p>{plan.name}</p> */}
                    <p className="text-gray-500">
                      Expired: {moment(plan.expired_finance).format("LL")}
                    </p>
                  </div>
                  <div className="px-4 py-2 border-t items-center flex justify-between">
                    <p> Status</p>
                    <Tag>{plan.status}</Tag>
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
