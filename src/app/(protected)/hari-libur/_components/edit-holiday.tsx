import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import HolidayService from "@/services/holiday/holiday.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, DatePicker, Form, Input, Modal, Typography } from "antd";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { PencilIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function EditHoliday({ holidayId }: { holidayId: number }) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const { data: holiday, isLoading } = useQuery({
    queryKey: ["HOLIDAY", holidayId, modal.isOpen],
    enabled: modal.isOpen,
    queryFn: async () => {
      const response = await HolidayService.getOne(holidayId);
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);

      await HolidayService.update(holidayId, {
        ...val,
        date: dayjs(val?.date).format("YYYY-MM-DD"),
      });
      queryClient.invalidateQueries({
        queryKey: ["HOLIDAYS"],
      });
      queryClient.invalidateQueries({
        queryKey: ["HOLIDAY", holidayId],
      });
      toast.success("Hari libur berhasil diupdate");
      form.resetFields();
      modal.onClose();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (holiday) {
      form.setFieldValue("name", holiday.data.name);
      form.setFieldValue("date", dayjs(holiday.data.date));
      form.setFieldValue("description", holiday.data.description);
    }
  }, [holiday]);

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
        title={<Typography.Title level={4}>Edit Hari Libur</Typography.Title>}
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

export default EditHoliday;
