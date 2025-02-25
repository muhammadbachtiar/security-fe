/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import KPIService from "@/services/kpi/kpi.service";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, InputNumber, Modal, Typography } from "antd";
import { AxiosError } from "axios";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function AddKpiDivDetail({ detailId }: { detailId: number }) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);

      await KPIService.createDetail({
        ...val,
        kpi_id: detailId,
      });

      queryClient.invalidateQueries({
        queryKey: ["KPI_DIV", detailId.toString()],
      });

      toast.success("Detail KPI berhasil dibuat");
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
        <span className="!hidden md:!inline">Tambah Detail</span>
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
        title={<Typography.Title level={4}>Tambah Detail</Typography.Title>}
      >
        <Form
          form={form}
          requiredMark
          layout="vertical"
          onFinish={onSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Keterangan"
            name="key"
            className="w-full !mb-2"
            rules={[{ required: true, message: "Keterangan harus diisi" }]}
          >
            <Input placeholder="Keterangan" />
          </Form.Item>

          <Form.Item
            label="Nilai"
            name={"value"}
            className="!mb-0"
            rules={[{ required: true, message: "Nilai harus diisi" }]}
          >
            <InputNumber min={0} placeholder={`Nilai`} className="!w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AddKpiDivDetail;
