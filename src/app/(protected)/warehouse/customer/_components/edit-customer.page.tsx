/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import errorResponse from "@/lib/error";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Skeleton } from "antd";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import L, { LatLngExpression } from "leaflet";
import { MAX_ZOOM_LEVEL, MIN_ZOOM_LEVEL } from "@/lib/constants";
import { useMapEvents } from "react-leaflet";
import CustomerService from "@/services/customer/customer.service";
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

function EditGudang() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [myLatitude, setMyLatitude] = useState<number | null>(null);
  const [myLongitude, setMyLongitude] = useState<number | null>(null);
  const [marker, setMarker] = useState<any>(null);

  const { customerId } = useParams();

  const { data: customer, isLoading } = useQuery({
    queryKey: ["CUSTOMER", customerId],
    queryFn: async () => {
      const response = await CustomerService.getOne(+customerId);
      return response;
    },
  });

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setMarker([e.latlng.lat, e.latlng.lng]);
        form.setFieldValue("marker", "true");
      },
    });
    return null;
  };

  const redIcon = L.icon({
    iconUrl: "/images/placeholder.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

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

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      if (marker) {
        await CustomerService.update(+customerId, {
          ...val,
          lat: marker?.[0],
          long: marker?.[1],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["CUSTOMERS"],
      });
      queryClient.invalidateQueries({
        queryKey: ["CUSTOMER", customerId],
      });
      toast.success("Customer berhasil diperbarui");
      form.resetFields();
      router.push("/warehouse/customer");
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customer) {
      form.setFieldValue("name", customer?.data.name);
      form.setFieldValue("address", customer?.data.address);
      form.setFieldValue("mobile_phone", customer?.data.mobile_phone);
      form.setFieldValue("description", customer?.data.description);
      form.setFieldValue("marker", "true");
      setMarker([customer.data.lat, customer.data.long]);
      if (customer.data.lat && customer.data.long) {
        setMyLatitude(+customer.data.lat);
        setMyLongitude(+customer.data.long);
      } else {
        getLocation();
      }
    }
  }, [customer]);

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
              title: "Customer",
              url: "/warehouse/customer",
            },
            {
              title: "Edit Customer",
              url: "#",
            },
          ]}
        />
      </div>
      {isLoading ? (
        <Skeleton />
      ) : (
        <div className="bg-white p-4 rounded-lg space-y-4">
          <div className="border-b pb-3">
            <p className="text-xl font-medium">Edit Customer</p>
          </div>

          <Form
            form={form}
            requiredMark
            layout="vertical"
            className="bg-white !p-3 rounded"
            onFinish={onSubmit}
          >
            <Form.Item
              label="Nama Customer"
              name="name"
              className="w-full !mb-2"
              rules={[{ required: true, message: "Nama harus diisi" }]}
            >
              <Input placeholder="Nama" maxLength={255} />
            </Form.Item>

            <Form.Item
              label="Alamat Customer"
              name="address"
              className="w-full !mb-2"
              rules={[{ required: true, message: "Alamat harus diisi" }]}
            >
              <Input.TextArea placeholder="Alamat" maxLength={255} />
            </Form.Item>
            <Form.Item
              label="Deskripsi"
              name="description"
              className="w-full !mb-2"
            >
              <Input.TextArea
                placeholder="Tulis deskripsi..."
                maxLength={255}
              />
            </Form.Item>

            <Form.Item
              label="Nomor Telepon"
              name="mobile_phone"
              className="!mb-2 w-full"
              rules={[{ required: true, message: "Nomor Telepon harus diisi" }]}
            >
              <Input placeholder="Nomor Telepon" maxLength={255} />
            </Form.Item>

            <Form.Item
              label="Titik Lokasi"
              name="marker"
              className="!mb-2 w-full"
            >
              {myLatitude && myLongitude && (
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
                    <Marker
                      icon={redIcon}
                      position={marker as LatLngExpression}
                    />
                  )}
                </MapContainer>
              )}
            </Form.Item>

            <div className="flex justify-end mt-5">
              <Button loading={loading} htmlType="submit" type="primary">
                Simpan
              </Button>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
}

export default EditGudang;
