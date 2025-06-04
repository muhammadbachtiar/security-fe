/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import GudangService from "@/services/gudang/gudang.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Skeleton } from "antd";
import { PlusIcon } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import useListMaterialImport from "../../../_hooks/useListMaterialImport";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { DeleteMaterial } from "../../_components/delete-material";
import errorResponse from "@/lib/error";
import { AxiosError } from "axios";

function BahanMasuk() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [loadingdelete, setIsLoadingDelete] = useState(false);
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

  const queryClient = useQueryClient();

  const {
    fetchNextPage,
    hasNextPage,
    loadingInfinite,
    loadingNextPage,
    materialInfinite,
  } = useListMaterialImport({
    limit: 10,
    page: 1,
  });

  const materialImportData = materialInfinite?.pages.flatMap(
    (page: any) => page?.data
  );

  async function handleDelete(id: number) {
    try {
      setIsLoadingDelete(true);
      await GudangService.deleteImportBahan(id);

      toast.success("Data berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["MATERIAL_IMPORTS"] });
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setIsLoadingDelete(false);
    }
  }

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
              title: gudang?.data.nama ?? "",
              url: `/warehouse/gudang/${gudangId}`,
            },
            {
              title: "Bahan Masuk",
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
            <p className="text-2xl font-semibold">
              Bahan Masuk{" "}
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
                  Bahan Masuk
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {materialImportData?.map((item) => (
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
                      {item?.bahan?.name || item?.product?.name || "-"}
                    </p>
                    <p className="md:max-w-[380px] text-sm">
                      {item?.keterangan || "-"}
                    </p>
                  </div>

                  <div className="flex items-center gap-10">
                    <div className="space-y-1">
                      <p className="text-xs font-bold">Nama PIC</p>
                      <p>{item?.nama}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold">Jumlah</p>
                      <p className="text-blue-500">{item?.jumlah}</p>
                    </div>
                  </div>
                  <DeleteMaterial
                    isLoading={loadingdelete}
                    handleDelete={async () => handleDelete(item.id)}
                  />
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
      )}
    </div>
  );
}

export default BahanMasuk;
