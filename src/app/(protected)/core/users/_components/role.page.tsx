"use client";
import { Button, Table } from "antd";
import { useState } from "react";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import useListUser from "../_hooks/useListUser";

function RolePage() {
  const router = useRouter();
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const { columns, isLoading, users } = useListUser({
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
              title: "Users",
              url: "#",
            },
          ]}
        />
      </div>
      <div className="bg-white p-4 rounded-lg space-y-4">
        <div className="border-b pb-3">
          <div className="flex justify-between">
            <p className="text-xl font-medium">Users</p>
            <Button
              onClick={() => router.push("/core/users/tambah")}
              icon={<PlusIcon />}
              type="primary"
            >
              <span className="!hidden md:!inline">Tambah User</span>
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Menampilkan semua pengguna di aplikasi.
          </p>
        </div>

        <div className="overflow-auto">
          <Table
            id="user-table"
            columns={columns}
            dataSource={users?.data}
            loading={isLoading}
            pagination={{
              onChange: (page, pageSize) => {
                setPagination({ page, pageSize });
              },
              total: users?.meta.total,
              pageSize: pagination.pageSize,
              current: pagination.page,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default RolePage;
