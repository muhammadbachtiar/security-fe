/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useInfiniteQuery } from "@tanstack/react-query";
import "moment/locale/id";
import GudangService from "@/services/gudang/gudang.service";
import { useParams } from "next/navigation";

type Props = {
  limit: number;
};

function useListMaterialExport({ limit }: Props) {
  const { gudangId } = useParams();

  const {
    data: materialInfinite,
    isLoading: loadingInfinite,
    isFetchingNextPage: loadingNextPage,
    fetchNextPage,
    hasNextPage,
    // @ts-ignore
  } = useInfiniteQuery({
    queryKey: ["MATERIAL_EXPORTS", gudangId as string],
    queryFn: async ({ pageParam = 1 }) => {
      let cursor: string = "";
      if (typeof pageParam === "string") {
        const parsedUrl = new URL(pageParam as string);
        cursor = parsedUrl.searchParams.get("cursor") as string;
      }
      const response = await GudangService.getBahanKeluar({
        page_size: limit,
        cursor,
        gudang: gudangId,
        with: "bahan",
      });
      return response;
    },
    getNextPageParam: (lastPage) => lastPage.meta.next_page_url,
    initialPageParam: 1,
  });

  return {
    materialInfinite,
    fetchNextPage,
    hasNextPage,
    loadingInfinite,
    loadingNextPage,
  };
}

export default useListMaterialExport;
