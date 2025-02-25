/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import DivisionService from "@/services/divisi/divisi.service";
import KPIService from "@/services/kpi/kpi.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Select, Switch, Typography } from "antd";
import { AxiosError } from "axios";
import { PencilIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function EditKpiDiv({ kpiId }: { kpiId: number }) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const { data: kpi, isLoading } = useQuery({
    queryKey: ["KPI_DIV", kpiId, modal.isOpen],
    enabled: modal.isOpen,
    queryFn: async () => {
      const response = await KPIService.getOne(kpiId, {
        with: "detail",
      });
      return response;
    },
  });

  const { data: divisions } = useQuery({
    queryKey: ["DIVISIONS"],
    queryFn: async () => {
      const response = await DivisionService.getAll({
        page_size: 9999,
        page: 1,
      });
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);

      await KPIService.update(kpiId, {
        ...val,
        status: val?.status ? "active" : "inactive",
      });
      queryClient.invalidateQueries({
        queryKey: ["KPIS_DIV"],
      });
      queryClient.invalidateQueries({
        queryKey: ["KPI_DIV", kpiId],
      });
      toast.success("KPI berhasil diupdate");
      form.resetFields();
      modal.onClose();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (kpi) {
      form.setFieldValue("name", kpi.data.name);
      form.setFieldValue("status", kpi.data.status === "active");
      form.setFieldValue("division_id", kpi.data.division_id);
    }
  }, [kpi]);

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
        title={<Typography.Title level={4}>Edit Hari Libur</Typography.Title>}
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
            name="name"
            className="w-full !mb-2"
            rules={[{ required: true, message: "Nama harus diisi" }]}
          >
            <Input placeholder="Nama" />
          </Form.Item>

          <Form.Item
            name="division_id"
            label="Divisi"
            className="!mb-2 w-full"
            rules={[{ required: true, message: "Divisi harus diisi" }]}
          >
            <Select
              placeholder="Pilih Divisi"
              options={divisions?.data.map((val) => ({
                label: val.name,
                value: val.id,
              }))}
            />
          </Form.Item>

          <Form.Item label="Aktif" name="status" className="w-full !mb-2">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default EditKpiDiv;
