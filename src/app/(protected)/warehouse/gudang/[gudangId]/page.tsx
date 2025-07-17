"use client";

import AppBreadcrumbs from "@/components/common/app-breadcrums";
import GudangService from "@/services/gudang/gudang.service";
import { useQuery } from "@tanstack/react-query";
import { Button, Skeleton, Tag } from "antd";
import { ArrowBigDownDashIcon, HardDriveDownloadIcon, History } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import useListHistoryGudang from "../_hooks/useListHistoryGudang";
import moment from "moment";
import { THistory } from "@/services/gudang/gudang.type";

function GudangDetail() {
  const { gudangId } = useParams();
  const router = useRouter();

  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  const { loadingInfinite, historyInfinite } = useListHistoryGudang({
    limit: 5,
    from: moment(startDate).format("YYYY-MM-DD"),
  });

  const historyImportData = historyInfinite?.pages.flatMap(
    (page: { data: THistory[] }) => page?.data
  );

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
              <p className="text-xl font-semibold">Aktivitas Gudang</p>
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
            <div className="bg-white p-4 rounded-lg space-y-4">
            <div className="border-b pb-3">
              <div className="flex justify-between">
                <p className="text-xl font-medium">Riwayat</p>
                <Button
                  onClick={() => router.push(`/warehouse/gudang/${gudangId}/history`)}
                  icon={<History />}
                  type="primary"
                >
                  <span className="!hidden md:!inline">Lihat Riwayat</span>
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-3 overflow-auto">
               {historyImportData?.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center border rounded-lg p-4"
                  >
                    <div className="space-y-1 basis-6/12">
                      <div className="flex items-center gap-1">
                        <p className="font-semibold text-xs text-blue-500">
                          {item?.bahan ? "Bahan" : "Produk"}
                        </p>
                      </div>
                      <p className="md:max-w-[380px] font-medium">
                        {item?.bahan?.name ||"-"}
                      </p>
                      <p className="md:max-w-[380px] text-sm">
                        {item?.keterangan || "-"}
                      </p>
                    </div>
  
                    <div className="flex items-center gap-10">
                      <div className="space-y-1">
                        <p className="text-xs font-bold">Tipe</p>
                        <p> {item?.tipe === "keluar" ? <Tag color="red">Keluar</Tag> : <Tag color="green">Masuk</Tag>}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold">Jumlah</p>
                        <p className="text-blue-500">{item?.jumlah}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            {(loadingInfinite) && (
              <div className="flex justify-center items-center my-12">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="text-gray-600 font-medium">Loading...</span>
                </div>
              </div>
            )}
          </div>
            <div className="space-y-2">
              <p className="text-xl font-semibold">Informasi Gudang</p>
              <div className="space-y-1">
                <p className="font-semibold">Alamat</p>
                <p>{gudang?.data.alamat}</p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold">Deskripsi</p>
                <p>{gudang?.data.deskripsi}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GudangDetail;
