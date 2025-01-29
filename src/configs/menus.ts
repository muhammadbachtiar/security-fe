import {
  BookUpIcon,
  BoxesIcon,
  CalendarCheckIcon,
  CalendarMinusIcon,
  CircleGaugeIcon,
  Clock9Icon,
  FileClockIcon,
  GaugeIcon,
  NetworkIcon,
  UsersIcon,
  WeightIcon,
} from "lucide-react";

export const getMenus = (pathName: string) => {
  if (pathName.startsWith("/warehouse")) {
    return [
      {
        title: "Dashboard",
        url: "/warehouse",
        icon: GaugeIcon,
      },
      {
        title: "Satuan",
        url: "/warehouse/satuan",
        icon: WeightIcon,
      },
      {
        title: "Kategori",
        url: "/warehouse/kategori",
        icon: BoxesIcon,
      },
    ];
  }

  if (pathName.startsWith("/human-resource")) {
    return [
      {
        title: "Dashboard",
        url: "/human-resource",
        icon: GaugeIcon,
      },
      {
        title: "Absensi",
        url: "/human-resource/absensi",
        icon: FileClockIcon,
      },
      {
        title: "Staff",
        url: "/human-resource/staff",
        icon: UsersIcon,
      },
      {
        title: "Divisi",
        url: "/human-resource/divisi",
        icon: NetworkIcon,
      },
      {
        title: "Shift",
        url: "/human-resource/shift",
        icon: CalendarCheckIcon,
      },
      {
        title: "Cuti & Izin",
        url: "/human-resource/leave",
        icon: CircleGaugeIcon,
      },
      {
        title: "Lembur",
        url: "/human-resource/overtime",
        icon: Clock9Icon,
      },
      {
        title: "Laporan",
        url: "/human-resource/laporan",
        icon: BookUpIcon,
      },
      {
        title: "Hari Libur",
        url: "/human-resource/hari-libur",
        icon: CalendarMinusIcon,
      },
    ];
  }

  return [];
};
