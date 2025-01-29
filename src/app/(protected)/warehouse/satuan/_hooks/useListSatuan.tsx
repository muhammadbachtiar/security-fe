import { useQuery } from "@tanstack/react-query";
import { TableProps, Tag, Typography } from "antd";
import "moment/locale/id";
import UnitService from "@/services/unit/unit.service";
import { TUnit } from "@/services/unit/unit.type";
import { DeleteSatuan } from "../_components/delete-satuan";
import EditSatuan from "../_components/edit-satuan";

type Props = {
  page: number;
  limit: number;
  isProduct: boolean;
};

function useListSatuan({ limit, page, isProduct }: Props) {
  const { data: units, isLoading } = useQuery({
    queryKey: ["UNITS", page, limit],
    enabled: !isProduct,
    queryFn: async () => {
      const response = await UnitService.getAll({
        page_size: limit,
        page,
      });
      return response;
    },
    select(data) {
      return {
        ...data,
        data: data.data.map((unit, index) => ({
          ...unit,
          no: index + 1 + limit * page - limit,
        })),
      };
    },
  });

  const { data: unitsProduct, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["UNITS_PRODUCT", page, limit],
    enabled: isProduct,
    queryFn: async () => {
      const response = await UnitService.getAllProductUnit({
        page_size: limit,
        page,
      });
      return response;
    },
    select(data) {
      return {
        ...data,
        data: data.data.map((unit, index) => ({
          ...unit,
          no: index + 1 + limit * page - limit,
        })),
      };
    },
  });

  const columns: TableProps<TUnit>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "Nama",
      dataIndex: "name",
      render: (value = "") => <p>{value}</p>,
    },
    {
      title: "Terhitung",
      dataIndex: "is_count",
      render: (value = "") => (
        <p>
          {!value ? <Tag color="red">Tidak</Tag> : <Tag color="green">Ya</Tag>}
        </p>
      ),
    },
    {
      title: "Action",
      key: "",
      render: (value, record) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            <EditSatuan isProduct={isProduct} productId={record.id} />
            <DeleteSatuan isProduct={isProduct} unitId={record.id} />
          </div>
        );
      },
    },
  ];
  return { columns, units, unitsProduct, isLoading, isLoadingProduct };
}

export default useListSatuan;
