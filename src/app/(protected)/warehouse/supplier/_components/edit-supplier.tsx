/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import SupplierService from "@/services/supplier/supplier.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Typography } from "antd";
import { AxiosError } from "axios";
import { PencilIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function EditSupplier({ supplierId }: { supplierId: number }) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const { data: supplier, isLoading } = useQuery({
    queryKey: ["SUPPLIER", supplierId, modal.isOpen],
    queryFn: async () => {
      const response = await SupplierService.getOne(supplierId);
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);

      await SupplierService.update(supplierId, val);

      queryClient.invalidateQueries({
        queryKey: ["SUPPLIERS"],
      });
      queryClient.invalidateQueries({
        queryKey: ["SUPPLIER", supplierId],
      });

      toast.success("Supplier berhasil diperbarui");
      form.resetFields();
      modal.onClose();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (supplier) {
      form.setFieldValue("nama", supplier.data.nama);
      form.setFieldValue("alamat", supplier.data.alamat);
    }
  }, [supplier]);

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
        title={<Typography.Title level={4}>Edit Supplier</Typography.Title>}
      >
        <Form
          form={form}
          requiredMark
          layout="vertical"
          onFinish={onSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Nama Supplier"
            name="nama"
            className="w-full !mb-2"
            rules={[{ required: true, message: "Nama Supplier harus diisi" }]}
          >
            <Input placeholder="Nama" />
          </Form.Item>

          <Form.Item
            label="Alamat"
            name="alamat"
            className="w-full !mb-2"
            rules={[{ required: true, message: "Alamat harus diisi" }]}
          >
            <Input.TextArea placeholder="Tulis alamat.." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default EditSupplier;
