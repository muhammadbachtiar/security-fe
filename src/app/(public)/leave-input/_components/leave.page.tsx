/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import LeaveService from "@/services/leave/leave.service";
import { Button, DatePicker, Form, Input, Select, TimePicker } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

function LeavePage() {
  const [form] = Form.useForm();
  const type = Form.useWatch("tipe", form);

  const [loading, setLoading] = useState(false);
  const disabledDate = (current: dayjs.Dayjs | null) => {
    // Nonaktifkan tanggal besok dan seterusnya
    return current && current > dayjs().endOf("day");
  };
  // const [loadingUpload, setLoadingUpload] = useState(false);
  // const [dateValue, setDateValue] = useState<dayjs.Dayjs[]>([]);

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      const today = moment().format("YYYY-MM-DD");
      const beforeFormatIn = dayjs(val.jam).format("HH:mm");
      const hour = moment(`${today} ${beforeFormatIn}`, "YYYY-MM-DD HH:mm")
        .utc()
        .format("YYYY-MM-DDTHH:mm:ss.SSSSSSZ");

      const payload = {
        nip: val.nip,
        tipe: val.tipe,
        alasan: val.alasan,
        ...(val?.dates && {
          tanggal_mulai: dayjs(val.dates[0]).format("YYYY-MM-DD"),
          tanggal_selesai: dayjs(val.dates[1]).format("YYYY-MM-DD"),
        }),
        ...(val?.jam && {
          jam: hour,
        }),
        keterangan: "",
        ...(val?.tanggal && {
          tanggal: dayjs(val.tanggal).format("YYYY-MM-DD"),
        }),
      };

      await LeaveService.create(payload);
      toast.success("Leave sudah diajukan!");
      form.resetFields();
    } catch {
      toast.error("NIP tidak ditemukan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="space-y-4 py-5 px-4">
      <div className="flex justify-center">
        <div className="space-y-8 flex flex-col items-center">
          <Image
            width={500}
            height={300}
            priority
            alt={"Banner Login"}
            src={"/images/sarana-logo.png"}
            sizes="100vw"
            style={{
              width: "200px",
              height: "auto",
            }}
          />
          <p className="text-center font-semibold text-2xl">
            Pengajuan Cuti & Izin
          </p>
        </div>
      </div>

      <Form
        className="border !p-4 rounded-lg"
        form={form}
        requiredMark
        layout="vertical"
        onFinish={onSubmit}
      >
        <Form.Item
          label="Tipe"
          name="tipe"
          className="!mb-2"
          rules={[{ required: true, message: "Tipe harus diisi" }]}
        >
          <Select
            placeholder="Pilih Tipe"
            options={[
              {
                value: "ijin",
                label: "Izin",
              },
              {
                value: "cuti",
                label: "Cuti",
              },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="NIP"
          name="nip"
          className="w-full !mb-2"
          rules={[{ required: true, message: "NIP harus diisi" }]}
        >
          <Input placeholder="NIP" maxLength={255} />
        </Form.Item>

        <div className="space-y-2 mb-2">
          {type === "ijin" && (
            <>
              <Form.Item
                label="Jam"
                name="jam"
                className="w-full !mb-2"
                rules={[{ required: true, message: "Jam harus diisi" }]}
              >
                <TimePicker
                  placeholder="Waktu"
                  className="w-full"
                  showSecond={false}
                />
              </Form.Item>

              <Form.Item
                label="Tanggal"
                name="tanggal"
                className="w-full !mb-2"
                rules={[{ required: true, message: "Tanggal harus diisi" }]}
              >
                <DatePicker
                  size="middle"
                  placeholder={"Tanggal"}
                  format={"DD/MM/YYYY"}
                  className="w-full"
                  disabledDate={disabledDate as any}
                />
              </Form.Item>
            </>
          )}
          {type === "cuti" && (
            <Form.Item
              label="Tanggal"
              name="dates"
              className="w-full !mb-2"
              rules={[{ required: true, message: "Tanggal harus diisi" }]}
            >
              <DatePicker.RangePicker
                size="middle"
                placeholder={["Tanggal Mulai", "Tanggal Selesai"]}
                format={"DD/MM/YYYY"}
                className="w-full"
              />
            </Form.Item>
          )}
        </div>

        <Form.Item
          label="Alasan"
          name="alasan"
          className="w-full !mb-2"
          rules={[{ required: true, message: "Alasan harus diisi" }]}
        >
          <Input.TextArea placeholder="Tulis alasan..." maxLength={255} />
        </Form.Item>

        <div className="flex justify-end pt-2">
          <Button loading={loading} type="primary" htmlType="submit">
            Ajukan
          </Button>
        </div>
      </Form>
    </main>
  );
}

export default LeavePage;
