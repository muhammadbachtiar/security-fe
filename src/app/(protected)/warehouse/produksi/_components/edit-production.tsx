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
import { PencilIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function EditProduction({ prodId }: { prodId: number }) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const { data: production, isLoading } = useQuery({
    queryKey: ["PRODUCTION", prodId, modal.isOpen],
    enabled: modal.isOpen,
    queryFn: async () => {
      const response = await GudangService.getOneProduction(prodId);
      return response;
    },
  });
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

      await GudangService.updateProduction(prodId, val);

      queryClient.invalidateQueries({
        queryKey: ["PRODUCTIONS"],
      });
      queryClient.invalidateQueries({
        queryKey: ["PRODUCTION", prodId],
      });

      toast.success("Produksi berhasil diubah");
      form.resetFields();
      modal.onClose();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (production) {
      form.setFieldValue("nama", production.data.nama);
      form.setFieldValue("jumlah", production.data.jumlah);
      form.setFieldValue("gudang_id", production.data.gudang_id);
      form.setFieldValue("product_id", production.data.product_id);
    }
  }, [production]);

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
        title={<Typography.Title level={4}>Edit Produksi</Typography.Title>}
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

export default EditProduction;
