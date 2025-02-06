import { Metadata } from "next";
import dynamic from "next/dynamic";

const AddPage = dynamic(
  () => import("../_components/add-customer.page").then((mod) => mod.default),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Tambah Customer",
  description: "Tambah Customer",
};

export default function PageLayout() {
  return <AddPage />;
}
