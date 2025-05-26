/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import UnitService from "@/services/unit/unit.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Switch, Typography } from "antd";
import { AxiosError } from "axios";
import { PencilIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function EditSatuan({
  isProduct,
  productId,
}: {
  isProduct: boolean;
  productId: number;
}) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const { data: unitsProduct, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["UNIT_PRODUCT", productId, modal.isOpen],
    enabled: isProduct && modal.isOpen,
    queryFn: async () => {
      const response = await UnitService.getOneProductUnit(productId);
      return response;
    },
  });
  const { data: unit, isLoading } = useQuery({
    queryKey: ["UNIT", productId, modal.isOpen],
    enabled: !isProduct && modal.isOpen,
    queryFn: async () => {
      const response = await UnitService.getOne(productId);
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);

      if (isProduct) {
        await UnitService.updateProductUnit(productId, {
          name: val.name,
          is_count: !!val?.is_count,
        });
      } else {
        await UnitService.update(productId, {
          name: val.name,
          is_count: !!val?.is_count,
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["UNITS"],
      });
      queryClient.invalidateQueries({
        queryKey: ["UNIT", productId],
      });
      queryClient.invalidateQueries({
        queryKey: ["UNITS_PRODUCT"],
      });
      queryClient.invalidateQueries({
        queryKey: ["UNIT_PRODUCT", productId],
      });
      toast.success("Satuan berhasil dibuat");
      form.resetFields();
      modal.onClose();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (unit) {
      form.setFieldValue("name", unit.data.name);
      form.setFieldValue("is_count", unit.data.is_count);
    }
    if (unitsProduct) {
      form.setFieldValue("name", unitsProduct.data.name);
      form.setFieldValue("is_count", unitsProduct.data.is_count);
    }
  }, [unit, unitsProduct]);

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
        okText="Simpan"
        loading={isProduct ? isLoadingProduct : isLoading}
        okButtonProps={{
          onClick: form.submit,
        }}
        confirmLoading={loading}
        title={<Typography.Title level={4}>Edit Satuan</Typography.Title>}
      >
        <Form
          form={form}
          requiredMark
          layout="vertical"
          onFinish={onSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Nama Satuan"
            name="name"
            className="w-full !mb-2"
            rules={[{ required: true, message: "Nama Satuan harus diisi" }]}
          >
            <Input placeholder="Nama" />
          </Form.Item>

          <Form.Item label="Terhitung" name="is_count" className="w-full !mb-2">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default EditSatuan;
