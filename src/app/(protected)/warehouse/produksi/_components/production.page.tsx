"use client";
import { Table } from "antd";
import { useState } from "react";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import AddProduct from "./add-production";
import useListProduction from "../_hooks/useListProduction";

function ProductionPage() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const { columns, isLoading, products } = useListProduction({
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
              title: "Produksi",
              url: "#",
            },
          ]}
        />
      </div>

      <div className="bg-white p-4 rounded-lg space-y-4">
        <div className="border-b pb-3">
          <div className="flex justify-between">
            <p className="text-xl font-medium">Produksi</p>
            <AddProduct />
          </div>
        </div>

        <div className="overflow-auto">
          <Table
            id="produk-table"
            columns={columns}
            dataSource={products?.data}
            loading={isLoading}
            pagination={{
              onChange: (page, pageSize) => {
                setPagination({ page, pageSize });
              },
              total: products?.meta.total,
              pageSize: pagination.pageSize,
              current: pagination.page,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductionPage;
