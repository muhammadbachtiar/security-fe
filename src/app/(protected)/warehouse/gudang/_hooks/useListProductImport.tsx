import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TableProps, Typography } from "antd";
import "moment/locale/id";
import GudangService from "@/services/gudang/gudang.service";
import { TProductInOut } from "@/services/gudang/gudang.type";
import { useParams } from "next/navigation";
import { AxiosError } from "axios";
import errorResponse from "@/lib/error";
import { toast } from "sonner";
import { useState } from "react";
import { DeleteMaterial } from "../[gudangId]/_components/delete-material";

type Props = {
  page: number;
  limit: number;
};

function useListProductImport({ limit, page }: Props) {
  const { gudangId } = useParams();
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const queryClient = useQueryClient();

  const { data: productImport, isLoading } = useQuery({
    queryKey: ["PRODUCT_IMPORTS", page, limit],
    queryFn: async () => {
      const response = await GudangService.getProductMasuk({
        page_size: limit,
        page,
        gudang: gudangId,
        with: "product",
      });
      return response;
    },
    select(data) {
      return {
        ...data,
        data: data.data.map((imp, index) => ({
          ...imp,
          no: index + 1 + limit * page - limit,
        })),
      };
    },
  });

  async function handleDelete(id: number) {
    try {
      setIsLoadingDelete(true);
      await GudangService.deleteImportProduct(id);

      toast.success("Data berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["PRODUCT_IMPORTS"] });
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setIsLoadingDelete(false);
    }
  }

  const columns: TableProps<TProductInOut>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "PIC",
      dataIndex: "nama",
      render: (value = "") => <p>{value}</p>,
    },
    {
      title: "SKU",
      dataIndex: "sku",
      render: (value, record) => <p>{record.product.sku}</p>,
    },
    {
      title: "Keterangan",
      dataIndex: "keterangan",
      render: (value = "") => <p>{value}</p>,
    },
    {
      title: "Action",
      key: "",
      render: (value, record) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            <DeleteMaterial
              handleDelete={async () => handleDelete(record.id)}
              isLoading={isLoadingDelete}
            />
          </div>
        );
      },
    },
  ];
  return {
    columns,
    isLoading,
    productImport,
  };
}

export default useListProductImport;
