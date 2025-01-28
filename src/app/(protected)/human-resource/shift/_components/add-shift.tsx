/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import ShiftService from "@/services/shift/shift.service";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, TimePicker, Typography } from "antd";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function AddShift() {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await ShiftService.add({
        ...val,
        jam_masuk: dayjs(val.jam_masuk).format("HH:mm"),
        jam_keluar: dayjs(val.jam_keluar).format("HH:mm"),
      });
      queryClient.resetQueries({
        queryKey: ["SHIFTS"],
      });
      toast.success("Shift berhasil diupdate");
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
        <span className="!hidden md:!inline">Tambah Shift</span>
      </Button>
      <Modal
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
        title={<Typography.Title level={4}>Tambah Shift</Typography.Title>}
      >
        <Form
          form={form}
          requiredMark
          layout="vertical"
          onFinish={onSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="nama"
            label="Nama"
            className="!mb-2"
            rules={[{ required: true, message: "nama harus diisi!" }]}
          >
            <Input placeholder="Nama" />
          </Form.Item>

          <div className="flex gap-2 w-full">
            <Form.Item
              name="jam_masuk"
              label="Jam Masuk"
              className="!mb-2 w-full"
              rules={[{ required: true, message: "jam masuk harus diisi!" }]}
            >
              <TimePicker
                showSecond={false}
                className="!w-full"
                placeholder="Jam Masuk"
              />
            </Form.Item>
            <Form.Item
              name="jam_keluar"
              label="Jam Keluar"
              className="!mb-2 w-full"
              rules={[{ required: true, message: "jam keluar harus diisi!" }]}
            >
              <TimePicker
                showSecond={false}
                className="!w-full"
                placeholder="Jam Keluar"
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
}

export default AddShift;
