"use client";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import GudangService from "@/services/gudang/gudang.service";
import { useQuery } from "@tanstack/react-query";
import { Button, Skeleton, Table } from "antd";
import { PlusIcon } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import useListProductExport from "../../../_hooks/useListProductExport";

function ProdukKeluar() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const { gudangId } = useParams();
  const router = useRouter();
  const pn = usePathname();
  const { data: gudang, isLoading } = useQuery({
    queryKey: ["WAREHOUSE", gudangId],
    queryFn: async () => {
      const response = await GudangService.getOne(+gudangId);
      return response;
    },
  });

  const {
    columns,
    productExport,
    isLoading: loading,
  } = useListProductExport({
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
              title: "Gudang",
              url: "/warehouse/gudang",
            },
            {
              title: gudang?.data.nama ?? "",
              url: `/warehouse/gudang/${gudangId}`,
            },
            {
              title: "Produk Keluar",
              url: "#",
            },
          ]}
        />
      </div>
      {isLoading || loading ? (
        <Skeleton />
      ) : (
        <div className="bg-white p-4 rounded-lg space-y-4">
          <div className="border-b pb-3">
            <p className="text-2xl font-semibold">
              Produk Keluar{" "}
              <span className="text-blue-500">{gudang?.data.nama}</span>
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg space-y-4">
            <div className="border-b pb-3">
              <div className="flex justify-end">
                <Button
                  onClick={() => router.push(`${pn}/tambah`)}
                  icon={<PlusIcon />}
                  type="primary"
                >
                  Produk Keluar
                </Button>
              </div>
            </div>

            <div className="overflow-auto">
              <Table
                id="gudang-table"
                columns={columns}
                dataSource={productExport?.data}
                loading={isLoading}
                pagination={{
                  onChange: (page, pageSize) => {
                    setPagination({ page, pageSize });
                  },
                  total: productExport?.meta.total,
                  pageSize: pagination.pageSize,
                  current: pagination.page,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProdukKeluar;
