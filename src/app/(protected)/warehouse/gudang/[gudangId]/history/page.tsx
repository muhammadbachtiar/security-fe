"use client";

import AppBreadcrumbs from "@/components/common/app-breadcrums";
import GudangService from "@/services/gudang/gudang.service";
import { useQuery } from "@tanstack/react-query";
import { DatePicker, Skeleton, Tag } from "antd";
import { useParams, usePathname, useSearchParams, useRouter } from "next/navigation";
import useListHistoryGudang from "../../_hooks/useListHistoryGudang";
import dayjs from "dayjs";
import { THistory } from "@/services/gudang/gudang.type";
import { useEffect, useRef } from "react";

function GudangDetail() {
  const { gudangId } = useParams();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const today = dayjs();
  const searchParams = useSearchParams();
  const start = searchParams.get("start") ?? today;
  const end = searchParams.get("end") ?? today;

  const pathname = usePathname();
  const { replace } = useRouter();

  const { historyInfinite, fetchNextPage, hasNextPage, loadingInfinite, loadingNextPage } = useListHistoryGudang({
          limit: 5,
          from: dayjs(start).format("YYYY-MM-DD"),
          to: dayjs(end).format("YYYY-MM-DD"),
        });

  const historyImportData = historyInfinite?.pages.flatMap(
    (page: { data: THistory[] }) => page?.data
  );


  const { data: gudang, isLoading } = useQuery({
    queryKey: ["WAREHOUSE", gudangId],
    queryFn: async () => {
      const response = await GudangService.getOne(+gudangId);
      return response;
    },
  });

   useEffect(() => {
      const handleScroll = () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
  
        timeoutRef.current = setTimeout(() => {
          if (
            !loadingInfinite &&
            hasNextPage &&
            window.innerHeight + window.scrollY >=
              document.body.offsetHeight - 500
          ) {
            fetchNextPage();
          }
        }, 200);
      };
  
      window.addEventListener("scroll", handleScroll);
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        window.removeEventListener("scroll", handleScroll);
      };
    }, [loadingInfinite, hasNextPage, fetchNextPage]);

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
              url: `/warehouse/gudang/${gudangId}`,
            },
            {
              title: "Riwayat",
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
            <div className="bg-white p-4 rounded-lg space-y-4">
            <div className="border-b pb-3">
              <div className="flex justify-between">
                <p className="text-xl font-medium">Riwayat</p>
              </div>
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <p className="mb-2">Tanggal</p>
                <DatePicker.RangePicker
                  value={start && end ? ([dayjs(start), dayjs(end)] as [dayjs.Dayjs, dayjs.Dayjs]) : null}
                  onChange={(val) => {
                    const params = new URLSearchParams(searchParams);
                    if (val) {
                      params.set("start", val[0]?.format("YYYY-MM-DD") || "");
                      params.set("end", val[1]?.format("YYYY-MM-DD") || "");
                      replace(`${pathname}?${params.toString()}`);
                      return;
                    }
                    params.set("start", today.format("YYYY-MM-DD"));
                    params.set("end", today.format("YYYY-MM-DD"));
                    replace(`${pathname}?${params.toString()}`);
                  }}
                  allowClear={true}
                  format="DD/MM/YYYY"
                  className="w-[280px]"
                />
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
            {(loadingInfinite || loadingNextPage) && (
              <div className="flex justify-center items-center my-12">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="text-gray-600 font-medium">Loading...</span>
                </div>
              </div>
            )}
          </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GudangDetail;
