import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import HolidayService from "@/services/holiday/holiday.service";
import { useQueryClient } from "@tanstack/react-query";
import { Button, DatePicker, Form, Input, Modal, Typography } from "antd";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function AddHoliday() {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);

      await HolidayService.create({
        ...val,
        date: dayjs(val?.date).format("YYYY-MM-DD"),
      });

      queryClient.invalidateQueries({
        queryKey: ["HOLIDAYS"],
      });
      toast.success("Hari libur berhasil dibuat");
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
        <span className="!hidden md:!inline">Tambah Hari Libur</span>
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
        title={<Typography.Title level={4}>Tambah Hari Libur</Typography.Title>}
      >
        <Form
          form={form}
          requiredMark
          layout="vertical"
          onFinish={onSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Hari Libur"
            name="name"
            className="w-full !mb-2"
            rules={[{ required: true, message: "Hari Libur harus diisi" }]}
          >
            <Input placeholder="Natal, Idul Fitri, dll." />
          </Form.Item>

          <Form.Item
            label="Deskripsi"
            name="description"
            className="w-full !mb-2"
          >
            <Input.TextArea placeholder="Tulis Deskripsi..." maxLength={255} />
          </Form.Item>

          <Form.Item
            name="date"
            label="Tanggal"
            className="!mb-2 w-full"
            rules={[{ required: true, message: "Tanggal harus diisi" }]}
          >
            <DatePicker
              allowClear={false}
              format="DD/MM/YYYY"
              className="w-full"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AddHoliday;
