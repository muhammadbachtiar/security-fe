/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import GudangService from "@/services/gudang/gudang.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Table, TableProps, Typography } from "antd";
import { useParams, useRouter } from "next/navigation";
import { TempMaterial } from "../../../_components/add-material";
import { useState } from "react";
import { Save, TrashIcon } from "lucide-react";
import errorResponse from "@/lib/error";
import { AxiosError } from "axios";
import { toast } from "sonner";
import AddMaterial from "../../../_components/add-material";

function TambahBahanKeluar() {
  const [loading, setLoading] = useState(false);
  const [pic, setPic] = useState("");

  const { gudangId } = useParams();
  const [materials, setMaterials] = useState<TempMaterial[]>([]);

  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: gudang } = useQuery({
    queryKey: ["WAREHOUSE", gudangId],
    queryFn: async () => {
      const response = await GudangService.getOne(+gudangId);
      return response;
    },
  });

  const handleInput = (material: TempMaterial) => {
    setMaterials((p) => [material, ...p]);
  };

  const onSubmit = async () => {
    try {
      setLoading(true);
      await GudangService.submitExportBahan({
        gudang_id: +gudangId,
        bahan: materials.map((mat) => ({
          nama: mat.material.name,
          sku: mat.material.sku,
          jumlah: mat.qty,
          keterangan: mat.desc || "-",
        })),
      });
      queryClient.invalidateQueries({ queryKey: ["MATERIAL_EXPORTS"] });
      toast.success("Bahan keluar berhasil diselesaikan!");
      router.push(`/warehouse/gudang/${gudangId}/bahan-keluar`);
    } catch (error: any) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  const columns: TableProps<TempMaterial>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (_text, _record, index) => (
        <Typography.Text>{index + 1}</Typography.Text>
      ),
      align: "center",
    },
    {
      title: "Nama Bahan",
      dataIndex: "nama",
      render: (value = "", record) => <p>{record.material.name}</p>,
    },
    {
      title: "SKU",
      dataIndex: "sku",
      render: (value = "", record) => <p>{record.material.sku}</p>,
    },
    {
      title: "Kuantiti",
      dataIndex: "qty",
      render: (value = "") => <p>{value}</p>,
    },
    {
      title: "Keterangan",
      dataIndex: "desc",
      render: (value = "") => <p>{value || "-"}</p>,
    },
    {
      title: "Action",
      dataIndex: "desc",
      render: (value = "", record) => (
        <Button
          className="w-full px-3 !text-red-500"
          icon={<TrashIcon className="w-5 h-5 !text-red-500" />}
          type="text"
          onClick={() =>
            setMaterials((p) =>
              p.filter((q) => q.material.sku !== record.material.sku)
            )
          }
        ></Button>
      ),
    },
  ];
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
              title: "Bahan Keluar",
              url: `/warehouse/gudang/${gudangId}/bahan-keluar`,
            },
            {
              title: "Proses Bahan Keluar",
              url: "#",
            },
          ]}
        />
      </div>

      <div className="bg-white p-4 rounded-lg space-y-4">
        <div className="border-b pb-3">
          <p className="text-2xl font-semibold">Proses bahan keluar</p>
        </div>

        <div className="bg-white p-4 rounded-lg space-y-4">
          <div className="border-b pb-3">
            <div className="flex justify-end gap-2">
              <AddMaterial
                type="material"
                onSubmit={handleInput}
                currentValue={materials}
              />
              <Input
                value={pic}
                onChange={(e) => setPic(e.target.value)}
                className="max-w-[280px]"
                placeholder="Penanggung Jawab"
              />
              {materials.length ? (
                <Button
                  onClick={onSubmit}
                  loading={loading}
                  icon={<Save />}
                  type="primary"
                >
                  Simpan
                </Button>
              ) : null}
            </div>
          </div>

          <div className="overflow-auto">
            <Table columns={columns} dataSource={materials} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TambahBahanKeluar;
