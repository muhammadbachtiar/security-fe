/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import MaterialService from "@/services/material/material.service";
import ProductService from "@/services/product/product.service";
import RecipeService from "@/services/recipe/recipe.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, InputNumber, Modal, Select, Typography } from "antd";
import { AxiosError } from "axios";
import { PencilIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function EditRecipe({ recipeId }: { recipeId: number }) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const { data: recipe, isLoading } = useQuery({
    queryKey: ["RECIPE", recipeId, modal.isOpen],
    queryFn: async () => {
      const response = await RecipeService.getOne(recipeId);
      return response;
    },
    enabled: modal.isOpen,
  });

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

      await RecipeService.update(recipeId, val);

      queryClient.invalidateQueries({
        queryKey: ["RECIPES"],
      });

      queryClient.invalidateQueries({
        queryKey: ["RECIPE", recipeId],
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

  useEffect(() => {
    if (recipe) {
      form.setFieldValue("jumlah", recipe.data.jumlah);
      form.setFieldValue("bahan_id", recipe.data.bahan_id);
      form.setFieldValue("product_id", recipe.data.product_id);
    }
  }, [recipe]);

  return (
    <>
      <Button
        onClick={() => modal.onOpen()}
        icon={<PencilIcon className="w-4 h-4 !text-orange-500" />}
        type="text"
      ></Button>
      <Modal
        loading={isLoading}
        open={modal.isOpen}
        maskClosable={false}
        onCancel={() => {
          modal.onClose();
          form.resetFields();
        }}
        okText="Simpan"
        okButtonProps={{
          onClick: form.submit,
        }}
        confirmLoading={loading}
        title={<Typography.Title level={4}>Edit Recipe</Typography.Title>}
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

export default EditRecipe;
