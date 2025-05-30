/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import errorResponse from "@/lib/error";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, DatePicker, Form, Input, InputNumber, Select } from "antd";
import { AxiosError } from "axios";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CustomerService from "@/services/customer/customer.service";
import ProductService from "@/services/product/product.service";
import SalesOrderService from "@/services/sales-order/sales.service";
import dayjs from "dayjs";

function AddPurchasePage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: customer } = useQuery({
    queryKey: ["CUSTOMERS"],
    queryFn: async () => {
      const response = await CustomerService.getAll({
        select: true,
      });
      return response;
    },
  });

  const { data: products } = useQuery({
    queryKey: ["PRODUCTS"],
    queryFn: async () => {
      const response = await ProductService.getAll({
        select: true,
      });
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);

      await SalesOrderService.create({
        ...val,
        tanggal_kirim: dayjs(val?.tanggal_kirim).format("YYYY-MM-DD"),
      });
      queryClient.invalidateQueries({
        queryKey: ["SALESES"],
      });
      toast.success("Sales Order berhasil dibuat");
      form.resetFields();
      router.push("/warehouse/sales-order");
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
              url: "/purchase-order",
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
            label="Nama Kasir"
            name="name"
            className="w-full !mb-2"
            rules={[{ required: true, message: "Nama harus diisi" }]}
          >
            <Input placeholder="Nama Kasir" maxLength={255} />
          </Form.Item>
          <Form.Item
            name="tanggal_kirim"
            label="Tanggal kirim"
            className="!mb-2 w-full"
            rules={[{ required: true, message: "Tanggal kirim harus diisi" }]}
          >
            <DatePicker
              allowClear={false}
              format="DD/MM/YYYY"
              className="w-full"
            />
          </Form.Item>

          <div className="flex gap-2 flex-col md:flex-row">
            <Form.Item
              name="customer_id"
              label="Customer"
              className="!mb-2 w-full"
              rules={[{ required: true, message: "Customer harus diisi" }]}
            >
              <Select
                placeholder="Pilih Customer"
                options={customer?.data.map((val) => ({
                  label: val.name,
                  value: val.id,
                }))}
              />
            </Form.Item>
            <Form.Item
              label="Ekspedisi"
              name="shipper"
              className="w-full !mb-2"
              rules={[{ required: true, message: "Ekspedisi harus diisi" }]}
            >
              <Input placeholder="Ekspedisi" maxLength={255} />
            </Form.Item>
          </div>

          <div className="border p-4 rounded-lg my-4">
            <Form.List name="details">
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map((field, index) => (
                    <Form.Item
                      className="!mb-2"
                      label={index === 0 ? "Produk" : ""}
                      required={false}
                      key={field.key}
                    >
                      <div className="p-4 border rounded space-y-3">
                        <Form.Item
                          {...field}
                          name={[field.name, "product_id"]}
                          label="Produk"
                          className="!mb-2 w-full"
                          rules={[
                            { required: true, message: "Produk harus diisi" },
                          ]}
                        >
                          <Select
                            placeholder="Pilih Produk"
                            options={products?.data.map((val) => ({
                              label: val.name,
                              value: val.id,
                            }))}
                          />
                        </Form.Item>
                        <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
                          <Form.Item
                            {...field}
                            label="Jumlah"
                            name={[field.name, "jumlah"]}
                            className="!mb-0 !w-full"
                            rules={[
                              {
                                required: true,
                                message: "",
                              },
                            ]}
                          >
                            <InputNumber
                              placeholder="Jumlah"
                              min={0}
                              className="!w-full"
                            />
                          </Form.Item>
                          <Form.Item
                            {...field}
                            label="Harga"
                            name={[field.name, "price"]}
                            className="!mb-0 !w-full"
                            rules={[
                              {
                                required: true,
                                message: "",
                              },
                            ]}
                          >
                            <InputNumber
                              placeholder="Harga"
                              min={0}
                              className="!w-full"
                            />
                          </Form.Item>
                        </div>
                        <Form.Item
                          {...field}
                          label="Keterangan"
                          name={[field.name, "keterangan"]}
                          className="!mb-0 !w-full"
                        >
                          <Input.TextArea
                            placeholder="Keterangan"
                            className="!w-full"
                          />
                        </Form.Item>
                        <Button danger onClick={() => remove(field.name)}>
                          Hapus
                        </Button>
                      </div>
                    </Form.Item>
                  ))}
                  <Form.Item className="!mb-0">
                    <Button
                      type="dashed"
                      className="w-full"
                      onClick={() => add()}
                    >
                      Tambah Produk
                    </Button>

                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>
          </div>
          <div className="flex justify-end mt-5">
            <Button loading={loading} htmlType="submit" type="primary">
              Tambah
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default AddPurchasePage;
