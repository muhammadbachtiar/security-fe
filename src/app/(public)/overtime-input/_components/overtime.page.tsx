/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import OvertimeService from "@/services/overtime/overtime.service";
import { Button, Form, Input, TimePicker } from "antd";
import dayjs from "dayjs";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

function calculateHours(jam_mulai: string, jam_selesai: string) {
  const [startHour, startMinute] = jam_mulai.split(":").map(Number);
  const [endHour, endMinute] = jam_selesai.split(":").map(Number);

  const startTime = new Date();
  startTime.setHours(startHour, startMinute, 0, 0);

  const endTime = new Date();
  endTime.setHours(endHour, endMinute, 0, 0);

  const startTimeMs = startTime.getTime();
  const endTimeMs = endTime.getTime();

  const diffInMilliseconds = endTimeMs - startTimeMs;
  const hours = diffInMilliseconds / (1000 * 60 * 60);

  return hours;
}

function OvertimePage() {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      const hours = calculateHours(
        dayjs(val.times[0]).format("HH:mm"),
        dayjs(val.times[1]).format("HH:mm")
      );
      const payload = {
        nip: val.nip,
        alasan: val.alasan,
        ...(val?.times && {
          jam_mulai: dayjs(val.times[0]).format("HH:mm"),
          jam_selesai: dayjs(val.times[1]).format("HH:mm"),
        }),
        hours: hours.toFixed(2),
      };

      await OvertimeService.create(payload);
      toast.success("Lembur sudah diajukan!");
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
            className="w-[200px] h-auto"
          />
          <p className="text-center font-semibold text-2xl">Pengajuan Lembur</p>
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
          label="NIP"
          name="nip"
          className="w-full !mb-2"
          rules={[{ required: true, message: "NIP harus diisi" }]}
        >
          <Input placeholder="NIP" maxLength={255} />
        </Form.Item>

        <Form.Item
          label="Jam"
          name="times"
          className="w-full !mb-2"
          rules={[{ required: true, message: "Jam harus diisi" }]}
        >
          <TimePicker.RangePicker
            placeholder={["Waktu Mulai", "Waktu Selesai"]}
            className="w-full"
            showSecond={false}
          />
        </Form.Item>

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

export default OvertimePage;
