import {
  BanknoteIcon,
  BookUpIcon,
  BoxesIcon,
  CalendarCheckIcon,
  CalendarMinusIcon,
  ChartLineIcon,
  ChartNetworkIcon,
  CircleGaugeIcon,
  Clock9Icon,
  ContactRoundIcon,
  ContainerIcon,
  CookingPotIcon,
  FileClockIcon,
  GaugeIcon,
  HandCoinsIcon,
  NetworkIcon,
  Package2Icon,
  UsersIcon,
  WarehouseIcon,
  WeightIcon,
  WheatIcon,
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
      {
        title: "Bahan",
        url: "/warehouse/bahan",
        icon: WheatIcon,
      },
      {
        title: "Produk",
        url: "/warehouse/produk",
        icon: Package2Icon,
      },
      {
        title: "Supplier",
        url: "/warehouse/supplier",
        icon: ContainerIcon,
      },
      {
        title: "Customer",
        url: "/warehouse/customer",
        icon: ContactRoundIcon,
      },
      {
        title: "Gudang",
        url: "/warehouse/gudang",
        icon: WarehouseIcon,
      },
      {
        title: "Recipe",
        url: "/warehouse/recipe",
        icon: CookingPotIcon,
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
      {
        title: "Payroll",
        url: "/human-resource/payroll",
        icon: HandCoinsIcon,
      },
      {
        title: "KPI Divisi",
        url: "/human-resource/kpi-divisi",
        icon: ChartNetworkIcon,
      },
      {
        title: "KPI Staff",
        url: "/human-resource/kpi-staff",
        icon: ChartLineIcon,
      },
      {
        title: "Gaji Staff",
        url: "/human-resource/salary",
        icon: BanknoteIcon,
      },
    ];
  }
  if (pathName.startsWith("/core")) {
    return [
      {
        title: "Dashboard",
        url: "/core",
        icon: GaugeIcon,
      },
      {
        title: "User Management",
        url: "/core/users",
        icon: UsersIcon,
      },
      {
        title: "Role Management",
        url: "/core/roles",
        icon: GaugeIcon,
      },
    ];
  }

  return [];
};
