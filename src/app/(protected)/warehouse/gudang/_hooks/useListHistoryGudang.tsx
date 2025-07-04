import { useInfiniteQuery } from "@tanstack/react-query";
import "moment/locale/id";
import GudangService from "@/services/gudang/gudang.service";
import { useParams } from "next/navigation";

type Props = {
  limit: number;
  from?: string;
  to?: string;
};

function useListHistoryGudang({limit, from, to='' }: Props) {
  const { gudangId } = useParams();

  const { data: historyInfinite, isLoading: loadingInfinite, isFetchingNextPage: loadingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["history_infinite", gudangId, from, to],
    queryFn: async ({ pageParam = "" }: { pageParam?: string }) => {
      let cursor: string = "";
      if (typeof pageParam === "string" && pageParam !== "") {
        const parsedUrl = new URL(pageParam as string);
        cursor = parsedUrl.searchParams.get("cursor") as string;
      }
      const response = await GudangService.getHistory({
        page_size: limit,
        cursor,
        gudang: gudangId,
        from: from,
        to: to,
        with: "bahan",
      });
      return response;
    },
    getNextPageParam: (lastPage) => lastPage.meta.next_page_url,
    initialPageParam: "",
  });

  return {
    historyInfinite,
    fetchNextPage,
    hasNextPage,
    loadingInfinite,
    loadingNextPage,
  };
}

export default useListHistoryGudang;
