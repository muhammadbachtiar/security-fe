/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import errorResponse from "@/lib/error";
import CustomerService from "@/services/customer/customer.service";
import SalesOrderService from "@/services/sales-order/sales.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, DatePicker, Form, Input, Select, Skeleton } from "antd";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import dayjs from "dayjs";

function EditSalesOrder() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { soId } = useParams();

  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: sales, isLoading } = useQuery({
    queryKey: ["SALES", soId],
    queryFn: async () => {
      const response = await SalesOrderService.getOne(+soId);
      return response;
    },
  });

  const { data: customer } = useQuery({
    queryKey: ["CUSTOMERS"],
    queryFn: async () => {
      const response = await CustomerService.getAll({
        select: true,
      });
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);

      await SalesOrderService.update(+soId, {
        ...val,
        tanggal_kirim: dayjs(val?.tanggal_kirim).format("YYYY-MM-DD"),
      });
      queryClient.invalidateQueries({
        queryKey: ["SALESES"],
      });
      queryClient.invalidateQueries({
        queryKey: ["SALES", soId],
      });
      toast.success("Sales order berhasil diperbarui");
      form.resetFields();
      router.back();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sales) {
      form.setFieldValue("code", sales.data.code);
      form.setFieldValue("customer_id", sales.data.customer_id);
      form.setFieldValue("name", sales.data.name);
      form.setFieldValue("shipper", sales.data.shipper);
      form.setFieldValue("tanggal_kirim", dayjs(sales.data.tanggal_kirim));
    }
  }, [sales]);

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
              title: "Sales Order",
              url: "/warehouse/sales-order",
            },
            {
              title: "Edit Sales Order",
              url: "#",
            },
          ]}
        />

        <div className="bg-white p-4 rounded-lg space-y-4">
          <div className="border-b pb-3">
            <p className="text-xl font-medium">Edit Sales Order</p>
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
                rules={[
                  { required: true, message: "Tanggal kirim harus diisi" },
                ]}
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

export default EditSalesOrder;
