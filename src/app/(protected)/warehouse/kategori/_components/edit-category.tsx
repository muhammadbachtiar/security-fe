/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import CategoryService from "@/services/category/category.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Typography } from "antd";
import { AxiosError } from "axios";
import { PencilIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function EditCategory({
  isProduct,
  categoryId,
}: {
  isProduct: boolean;
  categoryId: number;
}) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const { data: categoryProduct, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["CATEGORY_PRODUCT", categoryId, modal.isOpen],
    enabled: isProduct && modal.isOpen,
    queryFn: async () => {
      const response = await CategoryService.getOneProductCategory(categoryId);
      return response;
    },
  });
  const { data: category, isLoading } = useQuery({
    queryKey: ["CATEGORY", categoryId, modal.isOpen],
    enabled: !isProduct && modal.isOpen,
    queryFn: async () => {
      const response = await CategoryService.getOne(categoryId);
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);

      if (isProduct) {
        await CategoryService.updateProductCategory(categoryId, {
          name: val.name,
          code: val.code,
        });
      } else {
        await CategoryService.update(categoryId, {
          name: val.name,
          code: val.code,
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["CATEGORIES"],
      });
      queryClient.invalidateQueries({
        queryKey: ["CATEGORY", categoryId],
      });
      queryClient.invalidateQueries({
        queryKey: ["CATEGORIES_PRODUCT"],
      });
      queryClient.invalidateQueries({
        queryKey: ["CATEGORY_PRODUCT", categoryId],
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

  useEffect(() => {
    if (category) {
      form.setFieldValue("name", category.data.name);
      form.setFieldValue("code", category.data.code);
    }
    if (categoryProduct) {
      form.setFieldValue("name", categoryProduct.data.name);
      form.setFieldValue("code", categoryProduct.data.code);
    }
  }, [category, categoryProduct]);

  return (
    <>
      <Button
        onClick={() => modal.onOpen()}
        icon={<PencilIcon className="w-4 h-4 !text-orange-500" />}
        type="text"
      ></Button>
      <Modal
        open={modal.isOpen}
        maskClosable={false}
        onCancel={() => {
          modal.onClose();
          form.resetFields();
        }}
        loading={isProduct ? isLoadingProduct : isLoading}
        okText="Simpan"
        okButtonProps={{
          onClick: form.submit,
        }}
        confirmLoading={loading}
        title={<Typography.Title level={4}>Edit Kategori</Typography.Title>}
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
        </Form>
      </Modal>
    </>
  );
}

export default EditCategory;
