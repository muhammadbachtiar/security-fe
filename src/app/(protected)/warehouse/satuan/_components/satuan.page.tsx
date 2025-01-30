"use client";
import { Table } from "antd";
import { useState } from "react";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import useListSatuan from "../_hooks/useListSatuan";
import { cn } from "@/lib/utils";
import AddSatuan from "./add-satuan";

function SatuanPage() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const [isProduct, setIsProduct] = useState(false);

  const { columns, isLoading, units, unitsProduct, isLoadingProduct } =
    useListSatuan({
      limit: pagination.pageSize,
      page: pagination.page,
      isProduct,
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

        <div className="flex rounded-lg bg-gray-200 w-fit p-1 gap-1">
          <div
            onClick={() => setIsProduct(false)}
            className={cn(
              "rounded-md py-1 px-2 cursor-pointer",
              !isProduct && "bg-white"
            )}
          >
            Satuan
          </div>
          <div
            onClick={() => setIsProduct(true)}
            className={cn(
              "rounded-md py-1 px-2 cursor-pointer",
              isProduct && "bg-white"
            )}
          >
            Satuan Produk
          </div>
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
