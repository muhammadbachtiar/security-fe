"use client";
import AuthService from "@/services/auth/auth.service";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

function PortalPage() {
  const { data: user } = useQuery({
    queryKey: ["ME"],
    queryFn: async () => {
      const response = await AuthService.me();
      return response;
    },
  });

  return (
    <div className="w-full py-10">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col gap-10">
          <div className="flex gap-4 flex-col items-start">
            <div>
              <Image
                alt="Sarana Logo"
                src="/images/sarana-logo.png"
                width={500}
                height={500}
                className="w-[200px]"
                priority
                sizes="500px"
              />
            </div>
            <div className="flex gap-2 flex-col">
              <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl text-left">
                Selamat datang, {user?.data.username}!
              </h2>
              <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground  text-left">
                Kelola semua aplikasi anda di dalam portal ini.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link href="/core" className="flex flex-col gap-2">
              <div className="bg-white overflow-hidden rounded-md aspect-video mb-2">
                <Image
                  width={500}
                  height={300}
                  priority
                  alt={"Core App"}
                  src={"/illustration/core-illustration.svg"}
                  sizes="100vw"
                  className="h-auto object-contain"
                />
              </div>
              <h3 className="text-xl tracking-tight">Core Application</h3>
              <p className="text-muted-foreground text-base">
                Core Application untuk mengelola plan subscription, user, serta
                hak akses user di semua aplikasi.
              </p>
            </Link>
            <Link href="/human-resource" className="flex flex-col gap-2">
              <div className="bg-white overflow-hidden object-contain rounded-md aspect-video mb-2">
                <Image
                  width={500}
                  height={300}
                  priority
                  alt={"Human Resource App"}
                  src={"/illustration/hrd-illustration.svg"}
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl tracking-tight">
                Human Resource Application
              </h3>
              <p className="text-muted-foreground text-base">
                Human Resource Application untuk mengelola struktur divisi,
                staff, absensi, cuti dan lembur.
              </p>
            </Link>
            <Link href="/warehouse" className="flex flex-col gap-2">
              <div className="bg-white rounded-md aspect-video mb-2">
                <Image
                  width={500}
                  height={300}
                  priority
                  alt={"Warehouse App"}
                  src={"/illustration/warehouse-illustration.svg"}
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl tracking-tight">Warehouse Application</h3>
              <p className="text-muted-foreground text-base">
                Warehouse Application untuk mengelola gudang dan manajemen
                produk anda.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortalPage;
