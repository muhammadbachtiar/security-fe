"use client";
import { Button, Table } from "antd";
import { useState } from "react";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import useListSales from "../_hooks/useListSales";

function SalesOrderPage() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const router = useRouter();

  const { columns, isLoading, sales } = useListSales({
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
              title: "Sales Order",
              url: "#",
            },
          ]}
        />
      </div>

      <div className="bg-white p-4 rounded-lg space-y-4">
        <div className="border-b pb-3">
          <div className="flex justify-between">
            <p className="text-xl font-medium">Sales Order</p>
            <Button
              onClick={() => router.push("/warehouse/sales-order/tambah")}
              icon={<PlusIcon />}
              type="primary"
            >
              <span className="!hidden md:!inline">Tambah Sales Order</span>
            </Button>
          </div>
        </div>

        <div className="overflow-auto">
          <Table
            id="po-table"
            columns={columns}
            dataSource={sales?.data}
            loading={isLoading}
            pagination={{
              onChange: (page, pageSize) => {
                setPagination({ page, pageSize });
              },
              total: sales?.meta.total,
              pageSize: pagination.pageSize,
              current: pagination.page,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default SalesOrderPage;
