/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import UnitService from "@/services/unit/unit.service";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Switch, Typography } from "antd";
import { AxiosError } from "axios";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function AddSatuan() {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);

      if (val?.isProduct) {
        await UnitService.createProductUnit({
          name: val.name,
          is_count: !!val?.is_count,
        });
      } else {
        await UnitService.create({
          name: val.name,
          is_count: !!val?.is_count,
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["UNITS"],
      });
      queryClient.invalidateQueries({
        queryKey: ["UNITS_PRODUCT"],
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

  return (
    <>
      <Button onClick={() => modal.onOpen()} icon={<PlusIcon />} type="primary">
        <span className="!hidden md:!inline">Tambah Satuan</span>
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
        title={<Typography.Title level={4}>Tambah Satuan</Typography.Title>}
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

          <div className="flex">
            <Form.Item
              label="Terhitung"
              name="is_count"
              className="w-full !mb-2"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="Untuk satuan produk"
              name="isProduct"
              className="w-full !mb-2"
            >
              <Switch />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
}

export default AddSatuan;
