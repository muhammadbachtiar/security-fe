import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import DivisionService from "@/services/divisi/divisi.service";
import { RequestBodyDivision } from "@/services/divisi/divisi.type";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Select, Typography } from "antd";
import { AxiosError } from "axios";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function AddSubDivision() {
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

  const onSubmit = async (val: RequestBodyDivision) => {
    try {
      setLoading(true);

      await DivisionService.add({ ...val });
      queryClient.invalidateQueries({
        queryKey: ["DIVISIONS"],
      });
      toast.success("Divisi berhasil dibuat");
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
        <span className="!hidden md:!inline">Tambah Sub Divisi</span>
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
        title={<Typography.Title level={4}>Tambah Sub Divisi</Typography.Title>}
      >
        <Form
          form={form}
          requiredMark
          layout="vertical"
          onFinish={onSubmit}
          autoComplete="off"
        >
          <div className="space-y-3">
            <Form.Item
              name="division_id"
              label="Divisi"
              className="!mb-2 w-full"
              rules={[{ required: true, message: "Divisi harus diisi" }]}
            >
              <Select
                placeholder="Parent Divisi"
                options={divisions?.data.map((div) => ({
                  label: div.name,
                  value: div.id,
                }))}
              />
            </Form.Item>

            <Form.Item
              label="Nama"
              name="name"
              className="w-full !mb-2"
              rules={[{ required: true, message: "Nama harus diisi" }]}
            >
              <Input placeholder="Nama" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
}

export default AddSubDivision;
