import {
  BookUpIcon,
  CalendarCheckIcon,
  CalendarMinusIcon,
  CircleGaugeIcon,
  Clock9Icon,
  FileClockIcon,
  Home,
  NetworkIcon,
  UsersIcon,
  UsersRoundIcon,
} from "lucide-react";

export const getMenus = (pathName: string) => {
  if (pathName.startsWith("/user-management")) {
    return [
      {
        title: "User",
        url: "/user-management",
        icon: UsersRoundIcon,
      },
    ];
  }

  return [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "Absensi",
      url: "/absensi",
      icon: FileClockIcon,
    },
    {
      title: "Staff",
      url: "/staff",
      icon: UsersIcon,
    },
    {
      title: "Divisi",
      url: "/divisi",
      icon: NetworkIcon,
    },
    {
      title: "Shift",
      url: "/shift",
      icon: CalendarCheckIcon,
    },
    {
      title: "Cuti & Izin",
      url: "/leave",
      icon: CircleGaugeIcon,
    },
    {
      title: "Lembur",
      url: "/overtime",
      icon: Clock9Icon,
    },
    {
      title: "Laporan",
      url: "/laporan",
      icon: BookUpIcon,
    },
    {
      title: "Hari Libur",
      url: "/hari-libur",
      icon: CalendarMinusIcon,
    },
  ];
};
