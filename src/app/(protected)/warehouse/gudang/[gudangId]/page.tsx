"use client";

import AppBreadcrumbs from "@/components/common/app-breadcrums";
import GudangService from "@/services/gudang/gudang.service";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "antd";
import { ArrowBigDownDashIcon, HardDriveDownloadIcon } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

function GudangDetail() {
  const { gudangId } = useParams();
  const pn = usePathname();
  const { data: gudang, isLoading } = useQuery({
    queryKey: ["WAREHOUSE", gudangId],
    queryFn: async () => {
      const response = await GudangService.getOne(+gudangId);
      return response;
    },
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
              title: "Detail Gudang",
              url: "#",
            },
          ]}
        />
      </div>
      {isLoading ? (
        <Skeleton />
      ) : (
        <div className="bg-white p-4 rounded-lg space-y-4">
          <div className="border-b pb-3">
            <p className="text-2xl font-semibold">{gudang?.data.nama}</p>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <p className="text-2xl font-semibold">Aktivitas Gudang</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Link
                  href={`${pn}/bahan-masuk`}
                  className="flex items-center justify-between border border-blue-500 rounded-lg p-2 cursor-pointer hover:bg-blue-50"
                >
                  <div className="w-full flex gap-2 flex-col justify-center">
                    <HardDriveDownloadIcon className="text-blue-500 w-8 h-8" />
                    <p className="text-blue-500">Bahan Masuk</p>
                  </div>
                </Link>
                <Link
                  href={`${pn}/bahan-keluar`}
                  className="flex items-center justify-between border border-blue-500 rounded-lg p-2 cursor-pointer hover:bg-blue-50"
                >
                  <div className="w-full flex gap-2 flex-col justify-center">
                    <HardDriveDownloadIcon className="text-blue-500 w-8 h-8 rotate-180" />
                    <p className="text-blue-500">Bahan Keluar</p>
                  </div>
                </Link>
                <Link
                  href={`${pn}/produk-masuk`}
                  className="flex items-center justify-between border border-blue-500 rounded-lg p-2 cursor-pointer hover:bg-blue-50"
                >
                  <div className="w-full flex gap-2 flex-col justify-center">
                    <ArrowBigDownDashIcon className="text-blue-500 w-8 h-8" />
                    <p className="text-blue-500">Produk Masuk</p>
                  </div>
                </Link>
                <Link
                  href={`${pn}/produk-keluar`}
                  className="flex items-center justify-between border border-blue-500 rounded-lg p-2 cursor-pointer hover:bg-blue-50"
                >
                  <div className="w-full flex gap-2 flex-col justify-center">
                    <ArrowBigDownDashIcon className="text-blue-500 w-8 h-8 rotate-180" />
                    <p className="text-blue-500">Produk Keluar</p>
                  </div>
                </Link>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-semibold">Informasi Gudang</p>
              <div className="space-y-1">
                <p className="font-semibold">Alamat</p>
                <p>{gudang?.data.alamat}</p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold">Deskripsi</p>
                <p>{gudang?.data.deskripsi}</p>
              </div>
            </div>

            {/* <div className="rounded border p-3">
              <div></div>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
}

export default GudangDetail;
