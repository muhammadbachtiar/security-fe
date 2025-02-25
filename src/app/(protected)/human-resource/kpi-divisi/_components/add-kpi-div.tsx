/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import DivisionService from "@/services/divisi/divisi.service";
import KPIService from "@/services/kpi/kpi.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
  Typography,
} from "antd";
import { AxiosError } from "axios";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function AddKPIDivisi() {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

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

      await KPIService.create({
        ...val,
        status: val?.status ? "active" : "inactive",
      });

      queryClient.invalidateQueries({
        queryKey: ["KPIS_DIV"],
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

export default AddKPIDivisi;
