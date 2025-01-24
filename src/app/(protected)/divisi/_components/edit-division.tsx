import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import DivisionService from "@/services/divisi/divisi.service";
import { RequestBodyDivision } from "@/services/divisi/divisi.type";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Typography } from "antd";
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

  const onSubmit = async (val: RequestBodyDivision) => {
    try {
      setLoading(true);

      await DivisionService.update(divId, val);
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
