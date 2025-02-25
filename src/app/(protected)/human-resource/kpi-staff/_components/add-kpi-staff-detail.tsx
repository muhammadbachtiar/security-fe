/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import KPIService from "@/services/kpi/kpi.service";
import { useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Switch,
  Typography,
} from "antd";
import { AxiosError } from "axios";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function AddKpiStaffDetail({ detailId }: { detailId: number }) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isPercent, setIsPercent] = useState(false);

  const queryClient = useQueryClient();

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);

      await KPIService.createDetailStaff({
        ...val,
        task_kpi_id: detailId,
        value: isPercent ? +val.value / 100 : val.value,
      });

      queryClient.invalidateQueries({
        queryKey: ["KPI_STAFF", detailId.toString()],
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

          <div className="mb-2 space-y-2">
            <p>Pakai Persentase</p>
            <Switch
              size="small"
              onChange={(v) => {
                setIsPercent(v);
              }}
            />
          </div>

          <Form.Item
            label="Nilai"
            name={"value"}
            className="!mb-0"
            rules={[{ required: true, message: "Nilai harus diisi" }]}
          >
            <InputNumber
              className="!w-full"
              suffix={isPercent ? "%" : ""}
              max={isPercent ? 100 : undefined}
              placeholder={isPercent ? "0%" : "10000"}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AddKpiStaffDetail;
