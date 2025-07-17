"use client";
import { Button, Table } from "antd";
import { useState } from "react";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import useListPurchase from "../_hooks/useListPurchase";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

function PurchasePage() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const router = useRouter();

  const { columns, isLoading, purchases } = useListPurchase({
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
              title: "Purchase Order",
              url: "#",
            },
          ]}
        />
      </div>

      <div className="bg-white p-4 rounded-lg space-y-4">
        <div className="border-b pb-3">
          <div className="flex justify-between">
            <p className="text-xl font-medium">Purchase Order</p>
            <Button
              onClick={() => router.push("/warehouse/purchase-order/tambah")}
              icon={<PlusIcon />}
              type="primary"
            >
              <span className="!hidden md:!inline">Tambah Purchase</span>
            </Button>
          </div>
        </div>

        <div className="overflow-auto">
          <Table
            id="po-table"
            columns={columns}
            dataSource={purchases?.data}
            loading={isLoading}
            pagination={{
              onChange: (page, pageSize) => {
                setPagination({ page, pageSize });
              },
              total: purchases?.meta.total,
              pageSize: pagination.pageSize,
              current: pagination.page,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default PurchasePage;
