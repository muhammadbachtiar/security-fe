/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import KPIService from "@/services/kpi/kpi.service";
import StaffService from "@/services/staff/staff.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Switch,
  Typography,
} from "antd";
import { AxiosError } from "axios";
import { PencilIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import dayjs from "dayjs";

function EditKpiStaff({ kpiId }: { kpiId: number }) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const { data: kpi, isLoading } = useQuery({
    queryKey: ["KPI_STAFF", kpiId, modal.isOpen],
    enabled: modal.isOpen,
    queryFn: async () => {
      const response = await KPIService.getOneStaff(kpiId, {
        with: "detail,staff",
      });
      return response;
    },
  });

  const { data: staffs } = useQuery({
    queryKey: ["STAFFS"],
    queryFn: async () => {
      const response = await StaffService.getAll({
        page_size: 9999,
        page: 1,
      });
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);

      await KPIService.updateStaff(kpiId, {
        ...val,
        status: val?.status ? "active" : "inactive",
        to: dayjs(val?.to).format("YYYY-MM-DD"),
        from: dayjs(val?.from).format("YYYY-MM-DD"),
      });
      queryClient.invalidateQueries({
        queryKey: ["KPIS_STAFF"],
      });
      queryClient.invalidateQueries({
        queryKey: ["KPI_STAFF", kpiId],
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
      form.setFieldValue("staff_id", kpi.data.staff_id);
      form.setFieldValue("from", dayjs(kpi.data.from));
      form.setFieldValue("to", dayjs(kpi.data.to));
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
        title={<Typography.Title level={4}>Edit KPI</Typography.Title>}
      >
        <Form
          form={form}
          requiredMark
          layout="vertical"
          onFinish={onSubmit}
          autoComplete="off"
        >
          <div className="flex gap-3">
            <Form.Item
              name="from"
              label="Dari"
              className="!mb-2 w-full"
              rules={[{ required: true, message: "Tanggal harus diisi" }]}
            >
              <DatePicker
                allowClear={false}
                format="DD/MM/YYYY"
                className="w-full"
              />
            </Form.Item>
            <Form.Item
              name="to"
              label="Sampai"
              className="!mb-2 w-full"
              rules={[{ required: true, message: "Tanggal harus diisi" }]}
            >
              <DatePicker
                allowClear={false}
                format="DD/MM/YYYY"
                className="w-full"
              />
            </Form.Item>
          </div>
          <Form.Item
            label="Nama"
            name="name"
            className="w-full !mb-2"
            rules={[{ required: true, message: "Nama harus diisi" }]}
          >
            <Input placeholder="Nama" />
          </Form.Item>

          <Form.Item
            name="staff_id"
            label="Staff"
            className="!mb-2 w-full"
            rules={[{ required: true, message: "Staff harus diisi" }]}
          >
            <Select
              placeholder="Pilih Staff"
              options={staffs?.data.map((val) => ({
                label: val.nama,
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

export default EditKpiStaff;
