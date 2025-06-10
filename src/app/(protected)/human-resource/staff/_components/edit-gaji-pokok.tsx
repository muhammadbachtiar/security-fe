/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import StaffService from "@/services/staff/staff.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, InputNumber, Modal, Tooltip, Typography } from "antd";
import { AxiosError } from "axios";
import { NotebookPenIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function EditGajiPokok({ staffId }: { staffId: number }) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const { data: staff, isLoading } = useQuery({
    queryKey: ["STAFF", staffId],
    enabled: modal.isOpen,
    queryFn: async () => {
      const response = await StaffService.getOne(+staffId);
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);

      await StaffService.update(staffId, val);

      queryClient.invalidateQueries({
        queryKey: ["STAFFS"],
      });
      queryClient.invalidateQueries({
        queryKey: ["STAFF", staffId],
      });

      toast.success("Gaji pokok berhasil dibuat");
      form.resetFields();
      modal.onClose();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (staff) {
      form.setFieldValue("salary", staff.data.salary);
    }
  }, [staff]);

  return (
    <Tooltip title="Gaji Pokok">
      <Button
        onClick={() => modal.onOpen()}
        icon={<NotebookPenIcon className="w-4 h-4 !text-orange-500" />}
        type="text"
      ></Button>
      <Modal
        open={modal.isOpen}
        maskClosable={false}
        onCancel={() => {
          modal.onClose();
          form.resetFields();
        }}
        okText="Simpan"
        loading={isLoading}
        okButtonProps={{
          onClick: form.submit,
        }}
        confirmLoading={loading}
        title={<Typography.Title level={4}>Edit Gaji Pokok</Typography.Title>}
      >
        <Form
          form={form}
          requiredMark
          layout="vertical"
          onFinish={onSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Gaji Pokok"
            name="salary"
            className="!mb-0"
            rules={[{ required: true, message: "Gaji pokok harus diisi" }]}
          >
            <InputNumber
              prefix="Rp. "
              min={0}
              placeholder={`0`}
              className="!w-full"
            />
          </Form.Item>
        </Form>
      </Modal>
    </Tooltip>
  );
}

export default EditGajiPokok;
