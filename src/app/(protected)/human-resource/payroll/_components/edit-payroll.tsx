/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import PayrollService from "@/services/payroll/payroll.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, DatePicker, Form, Modal, Typography } from "antd";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { PencilIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function EditPayroll({ payrollId }: { payrollId: number }) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const { data: payroll, isLoading } = useQuery({
    queryKey: ["PAYROLL", payrollId, modal.isOpen],
    enabled: modal.isOpen,
    queryFn: async () => {
      const response = await PayrollService.getOne(payrollId, {
        with: "detail",
      });
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);

      await PayrollService.update(payrollId, {
        ...val,
        to: dayjs(val?.to).format("YYYY-MM-DD"),
        from: dayjs(val?.from).format("YYYY-MM-DD"),
      });
      queryClient.invalidateQueries({
        queryKey: ["PAYROLLS"],
      });
      queryClient.invalidateQueries({
        queryKey: ["PAYROLL", payrollId],
      });
      toast.success("Payroll berhasil diupdate");
      form.resetFields();
      modal.onClose();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (payroll) {
      form.setFieldValue("from", dayjs(payroll.data.from));
      form.setFieldValue("to", dayjs(payroll.data.to));
    }
  }, [payroll]);

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
        </Form>
      </Modal>
    </>
  );
}

export default EditPayroll;
