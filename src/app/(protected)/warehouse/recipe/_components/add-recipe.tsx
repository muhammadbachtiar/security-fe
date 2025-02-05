/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import MaterialService from "@/services/material/material.service";
import ProductService from "@/services/product/product.service";
import RecipeService from "@/services/recipe/recipe.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, InputNumber, Modal, Select, Typography } from "antd";
import { AxiosError } from "axios";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function AddRecipe() {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const { data: materials } = useQuery({
    queryKey: ["MATERIALS"],
    queryFn: async () => {
      const response = await MaterialService.getAll({
        page_size: 9999,
        page: 1,
      });
      return response;
    },
  });

  const { data: products } = useQuery({
    queryKey: ["PRODUCTS"],
    queryFn: async () => {
      const response = await ProductService.getAll({
        page_size: 9999,
        page: 1,
      });
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);

      await RecipeService.create(val);

      queryClient.invalidateQueries({
        queryKey: ["RECIPES"],
      });

      toast.success("Recipe berhasil dibuat");
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
        <span className="!hidden md:!inline">Tambah Recipe</span>
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
        title={<Typography.Title level={4}>Tambah Recipe</Typography.Title>}
      >
        <Form
          form={form}
          requiredMark
          layout="vertical"
          onFinish={onSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="bahan_id"
            label="Bahan"
            className="!mb-2 w-full"
            rules={[{ required: true, message: "Bahan harus diisi" }]}
          >
            <Select
              placeholder="Pilih Bahan"
              options={materials?.data.map((val) => ({
                label: val.name,
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
            <InputNumber className="!w-full" min={0} placeholder="0" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AddRecipe;
