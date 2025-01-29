/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import CategoryService from "@/services/category/category.service";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Switch, Typography } from "antd";
import { AxiosError } from "axios";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function AddCategory() {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);

      if (val?.isProduct) {
        await CategoryService.createProductCategory({
          name: val.name,
          code: val?.code,
        });
      } else {
        await CategoryService.create({
          name: val.name,
          code: val?.code,
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["CATEGORIES"],
      });
      queryClient.invalidateQueries({
        queryKey: ["CATEGORIES_PRODUCT"],
      });
      toast.success("Kategori berhasil dibuat");
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
        <span className="!hidden md:!inline">Tambah Kategori</span>
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
        title={<Typography.Title level={4}>Tambah Kategori</Typography.Title>}
      >
        <Form
          form={form}
          requiredMark
          layout="vertical"
          onFinish={onSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Nama Kategori"
            name="name"
            className="w-full !mb-2"
            rules={[{ required: true, message: "Nama Kategori harus diisi" }]}
          >
            <Input placeholder="Nama" />
          </Form.Item>

          <Form.Item
            label="Kode"
            name="code"
            className="w-full !mb-2"
            rules={[{ required: true, message: "Kode harus diisi" }]}
          >
            <Input placeholder="Kode" />
          </Form.Item>

          <Form.Item
            label="Untuk kategori produk"
            name="isProduct"
            className="w-full !mb-2"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AddCategory;
