/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import errorResponse from "@/lib/error";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, InputNumber, Select } from "antd";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GUDANG_TYPE_OPTIONS } from "../_constant";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { LatLngExpression } from "leaflet";
import { MAX_ZOOM_LEVEL, MIN_ZOOM_LEVEL } from "@/lib/constants";
import { useMapEvents } from "react-leaflet";
import GudangService from "@/services/gudang/gudang.service";
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

function AddGudangPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [L, setL] = useState<typeof import("leaflet") | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [myLatitude, setMyLatitude] = useState<number | null>(-6.186156);
  const [myLongitude, setMyLongitude] = useState<number | null>(106.843649);
  const [marker, setMarker] = useState<any>(null);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          setMyLatitude(position.coords.latitude);
          setMyLongitude(position.coords.longitude);
        },
        (error: GeolocationPositionError) => {
          if (error.code === error.PERMISSION_DENIED) {
            setMyLatitude(-6.187185);
            setMyLongitude(106.828785);
          }
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setMarker([e.latlng.lat, e.latlng.lng]);
        form.setFieldValue("marker", "true");
      },
    });
    return null;
  };

  useEffect(() => {
    import("leaflet").then((leaflet) => {
      setL(leaflet);
    });
  }, []);

  const redIcon = L?.icon({
    iconUrl: "/images/placeholder.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      if (marker) {
        await GudangService.create({
          ...val,
          lat: marker?.[0],
          long: marker?.[1],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["WAREHOUSES"],
      });
      toast.success("Gudang berhasil dibuat");
      form.resetFields();
      router.push("/warehouse/gudang");
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
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <AppBreadcrumbs
          items={[
            {
              title: "Home",
              url: "/",
            },
            {
              title: "Gudang",
              url: "/gudang",
            },
            {
              title: "Tambah Gudang",
              url: "#",
            },
          ]}
        />
      </div>
      <div className="bg-white p-4 rounded-lg space-y-4">
        <div className="border-b pb-3">
          <p className="text-xl font-medium">Tambah Gudang</p>
        </div>

        <Form
          form={form}
          requiredMark
          layout="vertical"
          className="bg-white !p-3 rounded"
          onFinish={onSubmit}
        >
          <Form.Item
            label="Nama Gudang"
            name="nama"
            className="w-full !mb-2"
            rules={[{ required: true, message: "Nama harus diisi" }]}
          >
            <Input placeholder="Nama" maxLength={255} />
          </Form.Item>

          <Form.Item
            label="Alamat Gudang"
            name="alamat"
            className="w-full !mb-2"
            rules={[{ required: true, message: "Alamat harus diisi" }]}
          >
            <Input.TextArea placeholder="Alamat" maxLength={255} />
          </Form.Item>
          <Form.Item
            label="Deskripsi"
            name="deskripsi"
            className="w-full !mb-2"
          >
            <Input.TextArea placeholder="Tulis deskripsi..." maxLength={255} />
          </Form.Item>

          <Form.Item
            label="Tipe Gudang"
            name="tipe"
            className="!mb-2 w-full"
            rules={[{ required: true, message: "Tipe gudang harus diisi" }]}
          >
            <Select placeholder="Pilih Tipe" options={GUDANG_TYPE_OPTIONS} />
          </Form.Item>

          <div className="flex gap-2">
            <Form.Item
              label="Email"
              name="email"
              className="w-full !mb-2"
              rules={[{ required: true, message: "Email harus diisi" }]}
            >
              <Input placeholder="Email" maxLength={255} />
            </Form.Item>
            <Form.Item
              label="Nomor Telepon"
              name="no_telp"
              className="!mb-2 w-full"
              rules={[{ required: true, message: "Nomor Telepon harus diisi" }]}
            >
              <Input placeholder="Nomor Telepon" maxLength={255} />
            </Form.Item>
          </div>

          <div className="flex gap-2">
            <Form.Item
              label="Kapasitas"
              name="kapasitas"
              className="w-full !mb-2"
              rules={[{ required: true, message: "Kapasitas harus diisi" }]}
            >
              <InputNumber className="!w-full" min={0} placeholder="0" />
            </Form.Item>
            <Form.Item
              label="Luas"
              name="luas"
              className="!mb-2 w-full"
              rules={[{ required: true, message: "Luas Telepon harus diisi" }]}
            >
              <InputNumber className="!w-full" min={0} placeholder="0" />
            </Form.Item>
          </div>

          <Form.Item
            label="Titik Lokasi"
            name="marker"
            className="!mb-2 w-full"
            rules={[{ required: true, message: "Lokasi harus diisi" }]}
          >
            <MapContainer
              center={[myLatitude, myLongitude] as LatLngExpression}
              zoom={12}
              minZoom={MIN_ZOOM_LEVEL}
              maxZoom={MAX_ZOOM_LEVEL}
              style={{ height: 500, width: "100%" }}
              zoomControl={true}
            >
              <MapClickHandler />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {marker && (
                <Marker icon={redIcon} position={marker as LatLngExpression} />
              )}
            </MapContainer>
          </Form.Item>

          <div className="flex justify-end mt-5">
            <Button loading={loading} htmlType="submit" type="primary">
              Tambah
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default AddGudangPage;
