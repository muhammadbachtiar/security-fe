/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
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
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import FormItem from "./form-items";
import KPIService from "@/services/kpi/kpi.service";
import { toast } from "sonner";
import StaffService from "@/services/staff/staff.service";
import dayjs from "dayjs";

function AddKPIStaff() {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

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

  const setFormItem = (value: boolean, index: number) => {
    form.setFieldValue(["details", index, "isPercent"], value);
  };

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);

      const payload = {
        ...val,
        from: dayjs(val?.from).format("YYYY-MM-DD"),
        to: dayjs(val?.to).format("YYYY-MM-DD"),
        status: val?.status ? "active" : "inactive",
        details: val.details.map((detail: any) => {
          const isPercent = !!detail?.isPercent;

          return {
            key: detail.key,
            value: isPercent ? +detail.value / 100 : detail.value,
          };
        }),
      };

      await KPIService.createStaff(payload);

      queryClient.invalidateQueries({
        queryKey: ["KPIS_STAFF"],
      });
      toast.success("KPI berhasil dibuat");
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
        <span className="!hidden md:!inline">Tambah KPI</span>
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
        title={<Typography.Title level={4}>Tambah KPI</Typography.Title>}
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

          <Form.List
            name="details"
            rules={[
              {
                validator: async (_, value) => {
                  if (!value || value.length < 1) {
                    return Promise.reject(
                      new Error("Minimal harus ada 1 detail!")
                    );
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <FormItem
                    key={index}
                    form={form}
                    setFormItem={setFormItem}
                    field={field}
                    index={index}
                    remove={remove}
                  />
                ))}
                <Form.Item className="!mb-0">
                  <Button
                    type="dashed"
                    className="w-full"
                    onClick={() => add()}
                    icon={<PlusIcon />}
                  >
                    Tambah Detail
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </>
  );
}

export default AddKPIStaff;
