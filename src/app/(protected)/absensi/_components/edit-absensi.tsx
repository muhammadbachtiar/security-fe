/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import AbsenceService from "@/services/absence/absence.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Modal, TimePicker, Typography } from "antd";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { PencilIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function EditAbsensi({ absenceId }: { absenceId: number }) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const { data: absence, isLoading } = useQuery({
    queryKey: ["ABSENCE", absenceId, modal.isOpen],
    enabled: modal.isOpen,
    queryFn: async () => {
      const response = await AbsenceService.getOne(absenceId);
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await AbsenceService.update(absenceId, {
        masuk: dayjs(val.masuk).format("HH:mm"),
        keluar: dayjs(val.keluar).format("HH:mm"),
      });
      queryClient.resetQueries({
        queryKey: ["ABSENCES"],
      });
      toast.success("Absen berhasil diupdate");
      form.resetFields();
      modal.onClose();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (absence) {
      form.setFieldValue("masuk", dayjs(absence.data.masuk, "HH:mm:ss"));
      form.setFieldValue("keluar", dayjs(absence.data.keluar, "HH:mm:ss"));
    }
  }, [absence]);

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
            label="Jam Masuk"
            name="masuk"
            className="w-full !mb-2"
            rules={[{ required: true, message: "Jam masuk harus diisi" }]}
          >
            <TimePicker
              placeholder={"Jam Masuk"}
              className="w-full"
              showSecond={false}
            />
          </Form.Item>
          <Form.Item
            label="Jam Keluar"
            name="masuk"
            className="w-full !mb-2"
            rules={[{ required: true, message: "Jam Keluar harus diisi" }]}
          >
            <TimePicker
              placeholder={"Jam Keluar"}
              className="w-full"
              showSecond={false}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default EditAbsensi;
