/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import CategoryService from "@/services/category/category.service";
import ProductService from "@/services/product/product.service";
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
import { PencilIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function EditProduct({ productId }: { productId: number }) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [scannedData, setScannedData] = useState("");

  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery({
    queryKey: ["PRODUCT", productId, modal.isOpen],
    enabled: modal.isOpen,
    queryFn: async () => {
      const response = await ProductService.getOne(productId);
      return response;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["CATEGORIES_PRODUCT"],
    queryFn: async () => {
      const response = await CategoryService.getAllProductCategory({
        page_size: 9999,
        page: 1,
      });
      return response;
    },
  });

  const { data: units } = useQuery({
    queryKey: ["UNITS_PRODUCT"],
    queryFn: async () => {
      const response = await UnitService.getAllProductUnit({
        page_size: 9999,
        page: 1,
      });
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);

      await ProductService.update(productId, val);

      queryClient.invalidateQueries({
        queryKey: ["PRODUCTS"],
      });
      queryClient.invalidateQueries({
        queryKey: ["PRODUCT", productId],
      });

      toast.success("Produk berhasil dibuat");
      form.resetFields();
      modal.onClose();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (product) {
      form.setFieldValue("name", product.data.name);
      form.setFieldValue("sku", product.data.sku);
      form.setFieldValue("stok", product.data.stok);
      form.setFieldValue("harga", product.data.harga);
      form.setFieldValue(
        "category_product_id",
        product.data.category_product_id
      );
      form.setFieldValue("satuan_product_id", product.data.satuan_product_id);
    }
  }, [product]);

  useEffect(() => {
    let buffer = "";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        setScannedData(buffer);
        buffer = "";
      } else {
        buffer += event.key;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    form.setFieldValue("sku", scannedData);
  }, [scannedData]);

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
        loading={isLoading}
        okText="Simpan"
        okButtonProps={{
          onClick: form.submit,
        }}
        confirmLoading={loading}
        title={<Typography.Title level={4}>Edit Produk</Typography.Title>}
      >
        <Form
          form={form}
          requiredMark
          layout="vertical"
          onFinish={onSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Nama Produk"
            name="name"
            className="w-full !mb-2"
            rules={[{ required: true, message: "Nama produk harus diisi" }]}
          >
            <Input placeholder="Nama" />
          </Form.Item>

          <Form.Item
            name="category_product_id"
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
            name="satuan_product_id"
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
            label="Stok"
            name="stok"
            className="w-full !mb-2"
            rules={[{ required: true, message: "Stok harus diisi" }]}
          >
            <InputNumber className="!w-full" min={0} placeholder="0" />
          </Form.Item>

          <Form.Item
            label="Harga"
            name="harga"
            className="w-full !mb-2"
            rules={[{ required: true, message: "Harga harus diisi" }]}
          >
            <InputNumber
              prefix="Rp. "
              className="!w-full"
              min={0}
              placeholder="0"
            />
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

export default EditProduct;
