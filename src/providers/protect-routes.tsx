"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authStore } from "@/store/auth.store";
import { Spin } from "antd";

function ProtectRoutes({ children }: { children: React.ReactNode }) {
  const { coreToken, hrdToken, whToken, hasHydrated } = authStore();
  const pathname = usePathname();
  const router = useRouter();

  const [redirecting, setRedirecting] = useState(false);

  const shouldRedirect = useMemo(() => {
    if (!hasHydrated) return false;
    const isNoToken = !coreToken && !hrdToken && !whToken;

    // 1. Jika di halaman "/" dan semua token tidak ada, redirect ke "/login"
    if (pathname === "/") {
      if (isNoToken) return "/login";
    }

    if (pathname === "/human-resource" && !hrdToken) {
      return "/human-resource/login";
    }

    if (pathname === "/login" && coreToken) return "/";
    // // 2. Jika di halaman "/login" dan ada coreToken, redirect ke "/"
    if (pathname === "/human-resource/login" && hrdToken)
      return "/human-resource";

    if (pathname === "/warehouse/login" && whToken) return "/warehouse";

    // // 3. Redirect proteksi role
    if (
      pathname.startsWith("/human-resource") &&
      !hrdToken &&
      pathname !== "/human-resource/login"
    )
      return "/human-resource/login";

    if (
      pathname.startsWith("/warehouse") &&
      !whToken &&
      pathname !== "/warehouse/login"
    )
      return "/warehouse/login";

    if (pathname.startsWith("/core") && !coreToken && pathname !== "/login")
      return "/login";

    return false;
  }, [pathname, coreToken, hrdToken, whToken, hasHydrated]);

  useEffect(() => {
    if (shouldRedirect) {
      setRedirecting(true);
      window.location.href = shouldRedirect;
    } else {
      setRedirecting(false);
    }
  }, [shouldRedirect, router]);

  if (!hasHydrated || redirecting) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectRoutes;
