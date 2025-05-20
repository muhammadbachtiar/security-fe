import { useQuery } from "@tanstack/react-query";
import { TableProps, Typography } from "antd";
import "moment/locale/id";
import GudangService from "@/services/gudang/gudang.service";
import { TMaterialInOut } from "@/services/gudang/gudang.type";
import { useParams } from "next/navigation";
import { DeleteMaterialImport } from "../[gudangId]/_components/delete-material-import";

type Props = {
  page: number;
  limit: number;
};

function useListMaterialExport({ limit, page }: Props) {
  const { gudangId } = useParams();
  const { data: materialExport, isLoading } = useQuery({
    queryKey: ["MATERIAL_EXPORTS", page, limit],
    queryFn: async () => {
      const response = await GudangService.getBahanKeluar({
        page_size: limit,
        page,
        gudang: gudangId,
        with: "bahan",
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

  const columns: TableProps<TMaterialInOut>["columns"] = [
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
      render: (value, record) => <p>{record.bahan.sku}</p>,
    },
    {
      title: "Kuantiti",
      dataIndex: "jumlah",
      render: (value, record) => <p>{record.jumlah}</p>,
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
            <DeleteMaterialImport matId={record.id} />
          </div>
        );
      },
    },
  ];
  return {
    columns,
    isLoading,
    materialExport,
  };
}

export default useListMaterialExport;
