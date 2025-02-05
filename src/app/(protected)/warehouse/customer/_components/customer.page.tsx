"use client";
import { Button, Table } from "antd";
import { useState } from "react";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import useListGudang from "../_hooks/useListCustomer";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";

function CustomerPage() {
  const router = useRouter();
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const { columns, isLoading, customers } = useListGudang({
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
              title: "Customer",
              url: "#",
            },
          ]}
        />
      </div>

      <div className="bg-white p-4 rounded-lg space-y-4">
        <div className="border-b pb-3">
          <div className="flex justify-between">
            <p className="text-xl font-medium">Customer</p>
            <Button
              onClick={() => router.push("/warehouse/customer/tambah")}
              icon={<PlusIcon />}
              type="primary"
            >
              <span className="!hidden md:!inline">Tambah Customer</span>
            </Button>
          </div>
        </div>

        <div className="overflow-auto">
          <Table
            id="customer-table"
            columns={columns}
            dataSource={customers?.data}
            loading={isLoading}
            pagination={{
              onChange: (page, pageSize) => {
                setPagination({ page, pageSize });
              },
              total: customers?.meta.total,
              pageSize: pagination.pageSize,
              current: pagination.page,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default CustomerPage;
