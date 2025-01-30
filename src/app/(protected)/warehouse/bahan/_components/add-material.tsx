/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import CategoryService from "@/services/category/category.service";
import MaterialService from "@/services/material/material.service";
import UnitService from "@/services/unit/unit.service";
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

function AddMaterial() {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ["CATEGORIES"],
    queryFn: async () => {
      const response = await CategoryService.getAll({
        page_size: 9999,
        page: 1,
      });
      return response;
    },
  });

  const { data: units } = useQuery({
    queryKey: ["UNITS"],
    queryFn: async () => {
      const response = await UnitService.getAll({
        page_size: 9999,
        page: 1,
      });
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);

      await MaterialService.create([val]);

      queryClient.invalidateQueries({
        queryKey: ["MATERIALS"],
      });

      toast.success("Bahan berhasil dibuat");
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
        <span className="!hidden md:!inline">Tambah Bahan</span>
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
        title={<Typography.Title level={4}>Tambah Bahan</Typography.Title>}
      >
        <Form
          form={form}
          requiredMark
          layout="vertical"
          onFinish={onSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Nama Bahan"
            name="name"
            className="w-full !mb-2"
            rules={[{ required: true, message: "Nama Bahan harus diisi" }]}
          >
            <Input placeholder="Nama" />
          </Form.Item>

          <Form.Item
            name="category_id"
            label="Kategori"
            className="!mb-2 w-full"
            rules={[{ required: true, message: "Kategori harus diisi" }]}
          >
            <Select
              placeholder="Pilih Kategori"
              options={categories?.data.map((val) => ({
                label: val.name,
                value: val.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="satuan_id"
            label="Satuan"
            className="!mb-2 w-full"
            rules={[{ required: true, message: "Satuan harus diisi" }]}
          >
            <Select
              placeholder="Pilih Satuan"
              options={units?.data.map((val) => ({
                label: val.name,
                value: val.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Ambang Batas Stok"
            name="buffer_stok"
            className="w-full !mb-2"
            rules={[{ required: true, message: "Batas stok harus diisi" }]}
          >
            <InputNumber className="!w-full" min={0} placeholder="0" />
          </Form.Item>

          <Form.Item
            label="Ambang Batas Limit"
            name="buffer_limit"
            className="w-full !mb-2"
            rules={[{ required: true, message: "Batas limit harus diisi" }]}
          >
            <InputNumber className="!w-full" min={0} placeholder="0" />
          </Form.Item>

          <Form.Item
            label="SKU"
            name="sku"
            className="w-full !mb-2"
            rules={[{ required: true, message: "SKU harus diisi" }]}
          >
            <Input placeholder="SKU" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AddMaterial;
