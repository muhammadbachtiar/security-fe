/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppBreadcrumbs from "@/components/common/app-breadcrums";
import errorResponse from "@/lib/error";
import DivisionService from "@/services/divisi/divisi.service";
import StaffService from "@/services/staff/staff.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, DatePicker, Form, Input, Select, Skeleton } from "antd";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function EditPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { staffId } = useParams();

  const { data: divisions } = useQuery({
    queryKey: ["DIVISIONS"],
    queryFn: async () => {
      const response = await DivisionService.getAll({
        page_size: 1000000,
        page: 1,
      });
      return response;
    },
  });

  const { data: staff, isLoading } = useQuery({
    queryKey: ["STAFF", staffId],
    queryFn: async () => {
      const response = await StaffService.getOne(+staffId);
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await StaffService.update(+staffId, {
        ...val,
        tanggal_lahir: dayjs(val?.tanggal_lahir).format("YYYY-MM-DD"),
        tanggal_masuk: dayjs(val?.tanggal_masuk).format("YYYY-MM-DD"),
      });
      queryClient.invalidateQueries({
        queryKey: ["STAFFS"],
      });
      toast.success("Staff berhasil diubah");
      form.resetFields();
      router.push("/human-resource/staff");
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (staff) {
      form.setFieldValue("nama", staff.data.nama);
      form.setFieldValue("nip", staff.data.nip);
      form.setFieldValue("ktp", staff.data.ktp);
      form.setFieldValue("gender", staff.data.gender);
      form.setFieldValue("alamat", staff.data.alamat);
      form.setFieldValue("division_id", staff.data.division_id);
      form.setFieldValue("notelp", staff.data.notelp);
      form.setFieldValue("status", staff.data.status);
      form.setFieldValue("status_pernikahan", staff.data.status_pernikahan);
      form.setFieldValue("jabatan", staff.data.jabatan);
      form.setFieldValue("email", staff.data.email);
      form.setFieldValue("npwp", staff?.data?.npwp || "");
      form.setFieldValue("tanggal_lahir", dayjs(staff.data.tanggal_lahir));
      form.setFieldValue("tanggal_masuk", dayjs(staff.data.tanggal_masuk));
    }
  }, [staff]);

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <AppBreadcrumbs
          items={[
            {
              title: "Home",
              url: "/",
            },
            {
              title: "Staff",
              url: "/staff",
            },
            {
              title: "Edit Staff",
              url: "#",
            },
          ]}
        />
      </div>
      <div className="bg-white p-4 rounded-lg space-y-4">
        <div className="border-b pb-3">
          <p className="text-xl font-medium">Edit Staff</p>
        </div>

        {isLoading ? (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        ) : (
          <Form
            form={form}
            requiredMark
            layout="vertical"
            className="bg-white !p-3 rounded"
            onFinish={onSubmit}
          >
            <div className="flex gap-2">
              <Form.Item
                label="Nama"
                name="nama"
                className="w-full !mb-2"
                rules={[{ required: true, message: "Nama harus diisi" }]}
              >
                <Input placeholder="Nama" maxLength={255} />
              </Form.Item>
              <Form.Item
                label="NIP"
                name="nip"
                className="w-full !mb-2"
                rules={[{ required: true, message: "Nama harus diisi" }]}
              >
                <Input placeholder="Nama" maxLength={255} />
              </Form.Item>
            </div>
            <div className="flex gap-2">
              <Form.Item
                name="tanggal_lahir"
                label="Tanggal Lahir"
                className="!mb-2 w-full"
                rules={[
                  { required: true, message: "Tanggal lahir harus diisi" },
                ]}
              >
                <DatePicker
                  allowClear={false}
                  format="DD/MM/YYYY"
                  className="w-full"
                />
              </Form.Item>

              <Form.Item
                label="Nomor Telepon"
                name="notelp"
                className="!mb-2 w-full"
                rules={[
                  { required: true, message: "Nomor Telepon harus diisi" },
                ]}
              >
                <Input placeholder="Nomor Telepon" maxLength={255} />
              </Form.Item>
            </div>
            <div className="flex gap-2">
              <Form.Item
                name="division_id"
                label="Divisi"
                className="!mb-2 w-full"
                rules={[{ required: true, message: "Divisi harus diisi" }]}
              >
                <Select
                  placeholder="Pilih Divisi"
                  options={divisions?.data.map((val) => ({
                    label: val.name,
                    value: val.id,
                  }))}
                />
              </Form.Item>

              <Form.Item
                label="Status"
                name="status"
                className="!mb-2 w-full"
                rules={[{ required: true, message: "Status harus diisi" }]}
              >
                <Select
                  placeholder="Pilih Status"
                  options={[
                    {
                      label: "Magang",
                      value: "magang",
                    },
                    {
                      label: "Kontrak",
                      value: "kontrak",
                    },
                    {
                      label: "Freelance",
                      value: "freelance",
                    },
                    {
                      label: "Tetap",
                      value: "tetap",
                    },
                  ]}
                />
              </Form.Item>
            </div>

            <div className="flex gap-2">
              <Form.Item
                label="NIK"
                name="ktp"
                className="w-full !mb-2"
                rules={[{ required: true, message: "NIK harus diisi" }]}
              >
                <Input placeholder="NIK" maxLength={255} />
              </Form.Item>
              <Form.Item
                label="Jabatan"
                name="jabatan"
                className="w-full !mb-2"
                rules={[{ required: true, message: "Jabatan harus diisi" }]}
              >
                <Input placeholder="Jabatan" maxLength={255} />
              </Form.Item>
            </div>

            <Form.Item
              label="Alamat"
              name="alamat"
              className="w-full !mb-2"
              rules={[{ required: true, message: "Alamat harus diisi" }]}
            >
              <Input.TextArea placeholder="Alamat" maxLength={255} />
            </Form.Item>

            <div className="flex gap-2">
              <Form.Item
                name="gender"
                label="Jenis Kelamin"
                className="!mb-2 w-full"
                rules={[
                  { required: true, message: "Jenis Kelamin harus diisi" },
                ]}
              >
                <Select
                  placeholder="Jenis Kelamin"
                  options={[
                    {
                      label: "Laki-laki",
                      value: "pria",
                    },
                    {
                      label: "Perempuan",
                      value: "wanita",
                    },
                  ]}
                />
              </Form.Item>

              <Form.Item
                label="Status Perkawinan"
                name="status_pernikahan"
                className="!mb-2 w-full"
                rules={[
                  { required: true, message: "Status perkawinan harus diisi" },
                ]}
              >
                <Select
                  placeholder="Pilih Status"
                  options={[
                    {
                      label: "Menikah",
                      value: "menikah",
                    },
                    {
                      label: "Lajang",
                      value: "lajang",
                    },
                  ]}
                />
              </Form.Item>
            </div>

            <div className="flex gap-2">
              <Form.Item
                label="Email"
                name="email"
                className="w-full !mb-2"
                rules={[{ required: true, message: "Email harus diisi" }]}
              >
                <Input placeholder="Email" maxLength={255} />
              </Form.Item>
              <Form.Item label="NPWP" name="npwp" className="w-full !mb-2">
                <Input placeholder="NPWP" maxLength={255} />
              </Form.Item>
            </div>

            <Form.Item
              name="tanggal_masuk"
              label="Tanggal Masuk"
              className="!mb-2 w-full"
              rules={[{ required: true, message: "Tanggal masuk harus diisi" }]}
            >
              <DatePicker
                allowClear={false}
                format="DD/MM/YYYY"
                className="w-full"
              />
            </Form.Item>

            <div className="flex justify-end mt-5">
              <Button loading={loading} htmlType="submit" type="primary">
                Simpan
              </Button>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
}

export default EditPage;
