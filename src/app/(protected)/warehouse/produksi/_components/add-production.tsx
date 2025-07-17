/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import GudangService from "@/services/gudang/gudang.service";
import ProductService from "@/services/product/product.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Typography,
} from "antd";
import { AxiosError } from "axios";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function AddProduct() {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const { data: gudang } = useQuery({
    queryKey: ["WAREGOUSES"],
    enabled: modal.isOpen,
    queryFn: async () => {
      const response = await GudangService.getAll({
        select: true,
      });
      return response;
    },
  });

  const { data: products } = useQuery({
    queryKey: ["PRODUCTS"],
    enabled: modal.isOpen,
    queryFn: async () => {
      const response = await ProductService.getAll({
        select: true,
        page_size: 99999,
      });
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);

      await GudangService.createProduction(val);

      queryClient.invalidateQueries({
        queryKey: ["PRODUCTIONS"],
      });

      toast.success("Produksi berhasil dibuat");
      form.resetFields();
      modal.onClose();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => modal.onOpen()} icon={<PlusIcon />} type="primary">
        <span className="!hidden md:!inline">Tambah Produksi</span>
      </Button>
      <Modal
        open={modal.isOpen}
        maskClosable={false}
        onCancel={() => {
          modal.onClose();
          form.resetFields();
        }}
        okText="Tambah"
        okButtonProps={{
          onClick: form.submit,
        }}
        confirmLoading={loading}
        title={<Typography.Title level={4}>Tambah Produksi</Typography.Title>}
      >
        <Form
          form={form}
          requiredMark
          layout="vertical"
          onFinish={onSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Nama"
            name="nama"
            className="w-full !mb-2"
            rules={[{ required: true, message: "Nama harus diisi" }]}
          >
            <Input placeholder="Nama" />
          </Form.Item>

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
            name="product_id"
            label="Produk"
            className="!mb-2 w-full"
            rules={[{ required: true, message: "Produk harus diisi" }]}
          >
            <Select
              placeholder="Pilih Produk"
              options={products?.data.map((val) => ({
                label: val.name,
                value: val.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Jumlah"
            name="jumlah"
            className="w-full !mb-2"
            rules={[{ required: true, message: "Jumlah harus diisi" }]}
          >
            <InputNumber className="!w-full" placeholder="0" min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AddProduct;
