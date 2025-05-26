"use client";
import { Button, Table } from "antd";
import { useState } from "react";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import useListMaterial from "../_hooks/useListMaterial";
import AddMaterial from "./add-material";
import { DownloadIcon } from "lucide-react";
import { handleDownloadCsv } from "@/lib/utils";
import MaterialService from "@/services/material/material.service";
import errorResponse from "@/lib/error";
import { AxiosError } from "axios";

function MaterialPage() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [isLoadingExport, setIsLoadingExport] = useState(false);

  const { columns, isLoading, materials } = useListMaterial({
    limit: pagination.pageSize,
    page: pagination.page,
  });

  const handleExport = async () => {
    try {
      setIsLoadingExport(true);
      const res = await MaterialService.export();
      handleDownloadCsv(res, "bahan");
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setIsLoadingExport(false);
    }
  };

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
              title: "Bahan",
              url: "#",
            },
          ]}
        />
      </div>

      <div className="bg-white p-4 rounded-lg space-y-4">
        <div className="border-b pb-3">
          <div className="flex justify-between">
            <p className="text-xl font-medium">Bahan</p>
            <div className="flex gap-2">
              <AddMaterial />
              <Button
                icon={<DownloadIcon className="w-4 h-4" />}
                type="default"
                loading={isLoadingExport}
                onClick={handleExport}
              >
                Export
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-auto">
          <Table
            id="material-table"
            columns={columns}
            dataSource={materials?.data}
            loading={isLoading}
            pagination={{
              onChange: (page, pageSize) => {
                setPagination({ page, pageSize });
              },
              total: materials?.meta.total,
              pageSize: pagination.pageSize,
              current: pagination.page,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default MaterialPage;
