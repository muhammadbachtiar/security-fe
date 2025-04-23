import { Suspense } from "react";
import AbsensiPage from "./_components/absensi.page";

export const metadata = {
  description: "Absensi",
  title: "Absensi",
};

function page() {
  return (
    <Suspense>
      <AbsensiPage />
    </Suspense>
  );
}

export default page;
