"use client";
import { Button, Table } from "antd";
import { useState } from "react";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import useListSatuan from "../_hooks/useListSatuan";
import { cn, handleDownloadCsv } from "@/lib/utils";
import AddSatuan from "./add-satuan";
import UnitService from "@/services/unit/unit.service";
import { AxiosError } from "axios";
import errorResponse from "@/lib/error";
import { DownloadIcon } from "lucide-react";

function SatuanPage() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const [isProduct, setIsProduct] = useState(false);
  const [isLoadingExport, setIsLoadingExport] = useState(false);

  const { columns, isLoading, units, unitsProduct, isLoadingProduct } =
    useListSatuan({
      limit: pagination.pageSize,
      page: pagination.page,
      isProduct,
    });

  const handleExport = async () => {
    try {
      setIsLoadingExport(true);
      if (isProduct) {
        const res = await UnitService.exportProduct();
        handleDownloadCsv(res, "satuan-produk");
      } else {
        const res = await UnitService.export();
        handleDownloadCsv(res, "satuan");
      }
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
              title: "Satuan",
              url: "#",
            },
          ]}
        />
      </div>

      <div className="bg-white p-4 rounded-lg space-y-4">
        <div className="border-b pb-3">
          <div className="flex justify-between">
            <p className="text-xl font-medium">Satuan</p>
            <AddSatuan />
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex rounded-lg bg-gray-200 w-fit p-1 gap-1">
            <div
              onClick={() => setIsProduct(false)}
              className={cn(
                "rounded-md text-sm py-1 px-2 cursor-pointer",
                !isProduct && "bg-white"
              )}
            >
              Satuan Bahan
            </div>
            <div
              onClick={() => setIsProduct(true)}
              className={cn(
                "rounded-md text-sm py-1 px-2 cursor-pointer",
                isProduct && "bg-white"
              )}
            >
              Satuan Produk
            </div>
          </div>
          <Button
            icon={<DownloadIcon className="w-4 h-4" />}
            type="default"
            loading={isLoadingExport}
            onClick={handleExport}
          >
            Export
          </Button>
        </div>

        <div className="overflow-auto">
          <Table
            id="unit-table"
            columns={columns}
            dataSource={!isProduct ? units?.data : unitsProduct?.data}
            loading={!isProduct ? isLoading : isLoadingProduct}
            pagination={{
              onChange: (page, pageSize) => {
                setPagination({ page, pageSize });
              },
              total: !isProduct ? units?.meta.total : unitsProduct?.meta.total,
              pageSize: pagination.pageSize,
              current: pagination.page,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default SatuanPage;
