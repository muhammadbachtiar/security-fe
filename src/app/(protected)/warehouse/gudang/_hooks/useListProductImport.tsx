import { useQuery } from "@tanstack/react-query";
import { TableProps, Typography } from "antd";
import "moment/locale/id";
import GudangService from "@/services/gudang/gudang.service";
import { TProductInOut } from "@/services/gudang/gudang.type";
import { useParams } from "next/navigation";

type Props = {
  page: number;
  limit: number;
};

function useListProductImport({ limit, page }: Props) {
  const { gudangId } = useParams();
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

  const columns: TableProps<TProductInOut>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "Nama",
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
            {/* <DeleteMaterialImport matId={record.id} /> */}
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
