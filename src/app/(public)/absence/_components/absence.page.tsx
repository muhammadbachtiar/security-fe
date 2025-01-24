/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import errorResponse from "@/lib/error";
import AbsenceService from "@/services/absence/absence.service";
import ShiftService from "@/services/shift/shift.service";
import { useQuery } from "@tanstack/react-query";
import { Button, Form, Input, Select } from "antd";
import { AxiosError } from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function AbsencePage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationDenied, setLocationDenied] = useState<boolean>(false);

  const { data: shifts } = useQuery({
    queryKey: ["SHIFTS"],
    queryFn: async () => {
      const response = await ShiftService.getAll({
        page_size: 9999,
        page: 1,
      });
      return response;
    },
  });

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error: GeolocationPositionError) => {
          if (error.code === error.PERMISSION_DENIED) {
            setLocationDenied(true);
          }
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      const payload = {
        nip: val.nip,
        via: val.via,
        shift_id: val.shift_id,
        lat: latitude,
        long: longitude,
        ...(val.via === "out" && {
          lat_pulang: latitude,
          long_pulang: longitude,
        }),
      };

      await AbsenceService.create(payload);
      toast.success("Berhasil absen hari ini!");
      form.resetFields();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <main className="space-y-4 py-5 px-4">
      <div className="flex justify-center">
        <div className="space-y-8">
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
          <p className="text-center font-semibold text-2xl">Absensi</p>
        </div>
      </div>

      {locationDenied ? (
        <div className="space-y-4">
          <p className="font-semibold text-lg text-center">
            Anda tidak mengizinkan lokasi di browser anda, silahkan aktifkan
            terlebih dahulu!
          </p>
          <div className="border rounded-lg overflow-hidden w-fit mx-auto">
            <Image
              width={500}
              height={300}
              priority
              alt={"Aktivasi Lokasi"}
              src={"/images/activation-browser.jpg"}
              sizes="100vw"
              style={{
                width: "380px",
                height: "auto",
              }}
            />
          </div>
          <div className="border rounded-lg overflow-hidden w-fit mx-auto">
            <Image
              width={500}
              height={300}
              priority
              alt={"Aktivasi Lokasi"}
              src={"/images/activation-location.jpg"}
              sizes="100vw"
              style={{
                width: "380px",
                height: "auto",
              }}
            />
          </div>
        </div>
      ) : (
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
            label="Shift"
            name="shift_id"
            className="!mb-2"
            rules={[{ required: true, message: "Shift harus diisi" }]}
          >
            <Select
              placeholder="Pilih Shift"
              options={shifts?.data.map((s) => ({
                label: `${s.nama} (${s.jam_masuk
                  .split(":")
                  .slice(0, 2)
                  .join(":")} - ${s.jam_keluar
                  .split(":")
                  .slice(0, 2)
                  .join(":")})`,
                value: s.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="In/Out"
            name="via"
            className="!mb-2"
            rules={[{ required: true, message: "Jenis absen harus diisi" }]}
          >
            <Select
              placeholder="Pilih In/Out"
              options={[
                {
                  label: "Out",
                  value: "out",
                },
                {
                  label: "In",
                  value: "in",
                },
              ]}
            />
          </Form.Item>

          <div className="flex justify-end pt-2">
            <Button loading={loading} type="primary" htmlType="submit">
              Absen
            </Button>
          </div>
        </Form>
      )}
    </main>
  );
}

export default AbsencePage;
