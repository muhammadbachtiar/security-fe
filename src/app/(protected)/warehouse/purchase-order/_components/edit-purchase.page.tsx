/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import errorResponse from "@/lib/error";
import GudangService from "@/services/gudang/gudang.service";
import PurchaseService from "@/services/purchase-order/purchase.service";
import SupplierService from "@/services/supplier/supplier.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Select, Skeleton } from "antd";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function EditPurchase() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { poId } = useParams();

  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: purchase, isLoading } = useQuery({
    queryKey: ["PURCHASE", poId],
    queryFn: async () => {
      const response = await PurchaseService.getOne(+poId);
      return response;
    },
  });

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

      await PurchaseService.update(+poId, {
        ...val,
      });
      queryClient.invalidateQueries({
        queryKey: ["PURCHASES"],
      });
      queryClient.invalidateQueries({
        queryKey: ["PURCHASE", poId],
      });
      toast.success("Purchase berhasil diperbarui");
      form.resetFields();
      router.back();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (purchase) {
      form.setFieldValue("code", purchase.data.code);
      form.setFieldValue("client", purchase.data.client);
      form.setFieldValue("alamat", purchase.data.alamat);
      form.setFieldValue("gudang_id", purchase.data.gudang_id);
      form.setFieldValue("supplier_id", purchase.data.supplier_id);
    }
  }, [purchase]);

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
              url: "/purchase-order",
            },
            {
              title: "Edit Purchase",
              url: "#",
            },
          ]}
        />

        <div className="bg-white p-4 rounded-lg space-y-4">
          <div className="border-b pb-3">
            <p className="text-xl font-medium">Edit Purchase</p>
          </div>

          {isLoading ? (
            <Skeleton />
          ) : (
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

              <div className="flex justify-end mt-5">
                <Button loading={loading} htmlType="submit" type="primary">
                  Simpan
                </Button>
              </div>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditPurchase;
