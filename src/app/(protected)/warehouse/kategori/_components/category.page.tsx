"use client";
import { Table } from "antd";
import { useState } from "react";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import { cn } from "@/lib/utils";
import AddCategory from "./add-category";
import useListCategory from "../_hooks/useListCategory";

function SatuanPage() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const [isProduct, setIsProduct] = useState(false);

  const {
    columns,
    isLoading,
    categoriesProduct,
    categories,
    isLoadingProduct,
  } = useListCategory({
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
              title: "Kategori",
              url: "#",
            },
          ]}
        />
      </div>

      <div className="bg-white p-4 rounded-lg space-y-4">
        <div className="border-b pb-3">
          <div className="flex justify-between">
            <p className="text-xl font-medium">Kategori</p>
            <AddCategory />
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
            Kategori
          </div>
          <div
            onClick={() => setIsProduct(true)}
            className={cn(
              "rounded-md py-1 px-2 cursor-pointer",
              isProduct && "bg-white"
            )}
          >
            Kategori Produk
          </div>
        </div>

        <div className="overflow-auto">
          <Table
            id="category-table"
            columns={columns}
            dataSource={!isProduct ? categories?.data : categoriesProduct?.data}
            loading={!isProduct ? isLoading : isLoadingProduct}
            pagination={{
              onChange: (page, pageSize) => {
                setPagination({ page, pageSize });
              },
              total: !isProduct ? categories?.meta.total : 10, //todo
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
