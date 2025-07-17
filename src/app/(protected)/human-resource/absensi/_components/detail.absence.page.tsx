"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import "moment/locale/id";

import "leaflet/dist/leaflet.css";
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

import L, { LatLngExpression } from "leaflet";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Skeleton } from "antd";
import moment from "moment";
import AbsenceService from "@/services/absence/absence.service";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import {
  DEFAULT_MAP_ZOOM,
  MAX_ZOOM_LEVEL,
  MIN_ZOOM_LEVEL,
} from "@/lib/constants";

function DetailAbsence() {
  const { absenceId } = useParams();
  const [marker, setMarker] = useState<number[]>([]);
  const [markerOut, setMarkerOut] = useState<number[]>([]);
  const { data: absence, isLoading } = useQuery({
    queryKey: ["ABSENCES", absenceId],
    queryFn: async () => {
      const response = await AbsenceService.getOne(+absenceId, {
        with: "staff",
      });
      return response;
    },
  });

  const blueIcon = L.icon({
    iconUrl: "/images/placeholder_blue.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
  const redIcon = L.icon({
    iconUrl: "/images/placeholder.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  useEffect(() => {
    if (absence) {
      setMarker([absence?.data?.lat, absence?.data?.long]);
      if (absence?.data?.lat_pulang && absence?.data?.long_pulang) {
        setMarkerOut([absence.data.lat_pulang, absence.data.long_pulang]);
      }
    }
  }, [absence]);

  if (isLoading) {
    return (
      <div className="p-10">
        <Skeleton />
      </div>
    );
  }

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
              title: "Absensi",
              url: "/human-resource/absensi",
            },
            {
              title: absence?.data?.staff?.nama || "",
              url: "#",
            },
          ]}
        />
      </div>
      <div className="bg-white p-4 rounded-lg space-y-4">
        <div className="p-4 mb-3 grid grid-cols-2 gap-y-3">
          <div className="space-y-2">
            <p className="font-bold">Tanggal</p>
            <p>{moment(absence?.data.tanggal).format("LL")}</p>
          </div>
          <div className="space-y-2">
            <p className="font-bold">Staff</p>
            <p>{absence?.data.staff.nama}</p>
          </div>
          <div className="space-y-2">
            <p className="font-bold">Jam Masuk</p>
            <p>{moment(absence?.data?.masuk).format("HH:mm")}</p>
          </div>
          <div className="space-y-2">
            <p className="font-bold">Jam Keluar</p>
            <p>
              {absence?.data?.keluar
                ? moment(absence?.data?.keluar).format("HH:mm")
                : "-"}
            </p>
          </div>
        </div>
        <div className="border">
          {marker.length ? (
            <MapContainer
              center={marker as LatLngExpression}
              zoom={DEFAULT_MAP_ZOOM}
              minZoom={MIN_ZOOM_LEVEL}
              maxZoom={MAX_ZOOM_LEVEL}
              className="h-[380px] w-full"
              zoomControl={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker icon={redIcon} position={marker as LatLngExpression} />
              {markerOut.length ? (
                <Marker
                  icon={blueIcon}
                  position={markerOut as LatLngExpression}
                />
              ) : null}
            </MapContainer>
          ) : null}
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-red-500" />
            <p>Lokasi Absen Masuk</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-blue-500" />
            <p>Lokasi Absen Pulang</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailAbsence;
