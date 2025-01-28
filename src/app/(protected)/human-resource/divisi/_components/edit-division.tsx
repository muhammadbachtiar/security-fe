import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import DivisionService from "@/services/divisi/divisi.service";
import { RequestBodyDivision } from "@/services/divisi/divisi.type";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Select, Typography } from "antd";
import { AxiosError } from "axios";
import { PencilIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function EditDivision({ divId }: { divId: number }) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const { data: division, isLoading } = useQuery({
    queryKey: ["DIVISION", divId, modal.isOpen],
    enabled: modal.isOpen,
    queryFn: async () => {
      const response = await DivisionService.getOne(divId);
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

  const onSubmit = async (val: RequestBodyDivision) => {
    try {
      setLoading(true);

      await DivisionService.update(divId, {
        ...val,
        division_id: val?.division_id || null,
      });
      queryClient.invalidateQueries({
        queryKey: ["DIVISIONS"],
      });
      queryClient.invalidateQueries({
        queryKey: ["DIVISION", divId],
      });
      toast.success("Divisi berhasil diupdate");
      form.resetFields();
      modal.onClose();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (division) {
      form.setFieldValue("name", division.data.name);
      if (division.data?.division_id) {
        form.setFieldValue("division_id", division.data.division_id);
      }
    }
  }, [division]);

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
        title={<Typography.Title level={4}>Edit Divisi</Typography.Title>}
      >
        <Form
          form={form}
          requiredMark
          layout="vertical"
          onFinish={onSubmit}
          autoComplete="off"
        >
          <Form.Item name="division_id" label="Divisi" className="!mb-2 w-full">
            <Select
              allowClear
              placeholder="Parent"
              options={divisions?.data.map((div) => ({
                label: div.name,
                value: div.id,
              }))}
            />
            <p className="text-gray-500 text-sm">
              Jika parent tidak di isi, maka otomatis akan menjadi divisi
              parent.
            </p>
          </Form.Item>

          <Form.Item
            name="name"
            label="Nama"
            className="!mb-2"
            rules={[{ required: true, message: "nama harus diisi!" }]}
          >
            <Input placeholder="Nama" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default EditDivision;
