/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import errorResponse from "@/lib/error";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Select } from "antd";
import { AxiosError } from "axios";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import GudangService from "@/services/gudang/gudang.service";
import SupplierService from "@/services/supplier/supplier.service";
import { PencilIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import FormDetailPO from "./details-form";
import { TPurchaseDetailInput } from "@/services/purchase-order/purchase.type";
import PurchaseService from "@/services/purchase-order/purchase.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function AddPurchasePage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editDetail, setEditDetail] = useState(false);
  const [details, setDetails] = useState<TPurchaseDetailInput[]>([]);

  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: gudang } = useQuery({
    queryKey: ["WAREGOUSES"],
    queryFn: async () => {
      const response = await GudangService.getAll({
        select: true,
      });
      return response;
    },
  });
  const { data: supplier } = useQuery({
    queryKey: ["SUPPLIERS"],
    queryFn: async () => {
      const response = await SupplierService.getAll({
        page: 1,
        page_size: 99999,
      });
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);

      await PurchaseService.create({
        ...val,
        details: details.map((detail, i) => ({
          price: detail.price! * detail.jumlah!,
          stok_order: i,
          bahan_id: detail?.bahan_id || undefined,
          product_id: detail?.product_id || undefined,
          keterangan: detail.keterangan,
        })),
      });
      queryClient.invalidateQueries({
        queryKey: ["PURCHASES"],
      });
      toast.success("Purchase berhasil dibuat");
      form.resetFields();
      router.push("/warehouse/purchase-order");
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

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
              title: "Purchase",
              url: "/warehouse/purchase-order",
            },
            {
              title: "Tambah Purchase",
              url: "#",
            },
          ]}
        />
      </div>
      <div className="bg-white p-4 rounded-lg space-y-4">
        <div className="border-b pb-3">
          <p className="text-xl font-medium">Tambah Purchase</p>
        </div>

        <Form
          form={form}
          requiredMark
          layout="vertical"
          className="bg-white !p-3 rounded"
          onFinish={onSubmit}
        >
          <Form.Item
            label="Kode"
            name="code"
            className="w-full !mb-2"
            rules={[{ required: true, message: "Kode harus diisi" }]}
          >
            <Input placeholder="Kode" maxLength={255} />
          </Form.Item>
          <Form.Item
            label="Klien"
            name="client"
            className="w-full !mb-2"
            rules={[{ required: true, message: "Nama klien harus diisi" }]}
          >
            <Input placeholder="Nama Klien" maxLength={255} />
          </Form.Item>

          <Form.Item
            label="Alamat"
            name="alamat"
            className="w-full !mb-2"
            rules={[{ required: true, message: "Alamat harus diisi" }]}
          >
            <Input.TextArea placeholder="Alamat" maxLength={255} />
          </Form.Item>

          <div className="flex gap-2 flex-col md:flex-row">
            <Form.Item
              name="gudang_id"
              label="Gudang"
              className="!mb-2 w-full"
              rules={[{ required: true, message: "Gudang harus diisi" }]}
            >
              <Select
                placeholder="Pilih Gudang"
                options={gudang?.data.map((val) => ({
                  label: val.nama,
                  value: val.id,
                }))}
              />
            </Form.Item>
            <Form.Item
              name="supplier_id"
              label="Supplier"
              className="!mb-2 w-full"
              rules={[{ required: true, message: "Supplier harus diisi" }]}
            >
              <Select
                placeholder="Pilih Supplier"
                options={supplier?.data.map((val) => ({
                  label: val.nama,
                  value: val.id,
                }))}
              />
            </Form.Item>
          </div>
          <div className="my-2">
            <Button
              disabled={editDetail}
              onClick={() => setEditDetail(true)}
              type="link"
              icon={<PencilIcon className="w-4 h-4" />}
            >
              Set Item
            </Button>
          </div>
          <div className={cn(!editDetail && "pointer-events-none opacity-45")}>
            <FormDetailPO
              onSubmit={(details) => {
                setDetails(details);
                setEditDetail(false);
              }}
            />
          </div>
          <div className="flex justify-end mt-5">
            <Button
              loading={loading}
              htmlType="submit"
              type="primary"
              disabled={editDetail}
            >
              Tambah
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default AddPurchasePage;
