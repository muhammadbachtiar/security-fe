"use client";
import { Button, Table } from "antd";
import { useState } from "react";
import useListStaff from "../_hooks/useListStaff";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import usePermission from "@/hooks/use-permission";

function StaffPage() {
  const { checkPermission } = usePermission();
  const router = useRouter();
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const { columns, isLoading, staffs } = useListStaff({
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
              title: "Staff",
              url: "#",
            },
          ]}
        />
      </div>
      <div className="bg-white p-4 rounded-lg space-y-4">
        <div className="border-b pb-3">
          <div className="flex justify-between">
            <p className="text-xl font-medium">Data Staff</p>
            {checkPermission(["create-staff"]) && (
              <Button
                onClick={() => router.push("/human-resource/staff/tambah")}
                icon={<PlusIcon />}
                type="primary"
              >
                <span className="!hidden md:!inline">Tambah Staff</span>
              </Button>
            )}
          </div>
          <p className="text-sm text-gray-500">
            Fitur staff memudahkan pengelolaan data karyawan, termasuk informasi
            profil dan identitas.
          </p>
        </div>

        <div className="overflow-auto">
          <Table
            id="staff-table"
            columns={columns}
            dataSource={staffs?.data}
            loading={isLoading}
            pagination={{
              onChange: (page, pageSize) => {
                setPagination({ page, pageSize });
              },
              total: staffs?.meta.total,
              pageSize: pagination.pageSize,
              current: pagination.page,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default StaffPage;
