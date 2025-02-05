/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import PayrollService from "@/services/payroll/payroll.service";
import StaffService from "@/services/staff/staff.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Typography,
} from "antd";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function AddPayroll() {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const { data: staffs } = useQuery({
    queryKey: ["STAFFS"],
    queryFn: async () => {
      const response = await StaffService.getAll({
        page_size: 1000000,
        page: 1,
      });
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);

      await PayrollService.create({
        ...val,
        from: dayjs(val?.from).format("YYYY-MM-DD"),
        to: dayjs(val?.to).format("YYYY-MM-DD"),
      });

      queryClient.invalidateQueries({
        queryKey: ["PAYROLLS"],
      });
      toast.success("Payroll berhasil dibuat");
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
        <span className="!hidden md:!inline">Tambah Payroll</span>
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
        title={<Typography.Title level={4}>Tambah Payroll</Typography.Title>}
      >
        <Form
          form={form}
          requiredMark
          layout="vertical"
          onFinish={onSubmit}
          autoComplete="off"
        >
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
                  <Form.Item
                    className="!mb-2"
                    label={index === 0 ? "Detail" : ""}
                    required={true}
                    key={field.key}
                  >
                    <div className="flex gap-2 p-4 items-end border rounded">
                      <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
                        <Form.Item
                          {...field}
                          label="Key"
                          name={[field.name, "key"]}
                          validateTrigger={["onChange", "onBlur"]}
                          className="!mb-0"
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: "",
                            },
                          ]}
                        >
                          <Input placeholder={`Key`} className="w-full" />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          label="Nilai"
                          name={[field.name, "value"]}
                          validateTrigger={["onChange", "onBlur"]}
                          className="!mb-0"
                          rules={[
                            {
                              required: true,
                              message: "",
                            },
                          ]}
                        >
                          <InputNumber
                            min={0}
                            placeholder={`Nilai`}
                            className="!w-full"
                          />
                        </Form.Item>
                      </div>
                      <Button
                        onClick={() => remove(field.name)}
                        className="!border-red-500"
                      >
                        <TrashIcon className="w-5 h-5 text-red-500 " />
                      </Button>
                    </div>
                  </Form.Item>
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

export default AddPayroll;
