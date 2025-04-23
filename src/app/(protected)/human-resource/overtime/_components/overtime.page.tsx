"use client";
import { Select, Table } from "antd";
import { useState } from "react";
import useLeaveList from "../_hooks/useOvertimeList";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import { ShowQRAOvertime } from "./show-qr-overtime";
import { ActionOvertimeMulti } from "./action-overtime-multi";
import usePermission from "@/hooks/use-permission";

function OvertimePage() {
  const [status, setStatus] = useState("");
  const [selectedData, setSelectedData] = useState<number[]>([]);
  const { checkPermission } = usePermission();

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const { columns, isLoading, overtimes } = useLeaveList({
    limit: pagination.pageSize,
    page: pagination.page,
    status,
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
              title: "Lembur",
              url: "#",
            },
          ]}
        />
      </div>

      <div className="bg-white p-4 rounded-lg space-y-4">
        <div className="border-b pb-3">
          <div className="flex justify-between">
            <p className="text-xl font-medium">Data Lembur</p>
          </div>
          <p className="text-sm text-gray-500">
            Untuk pengelolaan pengajuan lemburan serta menyetujui atau
            menolaknya.
          </p>
        </div>

        <div className="flex justify-between">
          <div className="flex gap-2">
            {selectedData.length ? (
              <>
                <ActionOvertimeMulti
                  ovtId={selectedData}
                  status="approved"
                  clear={() => setSelectedData([])}
                />
                <ActionOvertimeMulti
                  ovtId={selectedData}
                  status="rejected"
                  clear={() => setSelectedData([])}
                />
              </>
            ) : null}
            <Select
              onClear={() => setStatus("")}
              onChange={(val) => {
                setStatus(val);
              }}
              allowClear
              placeholder="Pilih Status"
              className="!w-[180px]"
              options={[
                {
                  label: "Approved",
                  value: "approved",
                },
                {
                  label: "Rejected",
                  value: "rejected",
                },
                {
                  label: "Pending",
                  value: "pending",
                },
              ]}
            />
          </div>
          <ShowQRAOvertime />
        </div>

        <div className="overflow-auto">
          <Table
            id="overtime-table"
            columns={columns}
            rowSelection={
              !checkPermission(["update-overtime"])
                ? undefined
                : {
                    selectedRowKeys: selectedData,
                    onSelect(value) {
                      if (selectedData.includes(value.id)) {
                        setSelectedData((prev) =>
                          prev.filter((p) => p !== value.id)
                        );
                        return;
                      }
                      setSelectedData((prev) => [...prev, value.id]);
                    },
                  }
            }
            rowKey={(obj) => obj.id}
            dataSource={overtimes?.data}
            loading={isLoading}
            pagination={{
              onChange: (page, pageSize) => {
                setPagination({ page, pageSize });
              },
              total: overtimes?.meta.total,
              pageSize: pagination.pageSize,
              current: pagination.page,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default OvertimePage;
