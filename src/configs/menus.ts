import {
  BanknoteIcon,
  BookUpIcon,
  BoxesIcon,
  BoxIcon,
  CalendarCheckIcon,
  CalendarMinusIcon,
  CircleGaugeIcon,
  Clock9Icon,
  ContactRoundIcon,
  ContainerIcon,
  CookingPotIcon,
  DockIcon,
  FileBoxIcon,
  FileClockIcon,
  GaugeIcon,
  HandCoinsIcon,
  LayoutTemplateIcon,
  LucideProps,
  NetworkIcon,
  Package2Icon,
  ShoppingBasketIcon,
  UsersIcon,
  WarehouseIcon,
  WeightIcon,
  WheatIcon,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { AppPermission } from "./permissions";

type MenuType = {
  title: string;
  url: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  permission: AppPermission[] | "*";
};

export const getMenus = (pathName: string): MenuType[] => {
  if (pathName.startsWith("/warehouse")) {
    return [
      {
        title: "Dashboard",
        url: "/warehouse",
        icon: GaugeIcon,
        permission: [],
      },
      {
        title: "Satuan",
        url: "/warehouse/satuan",
        icon: WeightIcon,
        permission: [],
      },
      {
        title: "Kategori",
        url: "/warehouse/kategori",
        icon: BoxesIcon,
        permission: [],
      },
      {
        title: "Bahan",
        url: "/warehouse/bahan",
        icon: WheatIcon,
        permission: [],
      },
      {
        title: "Produk",
        url: "/warehouse/produk",
        icon: Package2Icon,
        permission: [],
      },
      {
        title: "Supplier",
        url: "/warehouse/supplier",
        icon: ContainerIcon,
        permission: [],
      },
      {
        title: "Customer",
        url: "/warehouse/customer",
        icon: ContactRoundIcon,
        permission: [],
      },
      {
        title: "Recipe",
        url: "/warehouse/recipe",
        icon: CookingPotIcon,
        permission: [],
      },
      {
        title: "Gudang",
        url: "/warehouse/gudang",
        icon: WarehouseIcon,
        permission: [],
      },
      {
        title: "Produksi",
        url: "/warehouse/produksi",
        icon: BoxIcon,
        permission: [],
      },
      {
        title: "Purchase Order",
        url: "/warehouse/purchase-order",
        icon: FileBoxIcon,
        permission: [],
      },
      {
        title: "Sales Order",
        url: "/warehouse/sales-order",
        icon: ShoppingBasketIcon,
        permission: [],
      },
    ];
  }

  if (pathName.startsWith("/human-resource")) {
    return [
      {
        title: "Dashboard",
        url: "/human-resource",
        icon: GaugeIcon,
        permission: "*",
      },
      {
        title: "Absensi",
        url: "/human-resource/absensi",
        icon: FileClockIcon,
        permission: ["view-absen"],
      },
      {
        title: "Staff",
        url: "/human-resource/staff",
        icon: UsersIcon,
        permission: ["view-staff"],
      },
      {
        title: "Divisi",
        url: "/human-resource/divisi",
        icon: NetworkIcon,
        permission: ["view-division"],
      },
      {
        title: "Shift",
        url: "/human-resource/shift",
        icon: CalendarCheckIcon,
        permission: ["view-shift"],
      },
      {
        title: "Cuti & Izin",
        url: "/human-resource/leave",
        icon: CircleGaugeIcon,
        permission: ["view-leave"],
      },
      {
        title: "Lembur",
        url: "/human-resource/overtime",
        icon: Clock9Icon,
        permission: ["view-overtime"],
      },
      {
        title: "Laporan",
        url: "/human-resource/laporan",
        icon: BookUpIcon,
        permission: ["view-laporan"],
      },
      {
        title: "Hari Libur",
        url: "/human-resource/hari-libur",
        icon: CalendarMinusIcon,
        permission: ["view-hari-libur"],
      },
      {
        title: "Payroll",
        url: "/human-resource/payroll",
        icon: HandCoinsIcon,
        permission: ["view-payroll"],
      },
      // {
      //   title: "KPI Divisi",
      //   url: "/human-resource/kpi-divisi",
      //   icon: ChartNetworkIcon,
      // },
      // {
      //   title: "KPI Staff",
      //   url: "/human-resource/kpi-staff",
      //   icon: ChartLineIcon,
      // },
      {
        title: "Gaji Staff",
        url: "/human-resource/salary",
        icon: BanknoteIcon,
        permission: ["view-salary"],
      },
    ];
  }
  if (pathName.startsWith("/core")) {
    return [
      {
        title: "Dashboard",
        url: "/core",
        icon: GaugeIcon,
        permission: "*",
      },
      {
        title: "User Management",
        url: "/core/users",
        icon: UsersIcon,
        permission: ["view-user"],
      },
      {
        title: "Role Management",
        url: "/core/roles",
        icon: GaugeIcon,
        permission: ["view-role"],
      },
      {
        title: "Plan",
        url: "/core/plan",
        icon: DockIcon,
        permission: "*",
      },
      {
        title: "Subscription",
        url: "/core/subscription",
        icon: LayoutTemplateIcon,
        permission: "*",
      },
    ];
  }

  return [];
};
